import { spawn, type ChildProcessByStdio } from "node:child_process";
import type { Readable } from "node:stream";
import path from "node:path";
import os from "node:os";
import { existsSync, chmodSync, writeFileSync } from "node:fs";

function resolveBinary(): string {
  if (process.env.YT_DLP_PATH) return process.env.YT_DLP_PATH;
  const binDir = path.join(process.cwd(), "bin");
  if (process.platform === "linux") {
    const archBin = path.join(binDir, `yt-dlp-linux-${process.arch}`);
    if (existsSync(archBin)) return archBin;
  }
  return path.join(binDir, process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp");
}

const YT_DLP = resolveBinary();

let ensured = false;
function ensureExecutable() {
  if (ensured || process.platform === "win32") return;
  if (existsSync(YT_DLP)) {
    try {
      chmodSync(YT_DLP, 0o755);
    } catch {
      // read-only filesystem on Vercel after cold start is fine; bit stays set from build.
    }
  }
  ensured = true;
}

let cachedCookiesPath: string | null | undefined;
function resolveCookiesPath(): string | null {
  if (cachedCookiesPath !== undefined) return cachedCookiesPath;

  // Direct path wins.
  const direct = process.env.IG_COOKIES_PATH || process.env.YT_DLP_COOKIES;
  if (direct && existsSync(direct)) {
    cachedCookiesPath = direct;
    return cachedCookiesPath;
  }

  // Inline cookies (Netscape format) via env. Vercel envs survive across invocations
  // within the same lambda instance — write once to /tmp.
  const inline = process.env.IG_COOKIES_TXT;
  if (inline && inline.trim()) {
    const target = path.join(os.tmpdir(), "ig-cookies.txt");
    try {
      if (!existsSync(target)) {
        writeFileSync(target, inline, { mode: 0o600 });
      }
      cachedCookiesPath = target;
      return cachedCookiesPath;
    } catch {
      cachedCookiesPath = null;
      return cachedCookiesPath;
    }
  }

  cachedCookiesPath = null;
  return cachedCookiesPath;
}

const COMMON_ARGS = [
  "--no-playlist",
  "--no-warnings",
  "--no-cache-dir",
  "--no-progress",
];

type YtDlpProcess = ChildProcessByStdio<null, Readable, Readable>;

export function runYtDlp(args: string[]): YtDlpProcess {
  ensureExecutable();
  const cookiesPath = resolveCookiesPath();
  const cookieArgs = cookiesPath ? ["--cookies", cookiesPath] : [];
  return spawn(YT_DLP, [...COMMON_ARGS, ...cookieArgs, ...args], {
    stdio: ["ignore", "pipe", "pipe"],
  });
}

export function hasCookies(): boolean {
  return resolveCookiesPath() !== null;
}

export async function getInfo(url: string) {
  const proc = runYtDlp(["--dump-single-json", url]);
  const chunks: Buffer[] = [];
  let stderr = "";
  proc.stdout.on("data", (c) => chunks.push(c));
  proc.stderr.on("data", (c) => (stderr += c.toString()));
  const code: number = await new Promise((resolve) =>
    proc.on("close", (c) => resolve(c ?? 1)),
  );
  if (code !== 0) {
    throw new Error(stderr.trim() || `yt-dlp exited with ${code}`);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

export function streamYtDlp(args: string[]) {
  const proc = runYtDlp([...args, "-o", "-"]);
  let stderr = "";
  proc.stderr.on("data", (c) => (stderr += c.toString()));
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      proc.stdout.on("data", (chunk: Buffer) => controller.enqueue(chunk));
      proc.stdout.on("end", () => controller.close());
      proc.on("error", (err) => controller.error(err));
      proc.on("close", (code) => {
        if (code !== 0) {
          try {
            controller.error(new Error(stderr.trim() || `yt-dlp exited with ${code}`));
          } catch {
            // controller already closed
          }
        }
      });
    },
    cancel() {
      proc.kill("SIGTERM");
    },
  });
  return stream;
}

import { spawn, type ChildProcessByStdio } from "node:child_process";
import type { Readable } from "node:stream";
import { existsSync, chmodSync, writeFileSync } from "node:fs";

// Turbopack's NFT tracer in Next 16 detects `process.cwd()` and `path.join`
// as filesystem operations and pulls the entire project root (incl. node_modules,
// ~700 MB) into the serverless function. Bracket notation and turbopackIgnore
// comments did not stop it. Hide cwd resolution behind eval — the static
// analyzer cannot follow strings inside eval. LAMBDA_TASK_ROOT is set on Vercel
// and avoids the eval branch entirely in production.
function untracedRoot(): string {
  if (process.env.LAMBDA_TASK_ROOT) return process.env.LAMBDA_TASK_ROOT;
  // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-eval
  return (0, eval)("process.cwd()") as string;
}

let resolvedBin: string | null = null;
function getBin(): string {
  if (resolvedBin) return resolvedBin;
  if (process.env.YT_DLP_PATH) {
    resolvedBin = process.env.YT_DLP_PATH;
    return resolvedBin;
  }
  const root = untracedRoot();
  if (process.platform === "linux") {
    resolvedBin = `${root}/bin/yt-dlp-linux-${process.arch}`;
  } else if (process.platform === "win32") {
    resolvedBin = `${root}/bin/yt-dlp.exe`;
  } else {
    resolvedBin = `${root}/bin/yt-dlp`;
  }
  return resolvedBin;
}

let ensured = false;
function ensureExecutable(bin: string) {
  if (ensured || process.platform === "win32") return;
  ensured = true;
  try {
    chmodSync(bin, 0o755);
  } catch {
    // Read-only filesystem on Vercel after cold start; the executable bit
    // is preserved from build time, so this is fine.
  }
}

let cachedCookiesPath: string | null | undefined;
function resolveCookiesPath(): string | null {
  if (cachedCookiesPath !== undefined) return cachedCookiesPath;

  const direct = process.env.IG_COOKIES_PATH || process.env.YT_DLP_COOKIES;
  if (direct && existsSync(direct)) {
    cachedCookiesPath = direct;
    return cachedCookiesPath;
  }

  const inline = process.env.IG_COOKIES_TXT;
  if (inline && inline.trim()) {
    // /tmp is writable on Vercel and outside the project root, so this
    // does not trigger over-tracing.
    const target = "/tmp/ig-cookies.txt";
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
  const bin = getBin();
  ensureExecutable(bin);
  const cookiesPath = resolveCookiesPath();
  const cookieArgs = cookiesPath ? ["--cookies", cookiesPath] : [];
  return spawn(bin, [...COMMON_ARGS, ...cookieArgs, ...args], {
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

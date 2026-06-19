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
  const name =
    process.platform === "linux"
      ? `yt-dlp-linux-${process.arch}`
      : process.platform === "win32"
        ? "yt-dlp.exe"
        : "yt-dlp";
  // Locally the task root is apps/web; on Vercel the function root is the
  // monorepo root with the app nested under apps/web. Probe both.
  const candidates = [`${root}/bin/${name}`, `${root}/apps/web/bin/${name}`];
  resolvedBin = candidates.find((p) => existsSync(p)) ?? candidates[0];
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

// YouTube gates the default web client behind "Sign in to confirm you're not a
// bot", which fires almost every time from a server/datacenter IP (Vercel).
// The `android_vr` and `web_embedded` clients are the only ones that need no PO
// token (per yt-dlp's PO Token Guide), so they still return playable formats
// from datacenter IPs without cookies. Lead with them, then fall back to the
// web clients (useful when cookies ARE configured). The extractor-args namespace
// is `youtube:`, so this is ignored for the IG/TikTok extractors.
function youtubeExtractorArgs(): string {
  const parts = ["player_client=android_vr,web_embedded,tv,web_safari,default"];
  // Optional manual PO token (yt-dlp PO Token Guide): pass as
  // `web_embedded.gvs+TOKEN` style entries via YT_DLP_PO_TOKEN, e.g.
  // "web_embedded.gvs+XXX,web_embedded.player+YYY".
  const poToken = process.env.YT_DLP_PO_TOKEN?.trim();
  if (poToken) parts.push(`po_token=${poToken}`);
  const visitorData = process.env.YT_DLP_VISITOR_DATA?.trim();
  if (visitorData) parts.push(`visitor_data=${visitorData}`);
  return `youtube:${parts.join(";")}`;
}

function commonArgs(): string[] {
  return [
    "--no-playlist",
    "--no-warnings",
    "--no-cache-dir",
    "--no-progress",
    // Tolerate transient throttling/challenges before giving up.
    "--extractor-retries",
    "3",
    "--extractor-args",
    youtubeExtractorArgs(),
  ];
}

type YtDlpProcess = ChildProcessByStdio<null, Readable, Readable>;

export function runYtDlp(args: string[]): YtDlpProcess {
  const bin = getBin();
  ensureExecutable(bin);
  const cookiesPath = resolveCookiesPath();
  const cookieArgs = cookiesPath ? ["--cookies", cookiesPath] : [];
  return spawn(bin, [...commonArgs(), ...cookieArgs, ...args], {
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

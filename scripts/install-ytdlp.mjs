// Downloads yt-dlp binaries for local dev + both Linux architectures (used on Vercel).
// Runs via `postinstall`.
//
// Layout produced in ./bin/:
//   yt-dlp                 (local platform-native: macOS/Windows/Linux)
//   yt-dlp-linux-x64       (Vercel x86_64 runtime)
//   yt-dlp-linux-arm64     (Vercel Graviton runtime)
//
// lib/ytdlp.ts picks the right one at runtime.
import { createWriteStream, existsSync, mkdirSync, chmodSync, statSync } from "node:fs";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import path from "node:path";

const BASE = "https://github.com/yt-dlp/yt-dlp/releases/latest/download";

const PLATFORM_BIN = {
  linux: "yt-dlp_linux",
  darwin: "yt-dlp_macos",
  win32: "yt-dlp.exe",
};

const LINUX_ARCH_BIN = {
  x64: "yt-dlp_linux",
  arm64: "yt-dlp_linux_aarch64",
};

const BIN_DIR = path.join(process.cwd(), "bin");
if (!existsSync(BIN_DIR)) mkdirSync(BIN_DIR, { recursive: true });

async function download(filename, dest) {
  const url = `${BASE}/${filename}`;
  console.log(`Downloading ${filename} -> ${dest}`);
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok || !res.body) {
    throw new Error(`HTTP ${res.status} fetching ${url}`);
  }
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
  if (process.platform !== "win32") chmodSync(dest, 0o755);
  const size = statSync(dest).size;
  console.log(`  wrote ${size} bytes`);
  if (size < 1_000_000) {
    throw new Error(`Downloaded ${filename} too small (${size} bytes); likely a redirect HTML page.`);
  }
}

async function ensurePlatformBinary() {
  const localName = process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp";
  const target = path.join(BIN_DIR, localName);
  if (existsSync(target)) return;
  const remote = PLATFORM_BIN[process.platform];
  if (!remote) {
    console.warn(`Unsupported local platform ${process.platform}; skipping local binary.`);
    return;
  }
  await download(remote, target);
}

async function ensureVercelBinaries() {
  // On Vercel builds, the runtime architecture may differ from build-time (Graviton/ARM64).
  // Download both so we can pick at runtime.
  if (!process.env.VERCEL && process.platform !== "linux") return;
  for (const [arch, remote] of Object.entries(LINUX_ARCH_BIN)) {
    const target = path.join(BIN_DIR, `yt-dlp-linux-${arch}`);
    if (existsSync(target)) {
      console.log(`Already present: ${target}`);
      continue;
    }
    await download(remote, target);
  }
}

async function main() {
  await ensurePlatformBinary();
  await ensureVercelBinaries();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

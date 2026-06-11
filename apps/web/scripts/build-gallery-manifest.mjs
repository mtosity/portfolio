// Builds gallery-meta/manifest.json in Vercel Blob: pixel dimensions for every
// gallery image, so /photography can lay out the justified grid without
// loading a single image byte. Re-run after uploading new photos:
//   pnpm --filter @mtosity/web build-gallery-manifest
import { list, put } from "@vercel/blob";
import sharp from "sharp";
import { loadEnv } from "./_env.mjs";

loadEnv();

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
// JPEG SOF markers normally live in the first few KB, but a fat EXIF block can
// push them out — 512 KB covers everything we have while staying cheap.
const HEADER_BYTES = 512 * 1024;

async function dimensionsFor(url) {
  const headerRes = await fetch(url, {
    headers: { Range: `bytes=0-${HEADER_BYTES - 1}` },
  });
  let buf = Buffer.from(await headerRes.arrayBuffer());
  try {
    const meta = await sharp(buf).metadata();
    if (meta.width && meta.height) return normalize(meta);
  } catch {
    // Truncated header wasn't enough — fall through to a full download.
  }
  const fullRes = await fetch(url);
  buf = Buffer.from(await fullRes.arrayBuffer());
  return normalize(await sharp(buf).metadata());
}

// EXIF orientations 5-8 are rotated 90° — swap so CSS-facing dims are correct.
function normalize(meta) {
  const rotated = (meta.orientation ?? 1) >= 5;
  return rotated
    ? { width: meta.height, height: meta.width }
    : { width: meta.width, height: meta.height };
}

const { blobs } = await list({ prefix: "gallery/", limit: 1000 });
const images = blobs.filter((b) =>
  IMAGE_EXTENSIONS.some((ext) => b.pathname.toLowerCase().endsWith(ext)),
);
console.log(`Probing ${images.length} images...`);

const manifest = {};
let done = 0;
// Modest concurrency: header-range fetches are tiny, but be polite.
const queue = [...images];
await Promise.all(
  Array.from({ length: 8 }, async () => {
    for (let blob = queue.shift(); blob; blob = queue.shift()) {
      const filename = blob.pathname.split("/").pop();
      try {
        manifest[filename] = await dimensionsFor(blob.url);
      } catch (err) {
        console.warn(`  skip ${filename}: ${err.message}`);
      }
      if (++done % 25 === 0) console.log(`  ${done}/${images.length}`);
    }
  }),
);

const result = await put("gallery-meta/manifest.json", JSON.stringify(manifest), {
  access: "public",
  contentType: "application/json",
  allowOverwrite: true,
  addRandomSuffix: false,
});
console.log(`Wrote ${Object.keys(manifest).length} entries -> ${result.url}`);

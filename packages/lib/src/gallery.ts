import { list } from "@vercel/blob";

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  takenTime: number;
  width?: number;
  height?: number;
}

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

// Pixel dimensions per filename, precomputed by scripts/build-gallery-manifest.mjs
// so the justified grid can lay out before a single image byte arrives.
const MANIFEST_PATHNAME = "gallery-meta/manifest.json";

type Manifest = Record<string, { width: number; height: number }>;

async function fetchManifest(): Promise<Manifest> {
  try {
    const { blobs } = await list({ prefix: MANIFEST_PATHNAME, limit: 1 });
    if (!blobs[0]) return {};
    const res = await fetch(blobs[0].url, { cache: "no-store" });
    if (!res.ok) return {};
    return (await res.json()) as Manifest;
  } catch {
    return {};
  }
}

export async function listGalleryImages(): Promise<GalleryImage[]> {
  const [{ blobs }, manifest] = await Promise.all([
    list({ prefix: "gallery/", limit: 1000 }),
    fetchManifest(),
  ]);

  const images = blobs
    .filter((blob) =>
      IMAGE_EXTENSIONS.some((ext) => blob.pathname.toLowerCase().endsWith(ext)),
    )
    .map((blob) => {
      const filename = blob.pathname.split("/").pop() || blob.pathname;
      const dims = manifest[filename];
      return {
        id: filename,
        src: blob.url,
        alt: `Photo ${filename}`,
        takenTime: new Date(blob.uploadedAt).getTime(),
        ...(dims ? { width: dims.width, height: dims.height } : {}),
      };
    });

  images.sort((a, b) => b.takenTime - a.takenTime);
  return images;
}

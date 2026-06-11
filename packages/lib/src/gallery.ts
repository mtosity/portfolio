import { list, put } from "@vercel/blob";

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  takenTime: number;
  width?: number;
  height?: number;
}

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

// Pixel dimensions per filename, maintained by the admin upload flow (and
// scripts/build-gallery-manifest.mjs for backfills) so the justified grid can
// lay out before a single image byte arrives.
export const MANIFEST_PATHNAME = "gallery-meta/manifest.json";

export type GalleryManifest = Record<string, { width: number; height: number }>;

export async function readManifest(): Promise<GalleryManifest> {
  try {
    const { blobs } = await list({ prefix: MANIFEST_PATHNAME, limit: 1 });
    if (!blobs[0]) return {};
    const res = await fetch(blobs[0].url, { cache: "no-store" });
    if (!res.ok) return {};
    return (await res.json()) as GalleryManifest;
  } catch {
    return {};
  }
}

export async function writeManifest(manifest: GalleryManifest): Promise<void> {
  await put(MANIFEST_PATHNAME, JSON.stringify(manifest), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
    addRandomSuffix: false,
  });
}

export async function listGalleryImages(): Promise<GalleryImage[]> {
  const [{ blobs }, manifest] = await Promise.all([
    list({ prefix: "gallery/", limit: 1000 }),
    readManifest(),
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

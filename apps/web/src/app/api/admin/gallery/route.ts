import { NextResponse } from "next/server";
import { list, del } from "@vercel/blob";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".webp"];

// GET /api/admin/gallery — list every gallery image (with pathname for delete).
export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { blobs } = await list({ prefix: "gallery/", limit: 1000 });
    const images = blobs
      .filter((b) =>
        IMAGE_EXTS.some((ext) => b.pathname.toLowerCase().endsWith(ext))
      )
      .map((b) => ({
        pathname: b.pathname,
        url: b.url,
        size: b.size,
        uploadedAt: new Date(b.uploadedAt).getTime(),
      }))
      .sort((a, b) => b.uploadedAt - a.uploadedAt);
    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ error: "Failed to list gallery" }, { status: 500 });
  }
}

// DELETE /api/admin/gallery — remove one image by its blob URL.
export async function DELETE(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { url } = (await req.json()) as { url?: string };
    if (!url) {
      return NextResponse.json({ error: "Missing url" }, { status: 400 });
    }
    await del(url);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

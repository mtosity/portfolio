import { NextResponse } from "next/server";
import { listGalleryImages } from "@mtosity/lib/gallery";

export async function GET() {
  try {
    const images = await listGalleryImages();
    return NextResponse.json(
      { images },
      {
        headers: {
          // Cache at the CDN; uploads show up within 5 minutes.
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    console.error("Error reading gallery from Blob storage:", error);
    return NextResponse.json({ error: "Failed to read gallery" }, { status: 500 });
  }
}

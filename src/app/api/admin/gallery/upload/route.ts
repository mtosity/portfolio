import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

// Issues short-lived tokens so the browser can upload large photos straight to
// Vercel Blob (bypassing the serverless request-body size limit). Auth is
// enforced before any token is granted.
export async function POST(req: Request): Promise<NextResponse> {
  const body = (await req.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        const session = await auth();
        if (!session) throw new Error("Unauthorized");
        // Only allow images, and keep everything under the gallery/ prefix.
        if (!pathname.startsWith("gallery/")) {
          throw new Error("Uploads must go under gallery/");
        }
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp"],
          addRandomSuffix: true,
          maximumSizeInBytes: 25 * 1024 * 1024,
        };
      },
      onUploadCompleted: async () => {
        // No-op: the gallery is derived from the blob listing on read.
      },
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || "Upload failed" },
      { status: 400 }
    );
  }
}

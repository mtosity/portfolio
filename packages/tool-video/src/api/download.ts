import { NextRequest, NextResponse } from "next/server";
import { streamYtDlp } from "../lib/yt-dlp";
import { checkRateLimit } from "@mtosity/lib/rate-limit";
import { parseVideoUrl } from "../lib/video-url";


export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const ref = url ? parseVideoUrl(url) : null;
  if (!url || !ref) {
    return NextResponse.json(
      { error: "Unsupported URL. Paste an Instagram, YouTube, or TikTok link." },
      { status: 400 },
    );
  }

  const rl = await checkRateLimit(req);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again later." },
      { status: 429 },
    );
  }

  const stream = streamYtDlp(["-f", "mp4/best[ext=mp4]/best", url]);

  return new Response(stream, {
    headers: {
      "Content-Type": "video/mp4",
      "Content-Disposition": `attachment; filename="${ref.platform}-${ref.id}.mp4"`,
      "Cache-Control": "no-store",
    },
  });
}

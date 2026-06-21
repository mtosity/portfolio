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

  // Prefer m4a (AAC) — decodable by browser AudioContext without ffmpeg.
  const stream = streamYtDlp(["-f", "bestaudio[ext=m4a]/bestaudio", url]);

  return new Response(stream, {
    headers: {
      "Content-Type": "audio/mp4",
      "Content-Disposition": `inline; filename="${ref.platform}-${ref.id}.m4a"`,
      "Cache-Control": "no-store",
    },
  });
}

import { NextRequest, NextResponse } from "next/server";
import { streamYtDlp } from "../lib/yt-dlp";
import { checkRateLimit } from "@mtosity/lib/rate-limit";
import { parseInstagramUrl } from "../lib/instagram-url";


export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const ref = url ? parseInstagramUrl(url) : null;
  if (!url || !ref) {
    return NextResponse.json({ error: "Invalid Instagram URL" }, { status: 400 });
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
      "Content-Disposition": `attachment; filename="reel-${ref.shortcode}.mp4"`,
      "Cache-Control": "no-store",
    },
  });
}

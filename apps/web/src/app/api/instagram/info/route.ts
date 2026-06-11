import { NextRequest, NextResponse } from "next/server";
import { getInfo, hasCookies } from "@/lib/yt-dlp";
import { checkRateLimit } from "@/lib/rate-limit";
import { parseInstagramUrl } from "@/lib/instagram-url";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const { url } = (await req.json().catch(() => ({}))) as { url?: string };
  if (!url || !parseInstagramUrl(url)) {
    return NextResponse.json({ error: "Invalid Instagram URL" }, { status: 400 });
  }

  const rl = await checkRateLimit(req);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rl.reset - Date.now()) / 1000)),
        },
      },
    );
  }

  try {
    const info = await getInfo(url);
    return NextResponse.json({
      title: info.title ?? info.description ?? "Untitled",
      thumbnail: info.thumbnail ?? null,
      duration: info.duration ?? null,
      uploader: info.uploader ?? info.channel ?? null,
      width: info.width ?? null,
      height: info.height ?? null,
    });
  } catch (err) {
    const raw = err instanceof Error ? err.message : "Failed to read reel";
    const blocked =
      /rate-limit|login required|requested content is not available|cookies/i.test(
        raw,
      );
    const message = blocked
      ? hasCookies()
        ? "Instagram blocked this request even with cookies — they may be expired. Refresh IG_COOKIES_TXT or try a different post."
        : "Instagram requires authentication to view this reel. Set IG_COOKIES_TXT (Netscape cookies.txt) or IG_COOKIES_PATH on the server. See https://github.com/yt-dlp/yt-dlp/wiki/FAQ#how-do-i-pass-cookies-to-yt-dlp"
      : raw;
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

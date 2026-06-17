import { NextRequest, NextResponse } from "next/server";
import { getInfo, hasCookies } from "../lib/yt-dlp";
import { checkRateLimit } from "@mtosity/lib/rate-limit";
import { parseVideoUrl } from "../lib/video-url";


export async function POST(req: NextRequest) {
  const { url } = (await req.json().catch(() => ({}))) as { url?: string };
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
    const raw = err instanceof Error ? err.message : "Failed to read video";
    const blocked =
      /rate-limit|login required|requested content is not available|sign in|not a bot|private|cookies/i.test(
        raw,
      );
    const message = blocked
      ? buildBlockedMessage(ref.platform, hasCookies())
      : raw;
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

const COOKIES_DOC =
  "https://github.com/yt-dlp/yt-dlp/wiki/FAQ#how-do-i-pass-cookies-to-yt-dlp";

function buildBlockedMessage(
  platform: "instagram" | "youtube" | "tiktok",
  hasCookiesConfigured: boolean,
): string {
  const label =
    platform === "youtube"
      ? "YouTube"
      : platform === "tiktok"
        ? "TikTok"
        : "Instagram";

  if (hasCookiesConfigured) {
    return `${label} blocked this request even with cookies — they may be expired. Refresh the cookies (YT_DLP_COOKIES / IG_COOKIES_TXT) or try a different link.`;
  }

  if (platform === "youtube") {
    return `YouTube blocked this request — it sometimes flags server/datacenter IPs as bots ("sign in to confirm you're not a bot"). Try again in a moment, use a different video, or set YT_DLP_COOKIES (Netscape cookies.txt) on the server. See ${COOKIES_DOC}`;
  }

  return `${label} requires authentication to view this content. Set YT_DLP_COOKIES / IG_COOKIES_TXT (Netscape cookies.txt) or IG_COOKIES_PATH on the server. See ${COOKIES_DOC}`;
}

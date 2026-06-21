import { NextRequest, NextResponse } from "next/server";


const ALLOWED_HOSTS = [
  // Instagram
  ".cdninstagram.com",
  ".fbcdn.net",
  ".instagram.com",
  // YouTube
  ".ytimg.com",
  ".ggpht.com",
  ".googleusercontent.com",
  // TikTok
  ".tiktokcdn.com",
  ".tiktokcdn-us.com",
  ".tiktokcdn-eu.com",
  ".ibyteimg.com",
  ".ttwstatic.com",
  ".muscdn.com",
];

export async function GET(req: NextRequest) {
  const target = req.nextUrl.searchParams.get("url");
  if (!target) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  if (parsed.protocol !== "https:") {
    return NextResponse.json({ error: "Only https allowed" }, { status: 400 });
  }

  const host = parsed.hostname;
  if (!ALLOWED_HOSTS.some((suffix) => host === suffix.slice(1) || host.endsWith(suffix))) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(parsed.toString(), {
      // No Referer / no Origin so Instagram's CDN serves the image
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      },
      cache: "no-store",
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "fetch failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { error: `Upstream ${upstream.status}` },
      { status: 502 },
    );
  }

  const contentType = upstream.headers.get("content-type") ?? "image/jpeg";
  return new Response(upstream.body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=300",
    },
  });
}

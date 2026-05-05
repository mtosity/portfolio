const URL_RE =
  /^https?:\/\/(?:www\.)?instagram\.com\/(reel|reels|p|tv)\/([A-Za-z0-9_-]+)/;

export type InstagramRef = { shortcode: string; kind: string };

export function parseInstagramUrl(input: string): InstagramRef | null {
  const m = input.trim().match(URL_RE);
  if (!m) return null;
  return { kind: m[1], shortcode: m[2] };
}

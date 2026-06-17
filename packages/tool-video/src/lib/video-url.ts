export type VideoPlatform = "instagram" | "youtube" | "tiktok";

export type VideoRef = { platform: VideoPlatform; id: string };

const MATCHERS: { platform: VideoPlatform; re: RegExp }[] = [
  {
    platform: "instagram",
    re: /^https?:\/\/(?:www\.)?instagram\.com\/(?:[^/]+\/)?(?:reel|reels|p|tv)\/([A-Za-z0-9_-]+)/,
  },
  {
    platform: "youtube",
    re: /^https?:\/\/(?:www\.)?youtube\.com\/(?:watch\?(?:[^#]*&)?v=|shorts\/|embed\/|live\/|v\/)([A-Za-z0-9_-]{6,})/,
  },
  {
    platform: "youtube",
    re: /^https?:\/\/youtu\.be\/([A-Za-z0-9_-]{6,})/,
  },
  {
    platform: "tiktok",
    re: /^https?:\/\/(?:www\.)?tiktok\.com\/@[^/]+\/video\/(\d+)/,
  },
  {
    platform: "tiktok",
    re: /^https?:\/\/(?:www\.|vm\.|vt\.)?tiktok\.com\/(?:t\/|v\/|embed\/)?([A-Za-z0-9]+)/,
  },
];

export function parseVideoUrl(input: string): VideoRef | null {
  const trimmed = input.trim();
  for (const { platform, re } of MATCHERS) {
    const m = trimmed.match(re);
    if (m?.[1]) return { platform, id: m[1] };
  }
  return null;
}

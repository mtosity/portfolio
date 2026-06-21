import { SITE_URL } from "@mtosity/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Video Extractor",
  description:
    "Paste a public Instagram, YouTube, or TikTok URL to grab the video, the audio, or a full transcript — Whisper runs locally in your browser.",
  openGraph: {
    title: "Video Extractor | MTosity Tools",
    description:
      "Paste a public Instagram, YouTube, or TikTok URL to grab the video, the audio, or a full transcript — Whisper runs locally in your browser.",
    url: `${SITE_URL}/tools/video`,
  },
};

export default function VideoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

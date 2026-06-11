import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instagram Reel Extractor",
  description:
    "Paste a public Instagram reel URL to grab the video, the audio, or a full transcript — Whisper runs locally in your browser.",
  openGraph: {
    title: "Instagram Reel Extractor | MTosity Tools",
    description:
      "Paste a public Instagram reel URL to grab the video, the audio, or a full transcript — Whisper runs locally in your browser.",
    url: "https://mtosity.com/tools/instagram",
  },
};

export default function InstagramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

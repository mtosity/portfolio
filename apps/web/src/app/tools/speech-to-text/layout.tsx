import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Speech to Text",
  description:
    "On-device speech transcription with Whisper. Runs entirely in your browser — no audio leaves your device.",
  openGraph: {
    title: "Speech to Text | MTosity Tools",
    description:
      "On-device speech transcription with Whisper. Runs entirely in your browser — no audio leaves your device.",
    url: "https://mtosity.com/tools/speech-to-text",
  },
};

export default function STTLayout({ children }: { children: React.ReactNode }) {
  return children;
}

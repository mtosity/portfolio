export type ToolIconName = "mic" | "grid" | "reel";

export type Tool = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  status: "live" | "beta" | "wip";
  year: string;
  icon: ToolIconName;
};

export const tools: Tool[] = [
  {
    slug: "speech-to-text",
    title: "Speech to Text",
    tagline: "On-device transcription with Whisper.",
    description:
      "Press the mic, speak, get a transcript — no servers, no uploads. Whisper runs entirely in your browser via @huggingface/transformers + WebAssembly.",
    tags: ["Whisper", "WASM", "Transformers.js", "Privacy"],
    status: "live",
    year: "2026",
    icon: "mic",
  },
  {
    slug: "img-grid",
    title: "Image Grid",
    tagline: "Combine multiple images into one composition.",
    description:
      "Drop images, pick a layout, pan / zoom each tile, export a PNG. Pure Canvas, zero uploads — everything runs in the browser.",
    tags: ["Canvas", "Drag & drop", "Pan/zoom", "PNG export"],
    status: "live",
    year: "2026",
    icon: "grid",
  },
  {
    slug: "video",
    title: "Video Extractor",
    tagline: "MP4, audio, or transcript from any public video.",
    description:
      "Paste a public Instagram, YouTube, or TikTok URL to download the video or generate a full transcript. Audio is fetched server-side via yt-dlp; transcription happens locally in-browser via WASM Whisper.",
    tags: ["yt-dlp", "Whisper", "WASM", "Next.js API"],
    status: "live",
    year: "2026",
    icon: "reel",
  },
];

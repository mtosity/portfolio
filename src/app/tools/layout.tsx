import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tools",
  description:
    "Small browser-only tools I've built for myself. No accounts, no uploads, no telemetry.",
  openGraph: {
    title: "Tools | MTosity",
    description:
      "Small browser-only tools I've built for myself. No accounts, no uploads, no telemetry.",
    url: "https://mtosity.com/tools",
  },
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

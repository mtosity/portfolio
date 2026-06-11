import { SITE_URL } from "@mtosity/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Grid",
  description:
    "Combine multiple images into a single composition. Drop, drag, pan, zoom, export — entirely client-side.",
  openGraph: {
    title: "Image Grid | MTosity Tools",
    description:
      "Combine multiple images into a single composition. Drop, drag, pan, zoom, export — entirely client-side.",
    url: `${SITE_URL}/tools/img-grid`,
  },
};

export default function ImgGridLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

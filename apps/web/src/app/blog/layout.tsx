import { Metadata } from "next";

export const metadata: Metadata = {
  // `default` titles /blog itself; `template` suffixes the posts beneath it.
  //
  // Without the template a post rendered as a bare "React Performance: From
  // Audit to Optimization" while every other page on the site carries the
  // "| MTosity" suffix — the root template only cascades until a segment sets
  // its own title, which this layout does.
  //
  // Before the 2026-08-07 migration posts had no metadata at all (the static
  // folder routes shadowed [slug]) so they inherited this layout wholesale and
  // every post shared the title "Writing | MTosity".
  title: {
    default: "Writing",
    template: "%s | MTosity",
  },
  description: "Leave some notes for the world. Technical blog posts and musings by MTosity.",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

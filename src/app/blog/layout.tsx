import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writing",
  description: "Leave some notes for the world. Technical blog posts and musings by MTosity.",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

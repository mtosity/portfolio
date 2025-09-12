"use client";

import { SlideTabs } from "@/components/SlideTabs";
import Link from "next/link";

export default function BlogHome() {
  return (
    <div className="relative">
      <div className="sticky top-4 bg-transparent z-10">
        <SlideTabs />
      </div>

      <div className="max-w-7xl mx-auto pb-8 pt-12 h-[calc(100vh-5rem)] overflow-hidden flex flex-col items-center">
        <Link href="/blog" className="text-blue-500 hover:underline mb-4">
          &larr; Back to technical stuff
        </Link>
        <iframe
          src="https://mtosity.leaflet.pub/"
          width={"100%"}
          height={"100%"}
        />
      </div>
    </div>
  );
}

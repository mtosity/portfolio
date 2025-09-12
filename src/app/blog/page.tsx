"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { SlideTabs } from "@/components/SlideTabs";
import CategoryFilter from "@/components/blog/CategoryFilter";
import { blogPosts, CategoryType } from "@/data/blogPosts";

const LottieAnimation = dynamic(
  () => import("@/components/blog/LottieAnimation"),
  {
    ssr: false,
    loading: () => (
      <div className="w-[400px] h-[400px] rounded-2xl bg-gray-800 animate-pulse" />
    ),
  }
);

export default function BlogHome() {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryType>("Building");

  const filteredPosts = blogPosts.filter(
    (post) => post.category === selectedCategory
  );

  return (
    <div className="relative">
      <div className="sticky top-4 bg-transparent z-10">
        <SlideTabs />
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-8 pt-12 h-[calc(100vh-5rem)] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 h-full">
          {/* Left Column - Header, Subheader, and Image */}
          <div className="flex flex-col h-full lg:col-span-2">
            <header className="mb-8 flex-shrink-0 pb-6">
              <h1 className="text-4xl lg:text-5xl font-bold mb-2 font-heading tracking-tight">
                MTosity&apos;s Blog
              </h1>
              <p className="text-gray-400 text-lg font-serif font-light">
                Carpe diem
              </p>
            </header>

            <div className="min-h-0 flex items-start justify-center">
              <LottieAnimation />
            </div>
          </div>

          {/* Right Column - Blog List */}
          <div className="flex flex-col h-full overflow-hidden lg:col-span-3">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />

            <div className="space-y-8 overflow-y-auto flex-1 pr-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              {filteredPosts.map((post, index) => (
                <article
                  key={post.slug}
                  className={`${
                    index !== filteredPosts.length - 1
                      ? "border-b border-gray-700 pb-8"
                      : ""
                  }`}
                >
                  <div className="mb-3">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wide border ${
                        post.category === "Building"
                          ? "text-blue-300 border-blue-600 bg-blue-900/20"
                          : post.category === "Living"
                          ? "text-green-300 border-green-600 bg-green-900/20"
                          : post.category === "Money"
                          ? "text-purple-300 border-purple-600 bg-purple-900/20"
                          : post.category === "Tiếng Việt"
                          ? "text-yellow-300 border-yellow-600 bg-yellow-900/20"
                          : "text-gray-300 border-gray-600 bg-gray-900/20"
                      }`}
                    >
                      {post.category}
                    </span>
                  </div>
                  <h2 className="text-2xl font-semibold font-heading mb-3 leading-tight">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-gray-400 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <div className="text-sm text-gray-400 mb-4 font-sans font-medium uppercase tracking-wide">
                    {post.date}
                  </div>
                  <p className="text-gray-300 break-words leading-relaxed font-serif">
                    {post.excerpt}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

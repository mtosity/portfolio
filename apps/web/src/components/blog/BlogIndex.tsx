"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { SlideTabs } from "@mtosity/design-system";
import CategoryFilter from "@/components/blog/CategoryFilter";
import type { BlogListItem, CategoryType } from "@/data/blogPosts";

const LottieAnimation = dynamic(
  () => import("@/components/blog/LottieAnimation"),
  {
    ssr: false,
    loading: () => (
      <div style={{ width: 300, height: 300, background: "var(--bg-secondary)" }} />
    ),
  }
);

/**
 * The /blog index. Presentation only — the feed (hand-written posts merged with
 * PUBLISHED database posts, newest first) is assembled on the server by
 * `postSource.listBlogIndexItems()` and handed down as `posts`. Drafts never
 * reach this component.
 */
export default function BlogIndex({ posts }: { posts: BlogListItem[] }) {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryType>("Building");

  const filteredPosts = posts.filter(
    (post) => post.category === selectedCategory
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--fg)" }}>
      <SlideTabs />

      <div
        style={{
          maxWidth: "1152px",
          margin: "0 auto",
          padding: "0 1.5rem 4rem",
          paddingTop: "calc(56px + 3rem)",
        }}
      >
        <div className="blog-list-grid">
          {/* Left column */}
          <motion.div
            style={{ display: "flex", flexDirection: "column" }}
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            <div
              style={{
                borderBottom: "1px solid var(--border)",
                paddingBottom: "2rem",
                marginBottom: "2rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "0.75rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.8125rem",
                    color: "var(--accent-text)",
                  }}
                >
                  06 —
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "var(--fg)",
                  }}
                >
                  Writing
                </span>
              </div>
              <h1
                style={{
                  fontSize: "clamp(2.25rem, 4vw, 3.25rem)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.04em",
                  margin: "1.25rem 0 0",
                  maxWidth: "14ch",
                }}
              >
                Leave some notes for the world.
              </h1>
            </div>

            <Link
              href="/notes"
              className="link-tint"
              style={{
                fontSize: "0.9375rem",
                fontWeight: 500,
                width: "fit-content",
                display: "inline-block",
                marginBottom: "2rem",
              }}
            >
              Personal notes →
            </Link>

            {/* Lottie — hidden on mobile */}
            <div className="blog-lottie-wrapper">
              <LottieAnimation />
            </div>
          </motion.div>

          {/* Right column — post list */}
          <motion.div
            style={{ display: "flex", flexDirection: "column" }}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />

            <div className="scrollbar-thin" style={{ overflowY: "auto", flex: 1 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCategory}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  {filteredPosts.map((post, index) => (
                    <motion.article
                      key={post.slug}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: index * 0.06,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{
                        borderBottom:
                          index !== filteredPosts.length - 1
                            ? "1px solid var(--border-light)"
                            : "none",
                        padding: "1.75rem 0",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          justifyContent: "space-between",
                          gap: "1rem",
                          marginBottom: "0.6rem",
                        }}
                      >
                        <span className="tag tag-neutral">{post.category}</span>
                        <span
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: "0.8125rem",
                            color: "var(--muted)",
                            fontVariantNumeric: "tabular-nums",
                            flexShrink: 0,
                          }}
                        >
                          {post.date}
                        </span>
                      </div>

                      <h2
                        style={{
                          fontSize: "clamp(1.375rem, 1.2rem + 0.5vw, 1.625rem)",
                          lineHeight: 1.18,
                          letterSpacing: "-0.03em",
                          margin: "0 0 0.5rem",
                        }}
                      >
                        <Link
                          href={`/blog/${post.slug}`}
                          className="blog-index-title"
                        >
                          {post.title}
                        </Link>
                      </h2>

                      <p
                        style={{
                          fontSize: "0.9375rem",
                          color: "var(--muted)",
                          lineHeight: 1.6,
                        }}
                      >
                        {post.excerpt}
                      </p>
                    </motion.article>
                  ))}

                  {filteredPosts.length === 0 && (
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.9375rem",
                        color: "var(--muted)",
                        padding: "3rem 0",
                      }}
                    >
                      No posts in this category yet.
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
      <style>{`
        .blog-index-title { color: var(--fg); text-decoration: none; transition: color var(--duration-fast) var(--ease-out); }
        .blog-index-title:hover { color: var(--accent-text); }
      `}</style>
    </div>
  );
}

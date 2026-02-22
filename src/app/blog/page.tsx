"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { SlideTabs } from "@/components/SlideTabs";
import CategoryFilter from "@/components/blog/CategoryFilter";
import { blogPosts, CategoryType } from "@/data/blogPosts";

const LottieAnimation = dynamic(
  () => import("@/components/blog/LottieAnimation"),
  {
    ssr: false,
    loading: () => (
      <div style={{ width: 300, height: 300, background: "var(--bg-secondary)" }} />
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
                    fontSize: "0.75rem",
                    letterSpacing: "0.2em",
                    color: "var(--muted)",
                  }}
                >
                  06 —
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--fg)",
                  }}
                >
                  WRITING
                </span>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.8125rem",
                  color: "var(--muted)",
                  letterSpacing: "0.03em",
                }}
              >
                Leave some notes for the world.
              </p>
            </div>

            <Link
              href="/notes"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--fg)",
                textDecoration: "none",
                borderBottom: "1px solid var(--border-light)",
                paddingBottom: "1px",
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
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.65rem",
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: "var(--muted)",
                            border: "1px solid var(--border-light)",
                            padding: "0.15rem 0.5rem",
                          }}
                        >
                          {post.category}
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.7rem",
                            letterSpacing: "0.08em",
                            color: "var(--muted)",
                            flexShrink: 0,
                          }}
                        >
                          {post.date}
                        </span>
                      </div>

                      <h2
                        style={{
                          fontFamily: "var(--font-crimson-text), Georgia, serif",
                          fontSize: "1.4rem",
                          fontWeight: 600,
                          lineHeight: 1.3,
                          marginBottom: "0.6rem",
                        }}
                      >
                        <Link
                          href={`/blog/${post.slug}`}
                          style={{
                            color: "var(--fg)",
                            textDecoration: "none",
                            transition: "opacity 0.15s",
                          }}
                          onMouseEnter={(e) =>
                            ((e.currentTarget as HTMLElement).style.opacity = "0.6")
                          }
                          onMouseLeave={(e) =>
                            ((e.currentTarget as HTMLElement).style.opacity = "1")
                          }
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
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.75rem",
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
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SiteNav, SiteFooter } from "@mtosity/design-system";
import { categories, type BlogListItem, type CategoryType } from "@/data/blogPosts";

type Section = "All" | CategoryType;

/* Some excerpts were stored with HTML entities (`brain&apos;s`). */
const ENTITIES: Record<string, string> = { "&apos;": "\u2019", "&#39;": "\u2019", "&quot;": "\u201c", "&amp;": "&", "&nbsp;": " " };
const decode = (s: string) => s.replace(/&(apos|#39|quot|amp|nbsp);/g, (m) => ENTITIES[m] ?? m);

/**
 * The /blog index, set like a newspaper section front: the newest post
 * leads at size, the rest run down a column beside it. Presentation only —
 * the feed (hand-written posts merged with PUBLISHED database posts, newest
 * first) is assembled on the server by `postSource.listBlogIndexItems()`.
 * Drafts never reach this component.
 */
export default function BlogIndex({ posts }: { posts: BlogListItem[] }) {
  const [section, setSection] = useState<Section>("All");
  const reduce = useReducedMotion();

  const visible = section === "All" ? posts : posts.filter((p) => p.category === section);
  const [lead, ...rest] = visible;
  const counts = Object.fromEntries(
    categories.map((c) => [c, posts.filter((p) => p.category === c).length])
  ) as Record<CategoryType, number>;

  return (
    <>
      <SiteNav />
      <main id="main" className="front frame">
        <header className="front-head">
          <h1 className="front-title display">Writing</h1>
          <p className="front-lede">
            Leave some notes for the world.
            <br />
            <Link href="/notes" className="link">
              Personal notes
            </Link>
          </p>
        </header>

        <nav className="front-sections" aria-label="Sections">
          {(["All", ...categories.filter((c) => counts[c] > 0)] as Section[]).map((c) => (
            <button key={c} aria-pressed={section === c} onClick={() => setSection(c)}>
              {c === "All" ? "Everything" : c}
              <span className="count">{c === "All" ? posts.length : counts[c as CategoryType]}</span>
            </button>
          ))}
        </nav>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={section}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
          >
            {!lead ? (
              <p className="front-empty">Nothing in {section} yet — soon, hopefully.</p>
            ) : (
              <div className="front-grid">
                <article className="front-lead">
                  <Link href={`/blog/${lead.slug}`}>
                    <h2 className="front-lead-title">{lead.title}</h2>
                    <p className="front-lead-dek">{decode(lead.excerpt)}</p>
                    <p className="front-meta">
                      {lead.category} · {lead.date}
                    </p>
                  </Link>
                </article>

                {rest.length > 0 && (
                  <ul className="front-list">
                    {rest.map((post) => (
                      <li key={post.slug} className="front-item">
                        <Link href={`/blog/${post.slug}`}>
                          <h3 className="front-item-title">{post.title}</h3>
                          <p className="front-item-dek">{decode(post.excerpt)}</p>
                          <p className="front-meta">
                            {post.category} · {post.date}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      <SiteFooter />
    </>
  );
}

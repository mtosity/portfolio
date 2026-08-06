"use client";

import { useEffect, useState } from "react";
import { AccentButton } from "@mtosity/design-system";
import BlogPostsList from "../components/blog/BlogPostsList";
import { listBlogPosts, type BlogPostSummary } from "../components/blog/blogApi";

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listBlogPosts()
      .then(setPosts)
      .catch((e: Error) =>
        setError(
          e.message ||
            "Could not reach the database. Make sure Postgres env vars are set and the schema is initialized."
        )
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "1rem",
          marginBottom: "1.75rem",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "2rem",
            fontWeight: 600,
            margin: 0,
          }}
        >
          Blog
        </h1>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            color: "var(--muted)",
          }}
        >
          {loading ? "…" : posts.length}
        </span>
        <span style={{ flex: 1 }} />
        <a
          href="/admin/blog/definitions"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            color: "var(--muted)",
            textDecoration: "underline",
          }}
        >
          Anchor sources
        </a>
        <AccentButton
          href="/admin/blog/new"
          style={{
            borderRadius: 2,
            padding: "0.5rem 1rem",
            letterSpacing: 0,
            textTransform: "none",
          }}
        >
          + New post
        </AccentButton>
      </div>

      {error && (
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.78rem",
            color: "var(--danger)",
            lineHeight: 1.6,
          }}
        >
          {error}
        </p>
      )}

      {loading && !error && (
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
            color: "var(--muted)",
          }}
        >
          Loading…
        </p>
      )}

      {!loading && !error && posts.length === 0 && (
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
            color: "var(--muted)",
          }}
        >
          No posts yet. The five hand-written posts still live in{" "}
          <code>apps/web/src/app/blog/</code>.
        </p>
      )}

      {!loading && !error && posts.length > 0 && <BlogPostsList posts={posts} />}
    </div>
  );
}

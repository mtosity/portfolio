"use client";

import Link from "next/link";
import type { BlogPostSummary } from "./blogApi";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso)
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
}

function Row({ post }: { post: BlogPostSummary }) {
  return (
    <li className="blog-row">
      <span className="blog-row-date">
        {formatDate(post.publishedAt ?? post.createdAt)}
      </span>
      <Link href={`/admin/blog/${post.id}/edit`} className="blog-row-title">
        {post.title || "(untitled)"}
      </Link>
      <span className="blog-row-cat">{post.category}</span>
      {!post.published && <span className="blog-row-draft">Draft</span>}
      <Link
        href={`/blog/${post.slug}`}
        target="_blank"
        className="blog-row-view"
        title={
          post.published
            ? "View the published post"
            : "Drafts are reachable at their public URL but hidden from the index"
        }
      >
        {post.published ? "View ↗" : "View draft ↗"}
      </Link>
    </li>
  );
}

export default function BlogPostsList({ posts }: { posts: BlogPostSummary[] }) {
  const drafts = posts.filter((p) => !p.published);
  const published = posts.filter((p) => p.published);

  return (
    <div>
      {drafts.length > 0 && (
        <section className="blog-section">
          <h2 className="blog-section-head">
            Drafts <span>{drafts.length}</span>
          </h2>
          <ul className="blog-list is-draft">
            {drafts.map((p) => (
              <Row key={p.id} post={p} />
            ))}
          </ul>
        </section>
      )}

      <section className="blog-section">
        <h2 className="blog-section-head">
          Published <span>{published.length}</span>
        </h2>
        {published.length === 0 ? (
          <p className="blog-empty">Nothing published yet.</p>
        ) : (
          <ul className="blog-list">
            {published.map((p) => (
              <Row key={p.id} post={p} />
            ))}
          </ul>
        )}
      </section>

      <style>{`
        .blog-section { margin-bottom: 2.25rem; }
        .blog-section-head {
          display: flex; align-items: baseline; gap: 0.5rem;
          font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.15em; color: var(--fg);
          margin: 0 0 0.6rem; padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border);
        }
        .blog-section-head span { color: var(--muted); font-weight: 400; letter-spacing: 0.08em; }
        .blog-list { list-style: none; margin: 0; padding: 0; }
        .blog-list.is-draft .blog-row { background: var(--bg-secondary); }
        .blog-row {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0.75rem 0.6rem;
          border-bottom: 1px solid var(--border-light);
        }
        .blog-row-date {
          font-family: var(--font-mono); font-size: 0.6rem; letter-spacing: 0.1em;
          color: var(--muted); width: 100px; flex-shrink: 0;
        }
        .blog-row-title {
          font-family: var(--font-heading); font-size: 1.02rem; color: var(--fg);
          text-decoration: none; flex: 1; min-width: 0;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .blog-row-title:hover { color: var(--muted); }
        .blog-row-cat {
          font-family: var(--font-mono); font-size: 0.58rem; text-transform: uppercase;
          letter-spacing: 0.1em; color: var(--muted); white-space: nowrap;
        }
        .blog-row-draft {
          font-family: var(--font-mono); font-size: 0.58rem; text-transform: uppercase;
          letter-spacing: 0.1em; color: var(--danger);
          border: 1px solid var(--danger); border-radius: 2px; padding: 0.12rem 0.38rem;
        }
        .blog-row-view {
          font-family: var(--font-mono); font-size: 0.62rem; color: var(--muted);
          text-decoration: none; white-space: nowrap;
        }
        .blog-row-view:hover { color: var(--fg); text-decoration: underline; }
        .blog-empty {
          font-family: var(--font-mono); font-size: 0.78rem; color: var(--muted); margin: 0.5rem 0;
        }
        @media (max-width: 620px) {
          .blog-row { flex-wrap: wrap; gap: 0.4rem 0.6rem; }
          .blog-row-title { flex: 1 1 100%; order: -1; white-space: normal; }
        }
      `}</style>
    </div>
  );
}

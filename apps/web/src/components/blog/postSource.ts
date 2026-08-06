/**
 * The ONE place the public blog pages touch the database.
 *
 * Everything DB-shaped that /blog and /blog/[slug] need is re-exported from
 * here, so repointing at a different data layer is a single-file change. The
 * queries themselves live in `@mtosity/lib/blog` (workstream A) — do not add
 * SQL to this file.
 *
 * Server-only: `@mtosity/lib/blog` reaches for `getSql()`, which throws when no
 * DATABASE_URL is configured. Every accessor here is wrapped so that a missing
 * or unreachable database degrades the page to "static posts only" instead of
 * turning `/blog` into a 500 (and instead of failing `next build` on a machine
 * with no DB env, which is how the repo is usually built locally).
 */

// NOTE: no `import "server-only"` guard — that package is not installed in this
// workspace and adding a dependency is out of scope. Keep this module out of
// any file carrying "use client".

import {
  getPostBySlug as dbGetPostBySlug,
  listPublishedPosts as dbListPublishedPosts,
  type BlogPost as DbBlogPost,
} from "@mtosity/lib/blog";
import {
  listCodeExamples,
  listDefinitions,
  mergeCodeExamples,
} from "@mtosity/lib/blog-definitions";

import type { BlogListItem } from "@/data/blogPosts";
import { blogPosts, parseBlogDate } from "@/data/blogPosts";
import type { CodeExample, Definition } from "./definitions";
import { renderBlogHtml } from "./htmlToReact";

export type { DbBlogPost };

function warn(scope: string, err: unknown): void {
  console.warn(`[blog] ${scope} unavailable — falling back to static posts:`, err);
}

/** Published posts only. Drafts are filtered in SQL, never here. */
export async function listPublishedDbPosts(): Promise<DbBlogPost[]> {
  try {
    return await dbListPublishedPosts();
  } catch (err) {
    warn("listPublishedPosts", err);
    return [];
  }
}

/**
 * Resolves a slug regardless of published state — a draft IS reachable at its
 * own URL (contract §3); the page adds the noindex + Draft badge.
 */
export async function getDbPostBySlug(slug: string): Promise<DbBlogPost | null> {
  try {
    return await dbGetPostBySlug(slug);
  } catch (err) {
    warn(`getPostBySlug(${slug})`, err);
    return null;
  }
}

/**
 * Anchor targets stored in the database, normalised into the exact shapes
 * `definitions.tsx` exports so BlogLayout's lookup stays uniform.
 *
 * This is the "handle both shapes" half of contract §4: `Definition.content` is
 * a React node in the static file and an HTML string in the DB, so the HTML is
 * converted here — through the same sanitising renderer the post bodies use —
 * rather than pushing the union into the client component.
 *
 * Precedence is enforced twice on purpose: nothing static is included here, and
 * BlogLayout spreads the static maps on top of whatever it is given.
 */
export async function loadDbAnchors(): Promise<{
  definitions: Record<string, Definition>;
  codeExamples: Record<string, CodeExample>;
}> {
  try {
    const [dbDefinitions, dbCodeExamples] = await Promise.all([
      listDefinitions(),
      listCodeExamples(),
    ]);
    return {
      definitions: Object.fromEntries(
        dbDefinitions.map((row) => [
          row.key,
          { title: row.title, content: renderBlogHtml(row.contentHtml) },
        ])
      ),
      // `mergeCodeExamples({}, rows)` is lib's own null → undefined normaliser.
      codeExamples: mergeCodeExamples({}, dbCodeExamples),
    };
  } catch (err) {
    warn("loadBlogAnchors", err);
    return { definitions: {}, codeExamples: {} };
  }
}

/** The display format the static `blogPosts` entries already use. */
export function formatBlogDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  // Fixed locale + UTC so the server-rendered string matches the client's and
  // does not drift with the deploy region.
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** A DB post's public date: its publish stamp, or its creation date if the
 * publish stamp was never set (imported rows). */
export function dbPostDate(post: DbBlogPost): string {
  return post.publishedAt ?? post.createdAt;
}

export function toListItem(post: DbBlogPost): BlogListItem {
  const iso = dbPostDate(post);
  return {
    slug: post.slug,
    title: post.title,
    date: formatBlogDate(iso),
    excerpt: post.excerpt,
    category: post.category,
    sortTime: new Date(iso).getTime(),
  };
}

/**
 * The /blog index feed: hand-written posts + PUBLISHED DB posts, newest first.
 *
 * A DB slug that collides with a hand-written one is dropped, mirroring the
 * resolution order in `[slug]/page.tsx` where the legacy component wins — the
 * list must not advertise a title the route will never serve.
 */
export async function listBlogIndexItems(): Promise<BlogListItem[]> {
  const staticItems: BlogListItem[] = blogPosts.map((post) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    category: post.category,
    sortTime: parseBlogDate(post.date),
  }));

  const staticSlugs = new Set(staticItems.map((p) => p.slug));
  const dbItems = (await listPublishedDbPosts())
    .filter((post) => !staticSlugs.has(post.slug))
    .map(toListItem);

  return [...staticItems, ...dbItems].sort((a, b) => b.sortTime - a.sortTime);
}

import { randomUUID } from "crypto";
import { getSql } from "./db";
// Reuse the notes helpers verbatim rather than re-deriving them: slug semantics
// have to stay byte-identical across the site or existing shareable URLs drift.
import { deriveSummary, slugify as noteSlugify } from "./notes";

export { deriveSummary };

/**
 * Slugify a blog title, folding diacritics first.
 *
 * notes.slugify strips every non-ASCII character outright, which mangles
 * Vietnamese: "Hoa Kỳ Vay Tiền" becomes "hoa-k-vay-tin". The existing
 * hand-written post uses "hoa-ky-vay-tien", so the auto-slug has to fold rather
 * than drop, or every "Tiếng Việt" post gets a broken URL.
 *
 * NFD splits accented letters into base + combining mark, which we then strip.
 * đ/Đ has no canonical decomposition, so it needs handling by hand.
 *
 * Deliberately NOT applied to notes: apps/web notes page still derives slugs
 * from titles at read time (getNoteSlug) for deep links, so changing the shared
 * helper could break already-shared note URLs. blog_posts is a new table with no
 * rows to invalidate.
 */
export function slugify(title: string): string {
  const folded = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d");
  return noteSlugify(folded);
}

/** Mirrors the union in apps/web/src/data/blogPosts.ts — the /blog filter chips
 * are built from it, so an unknown value would render an unreachable category. */
export const BLOG_CATEGORIES = [
  "Building",
  "Living",
  "Money",
  "Tiếng Việt",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export const DEFAULT_BLOG_CATEGORY: BlogCategory = "Building";

/** Narrows untrusted input (request bodies) onto the category union. */
export function isBlogCategory(value: unknown): value is BlogCategory {
  return (
    typeof value === "string" &&
    (BLOG_CATEGORIES as readonly string[]).includes(value)
  );
}

/** Falls back to "Building" instead of throwing: a bad category is a cosmetic
 * problem, and rejecting the whole save would lose the author's draft body. */
export function normalizeCategory(value: unknown): BlogCategory {
  return isBlogCategory(value) ? value : DEFAULT_BLOG_CATEGORY;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  bodyHtml: string;
  // Tiptap document JSON, kept so the editor can reload with full fidelity.
  bodyJson: unknown | null;
  excerpt: string;
  category: BlogCategory;
  coverImage: string | null;
  published: boolean;
  /** ISO, or null while the post has never been published. */
  publishedAt: string | null;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface BlogPostInput {
  title: string;
  bodyHtml: string;
  bodyJson?: unknown;
  excerpt?: string;
  category?: string;
  coverImage?: string | null;
  /** Defaults to false — posts start as drafts (contract §3). */
  published?: boolean;
  /**
   * Explicit slug override. The auto-slug drops diacritics (notes' slugify is
   * ASCII-only), which mangles Vietnamese titles, so the editor can supply one.
   * Still passed through slugify + uniqueness, so it can never collide.
   */
  slug?: string;
  /**
   * Explicit publish date, for importing posts that already have a public date.
   * Leave undefined for the normal "stamp on first publish" behaviour.
   */
  publishedAt?: string;
}

interface BlogPostRow {
  id: string;
  slug: string;
  title: string;
  body_html: string;
  body_json: unknown | null;
  excerpt: string;
  category: string;
  cover_image: string | null;
  published: boolean;
  published_at: string | Date | null;
  created_at: string | Date;
  updated_at: string | Date;
}

function toPost(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    bodyHtml: row.body_html,
    bodyJson: row.body_json,
    excerpt: row.excerpt,
    category: normalizeCategory(row.category),
    coverImage: row.cover_image,
    published: row.published,
    publishedAt: row.published_at
      ? new Date(row.published_at).toISOString()
      : null,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

// Memoised so the per-request `ready()` guard costs one round-trip per process
// instead of one per query. Reset on failure so a transient error can retry.
let schemaPromise: Promise<void> | null = null;

/**
 * Idempotent DDL. Safe to call repeatedly and from concurrent lambdas:
 * every statement is IF NOT EXISTS, and Postgres can still raise a duplicate
 * catalog error when two CREATEs race, so those specific codes are swallowed.
 */
export async function ensureSchema(): Promise<void> {
  if (schemaPromise) return schemaPromise;
  schemaPromise = createSchema().catch((err) => {
    schemaPromise = null;
    throw err;
  });
  return schemaPromise;
}

// 42P07 duplicate_table, 42710 duplicate_object, 23505 unique_violation on the
// system catalogs — all mean "another connection created it first", i.e. done.
const BENIGN_DDL_CODES = new Set(["42P07", "42710", "23505"]);

async function ignoreConcurrentDdl(run: () => Promise<unknown>): Promise<void> {
  try {
    await run();
  } catch (err) {
    const code = (err as { code?: string } | null)?.code;
    if (!code || !BENIGN_DDL_CODES.has(code)) throw err;
  }
}

async function createSchema(): Promise<void> {
  const sql = getSql();
  await ignoreConcurrentDdl(
    () => sql`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id            TEXT PRIMARY KEY,
        slug          TEXT UNIQUE NOT NULL,
        title         TEXT NOT NULL,
        body_html     TEXT NOT NULL DEFAULT '',
        body_json     JSONB,
        excerpt       TEXT NOT NULL DEFAULT '',
        category      TEXT NOT NULL DEFAULT 'Building',
        cover_image   TEXT,
        published     BOOLEAN NOT NULL DEFAULT FALSE,
        published_at  TIMESTAMPTZ,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `
  );
  await ignoreConcurrentDdl(
    () => sql`
      CREATE INDEX IF NOT EXISTS blog_posts_published_idx
        ON blog_posts (published, published_at DESC)
    `
  );
}

// Every exported query goes through this so callers never have to remember to
// bootstrap the table first (nothing in the app calls ensureSchema explicitly).
async function ready() {
  await ensureSchema();
  return getSql();
}

/**
 * Reserve a slug, appending -2, -3, … if the base is taken. `excludeId` lets an
 * update keep its own slug instead of endlessly incrementing it on every save.
 */
async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const sql = getSql();
  const root = base || "post";
  let candidate = root;
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const rows = (await sql`
      SELECT id FROM blog_posts WHERE slug = ${candidate} LIMIT 1
    `) as { id: string }[];
    if (rows.length === 0 || rows[0].id === excludeId) return candidate;
    n += 1;
    candidate = `${root}-${n}`;
  }
}

/** Admin listing — includes drafts. Never use this on a public page. */
export async function listAllPosts(): Promise<BlogPost[]> {
  const sql = await ready();
  const rows = (await sql`
    SELECT * FROM blog_posts
    ORDER BY COALESCE(published_at, created_at) DESC
  `) as BlogPostRow[];
  return rows.map(toPost);
}

/**
 * Public listing — drafts are excluded here and only here, so /blog, the
 * sitemap and generateStaticParams all inherit the same rule (contract §3).
 */
export async function listPublishedPosts(): Promise<BlogPost[]> {
  const sql = await ready();
  const rows = (await sql`
    SELECT * FROM blog_posts
    WHERE published = TRUE
    ORDER BY COALESCE(published_at, created_at) DESC
  `) as BlogPostRow[];
  return rows.map(toPost);
}

/**
 * Looks up by slug regardless of published state — a draft IS reachable at its
 * own URL by design; the page is responsible for the noindex + Draft badge.
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const sql = await ready();
  const rows = (await sql`
    SELECT * FROM blog_posts WHERE slug = ${slug} LIMIT 1
  `) as BlogPostRow[];
  return rows[0] ? toPost(rows[0]) : null;
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  const sql = await ready();
  const rows = (await sql`
    SELECT * FROM blog_posts WHERE id = ${id} LIMIT 1
  `) as BlogPostRow[];
  return rows[0] ? toPost(rows[0]) : null;
}

export async function createPost(input: BlogPostInput): Promise<BlogPost> {
  const sql = await ready();
  const id = randomUUID();
  const slug = await uniqueSlug(slugify(input.slug || input.title));
  const excerpt = input.excerpt?.trim() || deriveSummary(input.bodyHtml, 280);
  // Drafts by default: a new post should never go live because someone hit save.
  const published = input.published ?? false;
  const bodyJson = input.bodyJson ? JSON.stringify(input.bodyJson) : null;
  const now = new Date().toISOString();
  // Stamp the publish date on creation only if it is actually being published.
  const publishedAt = input.publishedAt
    ? new Date(input.publishedAt).toISOString()
    : published
      ? now
      : null;

  const rows = (await sql`
    INSERT INTO blog_posts (
      id, slug, title, body_html, body_json, excerpt, category, cover_image,
      published, published_at, created_at, updated_at
    )
    VALUES (
      ${id}, ${slug}, ${input.title}, ${input.bodyHtml}, ${bodyJson}::jsonb,
      ${excerpt}, ${normalizeCategory(input.category)}, ${input.coverImage ?? null},
      ${published}, ${publishedAt}::timestamptz, ${now}, ${now}
    )
    RETURNING *
  `) as BlogPostRow[];
  return toPost(rows[0]);
}

/**
 * Full replace of an existing post.
 *
 * Publish-date rules live in the CASE below so they hold atomically:
 *  - false → true stamps published_at only when it is still null;
 *  - true → false leaves published_at alone, so re-publishing later keeps the
 *    original public date instead of jumping to "today";
 *  - an explicit publishedAt (importer) always wins.
 */
export async function updatePost(
  id: string,
  input: BlogPostInput
): Promise<BlogPost | null> {
  const sql = await ready();
  const slug = await uniqueSlug(slugify(input.slug || input.title), id);
  const excerpt = input.excerpt?.trim() || deriveSummary(input.bodyHtml, 280);
  // undefined means "leave the publish state alone", NOT "unpublish". Defaulting
  // to false here would let any PUT that forgets the field silently pull a live
  // post off the index — a bad failure mode for a field the UI has to remember
  // to send on every save. Creation still defaults to draft.
  const existing = await getPostById(id);
  if (!existing) return null;
  const published = input.published ?? existing.published;
  const bodyJson = input.bodyJson ? JSON.stringify(input.bodyJson) : null;
  const now = new Date().toISOString();
  const explicitPublishedAt = input.publishedAt
    ? new Date(input.publishedAt).toISOString()
    : null;

  const rows = (await sql`
    UPDATE blog_posts SET
      slug = ${slug},
      title = ${input.title},
      body_html = ${input.bodyHtml},
      body_json = ${bodyJson}::jsonb,
      excerpt = ${excerpt},
      category = ${normalizeCategory(input.category)},
      cover_image = ${input.coverImage ?? null},
      published = ${published},
      published_at = CASE
        WHEN ${explicitPublishedAt}::timestamptz IS NOT NULL
          THEN ${explicitPublishedAt}::timestamptz
        WHEN ${published}::boolean AND published_at IS NULL
          THEN ${now}::timestamptz
        ELSE published_at
      END,
      updated_at = ${now}
    WHERE id = ${id}
    RETURNING *
  `) as BlogPostRow[];
  return rows[0] ? toPost(rows[0]) : null;
}

export async function deletePost(id: string): Promise<boolean> {
  const sql = await ready();
  const rows = (await sql`
    DELETE FROM blog_posts WHERE id = ${id} RETURNING id
  `) as { id: string }[];
  return rows.length > 0;
}

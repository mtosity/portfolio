import { randomUUID } from "crypto";
import { getSql } from "./db";

export interface Note {
  id: string;
  slug: string;
  title: string;
  bodyHtml: string;
  // Tiptap document JSON, kept so the editor can reload with full fidelity.
  bodyJson: unknown | null;
  summary: string;
  published: boolean;
  createdAt: string; // ISO — also the display/sort date
  updatedAt: string; // ISO
}

export interface NoteInput {
  title: string;
  bodyHtml: string;
  bodyJson?: unknown;
  summary?: string;
  published?: boolean;
  // Optional explicit publish date (used by the importer to preserve history).
  createdAt?: string;
}

// Matches the slug logic the /notes page already uses for ?note= deep links,
// so imported notes keep their existing shareable URLs (diacritics dropped).
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function deriveSummary(html: string, max = 200): string {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}

interface NoteRow {
  id: string;
  slug: string;
  title: string;
  body_html: string;
  body_json: unknown | null;
  summary: string;
  published: boolean;
  created_at: string | Date;
  updated_at: string | Date;
}

function toNote(row: NoteRow): Note {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    bodyHtml: row.body_html,
    bodyJson: row.body_json,
    summary: row.summary,
    published: row.published,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

export async function ensureSchema(): Promise<void> {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS notes (
      id          TEXT PRIMARY KEY,
      slug        TEXT UNIQUE NOT NULL,
      title       TEXT NOT NULL,
      body_html   TEXT NOT NULL DEFAULT '',
      body_json   JSONB,
      summary     TEXT NOT NULL DEFAULT '',
      published   BOOLEAN NOT NULL DEFAULT TRUE,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS notes_published_created_idx
      ON notes (published, created_at DESC)
  `;
}

// Reserve a slug, appending -2, -3, … if the base is taken.
async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const sql = getSql();
  const root = base || "note";
  let candidate = root;
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const rows = (await sql`
      SELECT id FROM notes WHERE slug = ${candidate} LIMIT 1
    `) as { id: string }[];
    if (rows.length === 0 || rows[0].id === excludeId) return candidate;
    n += 1;
    candidate = `${root}-${n}`;
  }
}

export async function listPublishedNotes(): Promise<Note[]> {
  const sql = getSql();
  const rows = (await sql`
    SELECT * FROM notes WHERE published = TRUE ORDER BY created_at DESC
  `) as NoteRow[];
  return rows.map(toNote);
}

export async function listAllNotes(): Promise<Note[]> {
  const sql = getSql();
  const rows = (await sql`
    SELECT * FROM notes ORDER BY created_at DESC
  `) as NoteRow[];
  return rows.map(toNote);
}

export async function getNoteBySlug(slug: string): Promise<Note | null> {
  const sql = getSql();
  const rows = (await sql`
    SELECT * FROM notes WHERE slug = ${slug} LIMIT 1
  `) as NoteRow[];
  return rows[0] ? toNote(rows[0]) : null;
}

export async function getNoteById(id: string): Promise<Note | null> {
  const sql = getSql();
  const rows = (await sql`
    SELECT * FROM notes WHERE id = ${id} LIMIT 1
  `) as NoteRow[];
  return rows[0] ? toNote(rows[0]) : null;
}

export async function createNote(input: NoteInput): Promise<Note> {
  const sql = getSql();
  const id = randomUUID();
  const slug = await uniqueSlug(slugify(input.title));
  const summary = input.summary?.trim() || deriveSummary(input.bodyHtml);
  const published = input.published ?? true;
  const bodyJson = input.bodyJson ? JSON.stringify(input.bodyJson) : null;
  const createdAt = input.createdAt ? new Date(input.createdAt) : new Date();

  const rows = (await sql`
    INSERT INTO notes (id, slug, title, body_html, body_json, summary, published, created_at, updated_at)
    VALUES (
      ${id}, ${slug}, ${input.title}, ${input.bodyHtml}, ${bodyJson}::jsonb,
      ${summary}, ${published}, ${createdAt.toISOString()}, ${new Date().toISOString()}
    )
    RETURNING *
  `) as NoteRow[];
  return toNote(rows[0]);
}

export async function updateNote(
  id: string,
  input: NoteInput
): Promise<Note | null> {
  const sql = getSql();
  const slug = await uniqueSlug(slugify(input.title), id);
  const summary = input.summary?.trim() || deriveSummary(input.bodyHtml);
  const published = input.published ?? true;
  const bodyJson = input.bodyJson ? JSON.stringify(input.bodyJson) : null;

  const rows = (await sql`
    UPDATE notes SET
      slug = ${slug},
      title = ${input.title},
      body_html = ${input.bodyHtml},
      body_json = ${bodyJson}::jsonb,
      summary = ${summary},
      published = ${published},
      updated_at = ${new Date().toISOString()}
    WHERE id = ${id}
    RETURNING *
  `) as NoteRow[];
  return rows[0] ? toNote(rows[0]) : null;
}

export async function deleteNote(id: string): Promise<boolean> {
  const sql = getSql();
  const rows = (await sql`
    DELETE FROM notes WHERE id = ${id} RETURNING id
  `) as { id: string }[];
  return rows.length > 0;
}

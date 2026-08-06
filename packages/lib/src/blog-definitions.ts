import { getSql } from "./db";

/**
 * Storage + lookup for the two interactive blog anchors.
 *
 * The legacy posts resolve their anchors from the hand-written
 * `apps/web/src/components/blog/definitions.tsx`; editor-authored posts resolve
 * theirs from these tables. The merge helpers at the bottom of this file join
 * the two, static-first. This module deliberately does NOT import the static
 * file — that is a React module inside the Next app, and pulling it into
 * @mtosity/lib would drag JSX into every server/db consumer. The app passes its
 * maps in instead.
 */

/** The anchor key contract: `data-anchor-key="..."` — see contract §1. */
const ANCHOR_KEY_RE = /^[a-zA-Z0-9_-]+$/;

/** Keys are interpolated into HTML attributes by the editor, so reject anything
 * outside the documented charset rather than storing something unaddressable. */
export function isValidAnchorKey(key: unknown): key is string {
  return typeof key === "string" && ANCHOR_KEY_RE.test(key);
}

export interface CodeSnippet {
  code: string;
  language: string;
  explanation: string;
}

export interface BlogDefinitionRecord {
  key: string;
  title: string;
  /** HTML string — the DB counterpart of the static file's React.ReactNode. */
  contentHtml: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogDefinitionInput {
  key: string;
  title: string;
  contentHtml?: string;
}

export interface BlogCodeExampleRecord {
  key: string;
  title: string;
  description: string;
  wrongCode: CodeSnippet | null;
  correctCode: CodeSnippet | null;
  alternativeCode: CodeSnippet | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogCodeExampleInput {
  key: string;
  title: string;
  description?: string;
  wrongCode?: CodeSnippet | null;
  correctCode?: CodeSnippet | null;
  alternativeCode?: CodeSnippet | null;
}

interface DefinitionRow {
  key: string;
  title: string;
  content_html: string;
  created_at: string | Date;
  updated_at: string | Date;
}

interface CodeExampleRow {
  key: string;
  title: string;
  description: string;
  wrong_code: unknown;
  correct_code: unknown;
  alternative_code: unknown;
  created_at: string | Date;
  updated_at: string | Date;
}

/** JSONB comes back as an already-parsed value; validate the shape so a
 * hand-edited row can't crash the renderer with a half-built snippet. */
function toSnippet(value: unknown): CodeSnippet | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Partial<CodeSnippet>;
  if (typeof v.code !== "string") return null;
  return {
    code: v.code,
    language: typeof v.language === "string" ? v.language : "text",
    explanation: typeof v.explanation === "string" ? v.explanation : "",
  };
}

function snippetParam(value: CodeSnippet | null | undefined): string | null {
  return value ? JSON.stringify(value) : null;
}

function toDefinition(row: DefinitionRow): BlogDefinitionRecord {
  return {
    key: row.key,
    title: row.title,
    contentHtml: row.content_html,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

function toCodeExample(row: CodeExampleRow): BlogCodeExampleRecord {
  return {
    key: row.key,
    title: row.title,
    description: row.description,
    wrongCode: toSnippet(row.wrong_code),
    correctCode: toSnippet(row.correct_code),
    alternativeCode: toSnippet(row.alternative_code),
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

let schemaPromise: Promise<void> | null = null;

/**
 * Idempotent DDL for both anchor tables. Safe to call repeatedly and from
 * concurrent lambdas — see the same note in blog.ts.
 */
export async function ensureSchema(): Promise<void> {
  if (schemaPromise) return schemaPromise;
  schemaPromise = createSchema().catch((err) => {
    schemaPromise = null;
    throw err;
  });
  return schemaPromise;
}

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
      CREATE TABLE IF NOT EXISTS blog_definitions (
        key          TEXT PRIMARY KEY,
        title        TEXT NOT NULL,
        content_html TEXT NOT NULL DEFAULT '',
        created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `
  );
  await ignoreConcurrentDdl(
    () => sql`
      CREATE TABLE IF NOT EXISTS blog_code_examples (
        key              TEXT PRIMARY KEY,
        title            TEXT NOT NULL,
        description      TEXT NOT NULL DEFAULT '',
        wrong_code       JSONB,
        correct_code     JSONB,
        alternative_code JSONB,
        created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `
  );
}

async function ready() {
  await ensureSchema();
  return getSql();
}

/* ------------------------------------------------------------------ */
/* Definitions CRUD                                                     */
/* ------------------------------------------------------------------ */

export async function listDefinitions(): Promise<BlogDefinitionRecord[]> {
  const sql = await ready();
  const rows = (await sql`
    SELECT * FROM blog_definitions ORDER BY key ASC
  `) as DefinitionRow[];
  return rows.map(toDefinition);
}

export async function getDefinition(
  key: string
): Promise<BlogDefinitionRecord | null> {
  const sql = await ready();
  const rows = (await sql`
    SELECT * FROM blog_definitions WHERE key = ${key} LIMIT 1
  `) as DefinitionRow[];
  return rows[0] ? toDefinition(rows[0]) : null;
}

/**
 * Upsert rather than insert/update: the key IS the identity (it is what the
 * `data-anchor-key` in already-saved post HTML points at), so re-saving a
 * definition must never mint a second row or orphan the existing anchors.
 */
export async function upsertDefinition(
  input: BlogDefinitionInput
): Promise<BlogDefinitionRecord> {
  if (!isValidAnchorKey(input.key)) {
    throw new Error(`Invalid definition key: ${String(input.key)}`);
  }
  const sql = await ready();
  const now = new Date().toISOString();
  const rows = (await sql`
    INSERT INTO blog_definitions (key, title, content_html, created_at, updated_at)
    VALUES (${input.key}, ${input.title}, ${input.contentHtml ?? ""}, ${now}, ${now})
    ON CONFLICT (key) DO UPDATE SET
      title = EXCLUDED.title,
      content_html = EXCLUDED.content_html,
      updated_at = EXCLUDED.updated_at
    RETURNING *
  `) as DefinitionRow[];
  return toDefinition(rows[0]);
}

export async function deleteDefinition(key: string): Promise<boolean> {
  const sql = await ready();
  const rows = (await sql`
    DELETE FROM blog_definitions WHERE key = ${key} RETURNING key
  `) as { key: string }[];
  return rows.length > 0;
}

/* ------------------------------------------------------------------ */
/* Code examples CRUD                                                   */
/* ------------------------------------------------------------------ */

export async function listCodeExamples(): Promise<BlogCodeExampleRecord[]> {
  const sql = await ready();
  const rows = (await sql`
    SELECT * FROM blog_code_examples ORDER BY key ASC
  `) as CodeExampleRow[];
  return rows.map(toCodeExample);
}

export async function getCodeExample(
  key: string
): Promise<BlogCodeExampleRecord | null> {
  const sql = await ready();
  const rows = (await sql`
    SELECT * FROM blog_code_examples WHERE key = ${key} LIMIT 1
  `) as CodeExampleRow[];
  return rows[0] ? toCodeExample(rows[0]) : null;
}

/** Upsert for the same reason as definitions: the key is the anchor identity. */
export async function upsertCodeExample(
  input: BlogCodeExampleInput
): Promise<BlogCodeExampleRecord> {
  if (!isValidAnchorKey(input.key)) {
    throw new Error(`Invalid code example key: ${String(input.key)}`);
  }
  const sql = await ready();
  const now = new Date().toISOString();
  const rows = (await sql`
    INSERT INTO blog_code_examples (
      key, title, description, wrong_code, correct_code, alternative_code,
      created_at, updated_at
    )
    VALUES (
      ${input.key}, ${input.title}, ${input.description ?? ""},
      ${snippetParam(input.wrongCode)}::jsonb,
      ${snippetParam(input.correctCode)}::jsonb,
      ${snippetParam(input.alternativeCode)}::jsonb,
      ${now}, ${now}
    )
    ON CONFLICT (key) DO UPDATE SET
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      wrong_code = EXCLUDED.wrong_code,
      correct_code = EXCLUDED.correct_code,
      alternative_code = EXCLUDED.alternative_code,
      updated_at = EXCLUDED.updated_at
    RETURNING *
  `) as CodeExampleRow[];
  return toCodeExample(rows[0]);
}

export async function deleteCodeExample(key: string): Promise<boolean> {
  const sql = await ready();
  const rows = (await sql`
    DELETE FROM blog_code_examples WHERE key = ${key} RETURNING key
  `) as { key: string }[];
  return rows.length > 0;
}

/* ------------------------------------------------------------------ */
/* Merged reads (static file first, DB second) — contract §4            */
/* ------------------------------------------------------------------ */

/** Structural stand-in for the static file's `Definition`. `content` stays
 * generic so lib never has to name React.ReactNode. */
export interface StaticDefinitionLike<TContent> {
  title: string;
  content: TContent;
}

/**
 * A definition as the renderer sees it. Discriminated so the sidebar can render
 * `content` directly (React node) or via dangerouslySetInnerHTML (`contentHtml`)
 * without guessing — contract §4 "must handle both shapes".
 */
export type ResolvedDefinition<TContent> =
  | { source: "static"; title: string; content: TContent }
  | { source: "db"; title: string; contentHtml: string };

/** Structural stand-in for the static file's `CodeExample` — pure data, so DB
 * rows are normalised into exactly this shape and the renderer stays uniform. */
export interface StaticCodeExampleLike {
  title: string;
  description: string;
  wrongCode?: CodeSnippet;
  correctCode?: CodeSnippet;
  alternativeCode?: CodeSnippet;
}

/**
 * Merge DB definitions under the hand-written ones.
 *
 * Static wins on a key collision, always: the 5 legacy .tsx posts reference
 * those keys and their sidebars must keep rendering identically, so a
 * same-named DB row added later can never shadow them.
 */
export function mergeDefinitions<TContent>(
  staticDefinitions: Record<string, StaticDefinitionLike<TContent>>,
  dbDefinitions: readonly BlogDefinitionRecord[]
): Record<string, ResolvedDefinition<TContent>> {
  const merged: Record<string, ResolvedDefinition<TContent>> = {};
  for (const row of dbDefinitions) {
    merged[row.key] = {
      source: "db",
      title: row.title,
      contentHtml: row.contentHtml,
    };
  }
  // Applied second so static entries overwrite any DB row with the same key.
  for (const [key, def] of Object.entries(staticDefinitions)) {
    merged[key] = { source: "static", title: def.title, content: def.content };
  }
  return merged;
}

/** Same static-wins precedence as mergeDefinitions, see there for why. */
export function mergeCodeExamples(
  staticCodeExamples: Record<string, StaticCodeExampleLike>,
  dbCodeExamples: readonly BlogCodeExampleRecord[]
): Record<string, StaticCodeExampleLike> {
  const merged: Record<string, StaticCodeExampleLike> = {};
  for (const row of dbCodeExamples) {
    merged[row.key] = {
      title: row.title,
      description: row.description,
      // null → undefined so the shape matches the static file's optional props.
      ...(row.wrongCode ? { wrongCode: row.wrongCode } : {}),
      ...(row.correctCode ? { correctCode: row.correctCode } : {}),
      ...(row.alternativeCode ? { alternativeCode: row.alternativeCode } : {}),
    };
  }
  for (const [key, example] of Object.entries(staticCodeExamples)) {
    merged[key] = example;
  }
  return merged;
}

/**
 * Convenience for the public page: fetch + merge in one call.
 *
 * A DB failure degrades to the static maps instead of throwing — the legacy
 * posts must keep rendering even if Postgres is unreachable at request time.
 */
export async function loadBlogAnchors<TContent>(
  staticDefinitions: Record<string, StaticDefinitionLike<TContent>>,
  staticCodeExamples: Record<string, StaticCodeExampleLike>
): Promise<{
  definitions: Record<string, ResolvedDefinition<TContent>>;
  codeExamples: Record<string, StaticCodeExampleLike>;
}> {
  try {
    const [dbDefinitions, dbCodeExamples] = await Promise.all([
      listDefinitions(),
      listCodeExamples(),
    ]);
    return {
      definitions: mergeDefinitions(staticDefinitions, dbDefinitions),
      codeExamples: mergeCodeExamples(staticCodeExamples, dbCodeExamples),
    };
  } catch {
    return {
      definitions: mergeDefinitions(staticDefinitions, []),
      codeExamples: mergeCodeExamples(staticCodeExamples, []),
    };
  }
}

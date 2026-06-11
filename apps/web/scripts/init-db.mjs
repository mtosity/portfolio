import { neon } from "@neondatabase/serverless";
import { loadEnv, dbUrl } from "./_env.mjs";

loadEnv();
const sql = neon(dbUrl());

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

console.log("✓ notes table ready");

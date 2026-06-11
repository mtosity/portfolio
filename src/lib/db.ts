import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

// Vercel Postgres (Neon) injects several connection strings; the pooled
// DATABASE_URL / POSTGRES_URL works over Neon's HTTP driver. Resolve lazily so
// importing this module at build time (when env may be absent) doesn't throw.
let _sql: NeonQueryFunction<false, false> | null = null;

export function getSql(): NeonQueryFunction<false, false> {
  if (_sql) return _sql;
  const url =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL;
  if (!url) {
    throw new Error(
      "No Postgres connection string found. Set DATABASE_URL or POSTGRES_URL " +
        "(provisioned automatically by Vercel Postgres / Neon)."
    );
  }
  _sql = neon(url);
  return _sql;
}

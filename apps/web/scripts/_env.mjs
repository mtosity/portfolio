import fs from "fs";

// Minimal .env loader so DB scripts work without an extra dependency.
// Reads .env.local first, then .env (existing process.env wins).
export function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    if (!fs.existsSync(file)) continue;
    const text = fs.readFileSync(file, "utf8");
    for (const line of text.split("\n")) {
      const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      const key = m[1];
      let value = m[2].trim().replace(/^["']|["']$/g, "");
      if (!(key in process.env)) process.env[key] = value;
    }
  }
}

export function dbUrl() {
  const url =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL;
  if (!url) {
    console.error(
      "No Postgres connection string found. Set DATABASE_URL or POSTGRES_URL\n" +
        "(provisioned by Vercel Postgres / Neon), e.g. via `vercel env pull .env.local`."
    );
    process.exit(1);
  }
  return url;
}

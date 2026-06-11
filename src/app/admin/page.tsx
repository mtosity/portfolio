import Link from "next/link";
import { listAllNotes } from "@/lib/notes";

export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  return new Date(iso)
    .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    .toUpperCase();
}

export default async function AdminHome() {
  let notes: Awaited<ReturnType<typeof listAllNotes>> = [];
  let error: string | null = null;
  try {
    notes = await listAllNotes();
  } catch {
    error =
      "Could not reach the database. Make sure Postgres env vars are set and the schema is initialized (pnpm init-db).";
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "1.75rem" }}>
        <h1
          style={{
            fontFamily: "var(--font-crimson-text), Georgia, serif",
            fontSize: "2rem",
            fontWeight: 600,
            margin: 0,
          }}
        >
          Notes
        </h1>
        <span style={{ flex: 1 }} />
        <Link
          href="/admin/notes/new"
          style={{
            background: "var(--accent)",
            color: "var(--fg)",
            border: "1px solid var(--border)",
            borderRadius: 2,
            padding: "0.5rem 1rem",
            fontFamily: "var(--font-mono)",
            fontSize: "0.74rem",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          + New note
        </Link>
      </div>

      {error && (
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "#b00020", lineHeight: 1.6 }}>
          {error}
        </p>
      )}

      {!error && notes.length === 0 && (
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--muted)" }}>
          No notes yet. Create your first one.
        </p>
      )}

      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {notes.map((n) => (
          <li
            key={n.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "0.9rem 0",
              borderBottom: "1px solid var(--border-light)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.62rem",
                letterSpacing: "0.1em",
                color: "var(--muted)",
                width: 100,
                flexShrink: 0,
              }}
            >
              {formatDate(n.createdAt)}
            </span>
            <Link
              href={`/admin/notes/${n.id}/edit`}
              style={{
                fontFamily: "var(--font-crimson-text), Georgia, serif",
                fontSize: "1.05rem",
                color: "var(--fg)",
                textDecoration: "none",
                flex: 1,
              }}
            >
              {n.title}
            </Link>
            {!n.published && (
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--muted)",
                  border: "1px solid var(--border-light)",
                  borderRadius: 2,
                  padding: "0.15rem 0.4rem",
                }}
              >
                Draft
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

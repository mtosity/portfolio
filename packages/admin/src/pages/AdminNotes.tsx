import Link from "next/link";
import { listAllNotes } from "@mtosity/lib/notes";
import NotesList from "../components/NotesList";


export default async function AdminNotes() {
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
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            color: "var(--muted)",
          }}
        >
          {notes.length}
        </span>
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

      <NotesList
        notes={notes.map((n) => ({
          id: n.id,
          title: n.title,
          createdAt: n.createdAt,
          published: n.published,
        }))}
      />
    </div>
  );
}

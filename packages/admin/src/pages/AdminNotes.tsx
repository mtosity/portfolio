import { AccentButton } from "@mtosity/design-system";
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
            fontFamily: "var(--font-heading)",
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
        <AccentButton
          href="/admin/notes/new"
          style={{
            borderRadius: 2,
            padding: "0.5rem 1rem",
            letterSpacing: 0,
            textTransform: "none",
          }}
        >
          + New note
        </AccentButton>
      </div>

      {error && (
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--danger)", lineHeight: 1.6 }}>
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

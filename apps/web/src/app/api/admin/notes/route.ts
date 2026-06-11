import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createNote, listAllNotes, type NoteInput } from "@mtosity/lib/notes";

export const dynamic = "force-dynamic";

// GET /api/admin/notes — list every note (including drafts) for the editor.
export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const notes = await listAllNotes();
    return NextResponse.json({ notes });
  } catch {
    return NextResponse.json({ error: "Failed to load notes" }, { status: 500 });
  }
}

// POST /api/admin/notes — create a note.
export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await req.json()) as Partial<NoteInput>;
    if (!body.title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    const note = await createNote({
      title: body.title.trim(),
      bodyHtml: body.bodyHtml ?? "",
      bodyJson: body.bodyJson,
      summary: body.summary,
      published: body.published,
      createdAt: body.createdAt,
    });
    return NextResponse.json({ note }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}

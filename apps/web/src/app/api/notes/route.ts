import { NextResponse } from "next/server";
import { listPublishedNotes } from "@mtosity/lib/notes";

// Read straight from Postgres so edits show up immediately.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const notes = await listPublishedNotes();
    return NextResponse.json(
      {
        title: "mtosity",
        description:
          "Leave these notes to the world ~ some are mine, some passed through me",
        items: notes.map((n) => ({
          id: n.id,
          slug: n.slug,
          url: `/notes?note=${n.slug}`,
          title: n.title,
          content_html: n.bodyHtml,
          summary: n.summary,
          date_modified: n.createdAt,
        })),
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to load notes" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

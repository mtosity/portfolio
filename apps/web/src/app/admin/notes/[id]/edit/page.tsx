import { notFound } from "next/navigation";
import NoteEditor from "@/components/admin/NoteEditor";
import { getNoteById } from "@/lib/notes";

export const dynamic = "force-dynamic";

export default async function EditNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const note = await getNoteById(id);
  if (!note) notFound();

  return (
    <NoteEditor
      note={{
        id: note.id,
        title: note.title,
        bodyHtml: note.bodyHtml,
        bodyJson: note.bodyJson,
        published: note.published,
      }}
    />
  );
}

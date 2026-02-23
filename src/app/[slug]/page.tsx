import { notFound, redirect } from "next/navigation";

interface Note {
  id: string;
  title: string;
}

interface Feed {
  items: Note[];
}

function getNoteSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const revalidate = 3600;

export default async function NoteRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let feed: Feed;
  try {
    const res = await fetch("https://mtosity.leaflet.pub/json", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) notFound();
    feed = await res.json();
  } catch {
    notFound();
  }

  const match = feed!.items.find(
    (n) => getNoteSlug(n.title) === slug || getNoteSlug(n.id) === slug || n.id === slug
  );

  if (!match) notFound();

  redirect(`/notes?note=${slug}`);
}

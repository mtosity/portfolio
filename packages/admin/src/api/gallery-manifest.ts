import { NextResponse } from "next/server";
import { readManifest, writeManifest } from "@mtosity/lib/gallery";
import { auth } from "../auth";

type Entry = { width: number; height: number };

function isValidEntry(value: unknown): value is Entry {
  const e = value as Entry;
  return (
    typeof e === "object" &&
    e !== null &&
    Number.isFinite(e.width) &&
    Number.isFinite(e.height) &&
    e.width > 0 &&
    e.height > 0
  );
}

// POST /api/admin/gallery/manifest — merge measured dimensions for freshly
// uploaded photos into the gallery dimensions manifest.
export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { entries } = (await req.json()) as { entries?: Record<string, Entry> };
    const valid = Object.entries(entries ?? {}).filter(
      ([name, dims]) => name && !name.includes("/") && isValidEntry(dims),
    );
    if (valid.length === 0) {
      return NextResponse.json({ error: "No valid entries" }, { status: 400 });
    }
    const manifest = await readManifest();
    for (const [name, { width, height }] of valid) {
      manifest[name] = { width: Math.round(width), height: Math.round(height) };
    }
    await writeManifest(manifest);
    return NextResponse.json({ ok: true, merged: valid.length });
  } catch {
    return NextResponse.json({ error: "Manifest update failed" }, { status: 500 });
  }
}

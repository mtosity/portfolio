import { NextResponse } from "next/server";
import { auth } from "../auth";
import {
  deleteCodeExample,
  deleteDefinition,
  isValidAnchorKey,
  listCodeExamples,
  listDefinitions,
  upsertCodeExample,
  upsertDefinition,
  type BlogCodeExampleInput,
  type BlogDefinitionInput,
} from "@mtosity/lib/blog-definitions";

/**
 * Both anchor kinds share one endpoint, discriminated by `kind`, because the
 * editor's anchor picker needs them in a single fetch to populate its dropdown.
 */
type AnchorKind = "definition" | "code";

type UpsertBody = { kind?: string } & Partial<BlogDefinitionInput> &
  Partial<BlogCodeExampleInput>;

function isAnchorKind(value: unknown): value is AnchorKind {
  return value === "definition" || value === "code";
}

// GET /api/admin/blog-definitions — every definition and code example.
export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const [definitions, codeExamples] = await Promise.all([
      listDefinitions(),
      listCodeExamples(),
    ]);
    return NextResponse.json({ definitions, codeExamples });
  } catch {
    return NextResponse.json(
      { error: "Failed to load definitions" },
      { status: 500 }
    );
  }
}

// POST /api/admin/blog-definitions — create or replace one entry (upsert on key).
export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await req.json()) as UpsertBody;
    if (!isAnchorKind(body.kind)) {
      return NextResponse.json(
        { error: "kind must be 'definition' or 'code'" },
        { status: 400 }
      );
    }
    // Keys land in a data-anchor-key attribute, so enforce the charset here as
    // well as in lib — a 400 is far more useful to the editor than a 500.
    if (!isValidAnchorKey(body.key)) {
      return NextResponse.json(
        { error: "key must match ^[a-zA-Z0-9_-]+$" },
        { status: 400 }
      );
    }
    if (!body.title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (body.kind === "definition") {
      const definition = await upsertDefinition({
        key: body.key,
        title: body.title.trim(),
        contentHtml: body.contentHtml,
      });
      return NextResponse.json({ definition }, { status: 201 });
    }

    const codeExample = await upsertCodeExample({
      key: body.key,
      title: body.title.trim(),
      description: body.description,
      wrongCode: body.wrongCode,
      correctCode: body.correctCode,
      alternativeCode: body.alternativeCode,
    });
    return NextResponse.json({ codeExample }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to save definition" },
      { status: 500 }
    );
  }
}

// PUT is an alias for POST — the write is an upsert either way.
export const PUT = POST;

// DELETE /api/admin/blog-definitions?kind=definition&key=foo
export async function DELETE(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const kind = searchParams.get("kind");
  const key = searchParams.get("key");
  if (!isAnchorKind(kind)) {
    return NextResponse.json(
      { error: "kind must be 'definition' or 'code'" },
      { status: 400 }
    );
  }
  if (!key) {
    return NextResponse.json({ error: "key is required" }, { status: 400 });
  }
  try {
    const ok =
      kind === "definition"
        ? await deleteDefinition(key)
        : await deleteCodeExample(key);
    if (!ok) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete definition" },
      { status: 500 }
    );
  }
}

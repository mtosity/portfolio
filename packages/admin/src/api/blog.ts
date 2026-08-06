import { NextResponse } from "next/server";
import { auth } from "../auth";
import {
  createPost,
  listAllPosts,
  type BlogPostInput,
} from "@mtosity/lib/blog";

// GET /api/admin/blog — list every post (including drafts) for the editor.
export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const posts = await listAllPosts();
    return NextResponse.json({ posts });
  } catch {
    return NextResponse.json({ error: "Failed to load posts" }, { status: 500 });
  }
}

// POST /api/admin/blog — create a post (defaults to a draft).
export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await req.json()) as Partial<BlogPostInput>;
    if (!body.title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    const post = await createPost({
      title: body.title.trim(),
      bodyHtml: body.bodyHtml ?? "",
      bodyJson: body.bodyJson,
      excerpt: body.excerpt,
      category: body.category,
      coverImage: body.coverImage,
      published: body.published,
      slug: body.slug,
      publishedAt: body.publishedAt,
    });
    return NextResponse.json({ post }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}

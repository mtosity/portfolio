"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import BlogEditor, {
  type EditorBlogPost,
} from "../components/blog/BlogEditor";
import { getBlogPost } from "../components/blog/blogApi";

export default function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [post, setPost] = useState<EditorBlogPost | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getBlogPost(id)
      .then(setPost)
      .catch((e: Error) => setError(e.message || "Could not load this post."));
  }, [id]);

  if (error) {
    return (
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.78rem",
          color: "var(--danger)",
          lineHeight: 1.6,
        }}
      >
        {error}{" "}
        <Link href="/admin/blog" style={{ color: "var(--fg)" }}>
          Back to posts
        </Link>
      </p>
    );
  }

  if (!post) {
    return (
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.8rem",
          color: "var(--muted)",
        }}
      >
        Loading…
      </p>
    );
  }

  return <BlogEditor post={post} />;
}

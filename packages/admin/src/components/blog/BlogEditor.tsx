"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AccentButton, ConfirmDialog, Select } from "@mtosity/design-system";
import {
  RichTextStyles,
  RichTextSurface,
  RichTextToolbar,
  pickImage,
  uploadEditorImage,
  useImageUpload,
  useRichEditor,
} from "../RichTextEditor";
import { AnchorToolbarControls, useAnchorSources } from "./AnchorControls";
import { anchorExtensions, findAnchorIssues } from "./anchorNodes";
import {
  BLOG_CATEGORIES,
  createBlogPost,
  deleteBlogPost,
  isBlogCategory,
  updateBlogPost,
  type BlogCategory,
  type BlogPostRecord,
} from "./blogApi";

export type EditorBlogPost = Pick<
  BlogPostRecord,
  | "id"
  | "slug"
  | "title"
  | "excerpt"
  | "category"
  | "coverImage"
  | "bodyHtml"
  | "bodyJson"
  | "published"
>;

export default function BlogEditor({ post }: { post?: EditorBlogPost }) {
  const router = useRouter();
  const isEdit = Boolean(post);

  const [title, setTitle] = useState(post?.title ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [category, setCategory] = useState<BlogCategory>(
    post?.category ?? "Building"
  );
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [coverUploading, setCoverUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const editor = useRichEditor({
    content:
      (post?.bodyJson as object | undefined) ?? post?.bodyHtml ?? "<p></p>",
    extensions: anchorExtensions,
  });
  const sources = useAnchorSources();
  const { uploading, uploadError, insertImage } =
    useImageUpload(uploadEditorImage);

  function uploadCover() {
    pickImage(
      uploadEditorImage,
      (url, err) => {
        setCoverUploading(false);
        if (url) setCoverImage(url);
        if (err) setError(err);
      },
      () => {
        setCoverUploading(true);
        setError(null);
      }
    );
  }

  async function save(published: boolean) {
    if (!editor) return;
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (published && !excerpt.trim()) {
      setError("An excerpt is required before publishing.");
      return;
    }

    const issues = findAnchorIssues(editor);
    if (issues.length > 0) {
      const first = issues[0]!;
      setError(
        `Fix ${issues.length} anchor problem${issues.length > 1 ? "s" : ""} first — ` +
          `${first.type} anchor "${first.text || "(no text)"}" has ` +
          (first.reason === "missing-key"
            ? "no key."
            : first.reason === "invalid-key"
              ? `an invalid key "${first.key}".`
              : "no visible text.")
      );
      return;
    }

    setSaving(true);
    setError(null);
    const payload = {
      title: title.trim(),
      // Sent so an edit never silently moves a live post's URL; blank on a new
      // post so the server derives it from the title.
      slug: slug.trim() || undefined,
      excerpt: excerpt.trim(),
      category,
      coverImage: coverImage.trim() || null,
      bodyHtml: editor.getHTML(),
      bodyJson: editor.getJSON(),
      published,
    };
    try {
      if (isEdit) await updateBlogPost(post!.id, payload);
      else await createBlogPost(payload);
      router.push("/admin/blog");
      router.refresh();
    } catch (e) {
      setError((e as Error).message || "Failed to save. Try again.");
      setSaving(false);
    }
  }

  async function remove() {
    if (!post) return;
    setSaving(true);
    try {
      await deleteBlogPost(post.id);
      router.push("/admin/blog");
      router.refresh();
    } catch (e) {
      setError((e as Error).message || "Failed to delete.");
      setSaving(false);
      setConfirmOpen(false);
    }
  }

  const isDraft = isEdit ? !post!.published : true;

  return (
    <div className="blog-editor">
      <div className="blog-editor-header">
        <span className="blog-editor-kicker">
          {isEdit ? "Edit post" : "New post"}
        </span>
        {isEdit && (
          <span
            className={`blog-editor-status${post!.published ? " is-live" : ""}`}
          >
            {post!.published ? "Published" : "Draft"}
          </span>
        )}
        {isEdit && post!.slug && (
          <Link
            href={`/blog/${post!.slug}`}
            target="_blank"
            className="blog-editor-view"
          >
            /blog/{post!.slug} ↗
          </Link>
        )}
        <span style={{ flex: 1 }} />
        {isEdit && (
          <button
            className="blog-editor-delete"
            onClick={() => setConfirmOpen(true)}
            disabled={saving}
          >
            Delete
          </button>
        )}
      </div>

      <input
        className="blog-editor-title"
        placeholder="Post title…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="blog-editor-meta">
        <label className="blog-editor-field">
          <span>Category</span>
          <Select
            value={category}
            onChange={(v) => {
              if (isBlogCategory(v)) setCategory(v);
            }}
            options={BLOG_CATEGORIES.map((c) => ({ value: c, label: c }))}
            aria-label="Category"
          />
        </label>

        <label className="blog-editor-field">
          <span>Slug</span>
          <input
            className="blog-editor-input"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="auto from title"
          />
        </label>

        <label className="blog-editor-field blog-editor-field-wide">
          <span>Cover image</span>
          <div className="blog-editor-cover-row">
            <input
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://… (optional)"
            />
            <button
              className="blog-editor-secondary"
              onClick={uploadCover}
              disabled={coverUploading}
            >
              {coverUploading ? "Uploading…" : "Upload"}
            </button>
            {coverImage && (
              <button
                className="blog-editor-secondary"
                onClick={() => setCoverImage("")}
              >
                Clear
              </button>
            )}
          </div>
        </label>
      </div>

      {coverImage && (
        <div className="blog-editor-cover-preview">
          <Image
            src={coverImage}
            alt="Cover preview"
            fill
            unoptimized
            style={{ objectFit: "cover" }}
          />
        </div>
      )}

      <label className="blog-editor-field">
        <span>Excerpt</span>
        <textarea
          className="blog-editor-excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={3}
          placeholder="One or two sentences for the blog index…"
        />
      </label>

      {editor && (
        <RichTextToolbar
          editor={editor}
          uploading={uploading}
          codeBlock
          onUploadImage={() => insertImage(editor)}
          extra={<AnchorToolbarControls editor={editor} sources={sources} />}
        />
      )}

      <RichTextSurface
        editor={editor}
        placeholder="Write the post…"
        minHeight={420}
      />

      <p className="blog-editor-hint">
        Select some text, then choose <strong>Definition</strong> or{" "}
        <strong>Code</strong> to attach an anchor. Keys come from the{" "}
        <Link href="/admin/blog/definitions" className="blog-editor-link">
          definitions manager
        </Link>
        .
      </p>

      <div className="blog-editor-actions">
        {(error || uploadError) && (
          <span className="blog-editor-error">{error ?? uploadError}</span>
        )}
        <span style={{ flex: 1 }} />
        <button
          className="blog-editor-secondary"
          onClick={() => router.push("/admin/blog")}
          disabled={saving}
        >
          Cancel
        </button>
        {isDraft ? (
          <>
            <button
              className="blog-editor-secondary"
              onClick={() => save(false)}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save as draft"}
            </button>
            <AccentButton
              onClick={() => save(true)}
              disabled={saving}
              style={{
                borderRadius: 2,
                padding: "0.5rem 1.1rem",
                fontSize: "0.75rem",
                letterSpacing: 0,
                textTransform: "none",
              }}
            >
              Publish
            </AccentButton>
          </>
        ) : (
          <>
            <button
              className="blog-editor-secondary"
              onClick={() => save(false)}
              disabled={saving}
            >
              Unpublish
            </button>
            <AccentButton
              onClick={() => save(true)}
              disabled={saving}
              style={{
                borderRadius: 2,
                padding: "0.5rem 1.1rem",
                fontSize: "0.75rem",
                letterSpacing: 0,
                textTransform: "none",
              }}
            >
              {saving ? "Saving…" : "Save changes"}
            </AccentButton>
          </>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete post"
        message="Delete this post? This cannot be undone."
        busy={saving}
        onConfirm={remove}
        onCancel={() => setConfirmOpen(false)}
      />

      <RichTextStyles anchors />

      <style>{`
        .blog-editor { display: flex; flex-direction: column; gap: 1rem; }
        .blog-editor-header { display: flex; align-items: center; gap: 0.6rem; }
        .blog-editor-kicker {
          font-family: var(--font-mono); font-size: 0.66rem; text-transform: uppercase;
          letter-spacing: 0.15em; color: var(--muted);
        }
        .blog-editor-status {
          font-family: var(--font-mono); font-size: 0.6rem; text-transform: uppercase;
          letter-spacing: 0.1em; color: var(--muted);
          border: 1px solid var(--border-light); border-radius: 2px; padding: 0.15rem 0.4rem;
        }
        .blog-editor-status.is-live { color: var(--accent-fg); background: var(--accent); border-color: var(--accent-fg); }
        .blog-editor-view, .blog-editor-link {
          font-family: var(--font-mono); font-size: 0.68rem; color: var(--muted); text-decoration: underline;
        }
        .blog-editor-view:hover, .blog-editor-link:hover { color: var(--fg); }
        .blog-editor-title {
          font-family: var(--font-heading); font-size: 1.9rem; font-weight: 600;
          background: transparent; border: none; border-bottom: 1px solid var(--border-light);
          color: var(--fg); padding: 0.5rem 0; outline: none;
        }
        .blog-editor-title::placeholder { color: var(--muted); opacity: 0.6; }
        .blog-editor-meta {
          display: grid; grid-template-columns: 180px 1fr; gap: 1rem; align-items: end;
        }
        .blog-editor-field-wide { grid-column: 1 / -1; }
        @media (max-width: 640px) { .blog-editor-meta { grid-template-columns: 1fr; } }
        .blog-editor-field { display: flex; flex-direction: column; gap: 0.35rem; }
        .blog-editor-field > span {
          font-family: var(--font-mono); font-size: 0.64rem; text-transform: uppercase;
          letter-spacing: 0.12em; color: var(--muted);
        }
        .blog-editor-cover-row { display: flex; gap: 0.4rem; }
        .blog-editor-cover-row input, .blog-editor-excerpt, .blog-editor-input {
          flex: 1; background: var(--bg-secondary); border: 1px solid var(--border-light);
          border-radius: 2px; padding: 0.5rem 0.6rem; color: var(--fg);
          font-family: var(--font-mono); font-size: 0.78rem; outline: none; width: 100%;
          resize: vertical;
        }
        .blog-editor-cover-row input:focus, .blog-editor-excerpt:focus,
        .blog-editor-input:focus { border-color: var(--fg); }
        .blog-editor-cover-preview {
          position: relative; width: 100%; aspect-ratio: 3 / 1; border-radius: 3px;
          overflow: hidden; border: 1px solid var(--border-light); background: var(--bg-secondary);
        }
        .blog-editor-hint {
          font-family: var(--font-mono); font-size: 0.68rem; color: var(--muted);
          line-height: 1.6; margin: 0;
        }
        .blog-editor-actions { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; }
        .blog-editor-error {
          font-family: var(--font-mono); font-size: 0.72rem; color: var(--danger); line-height: 1.5;
        }
        .blog-editor-secondary {
          background: transparent; color: var(--fg); border: 1px solid var(--border);
          border-radius: 2px; padding: 0.5rem 0.9rem; font-family: var(--font-mono);
          font-size: 0.75rem; cursor: pointer; white-space: nowrap;
        }
        .blog-editor-secondary:disabled { opacity: 0.6; cursor: default; }
        .blog-editor-delete {
          background: transparent; color: var(--danger); border: 1px solid var(--danger);
          border-radius: 2px; padding: 0.4rem 0.8rem; font-family: var(--font-mono);
          font-size: 0.72rem; cursor: pointer;
        }
        .blog-editor-delete:disabled { opacity: 0.6; cursor: default; }
      `}</style>
    </div>
  );
}

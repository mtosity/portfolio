"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AccentButton, ConfirmDialog } from "@mtosity/design-system";
import {
  RichTextStyles,
  RichTextSurface,
  RichTextToolbar,
  uploadEditorImage,
  useImageUpload,
  useRichEditor,
} from "./RichTextEditor";

export interface EditorNote {
  id: string;
  title: string;
  bodyHtml: string;
  bodyJson: unknown | null;
  published: boolean;
}

export default function NoteEditor({ note }: { note?: EditorNote }) {
  const router = useRouter();
  const isEdit = Boolean(note);

  const [title, setTitle] = useState(note?.title ?? "");
  const [published, setPublished] = useState(note?.published ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const editor = useRichEditor({
    content:
      (note?.bodyJson as object | undefined) ?? note?.bodyHtml ?? "<p></p>",
  });

  const { uploading, uploadError, insertImage } =
    useImageUpload(uploadEditorImage);

  async function save() {
    if (!editor) return;
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        title: title.trim(),
        bodyHtml: editor.getHTML(),
        bodyJson: editor.getJSON(),
        published,
      };
      const res = await fetch(
        isEdit ? `/api/admin/notes/${note!.id}` : "/api/admin/notes",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error("save failed");
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Failed to save. Try again.");
      setSaving(false);
    }
  }

  async function remove() {
    if (!note) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/notes/${note.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("delete failed");
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Failed to delete.");
      setSaving(false);
      setConfirmOpen(false);
    }
  }

  return (
    <div className="note-editor">
      <div className="note-editor-header">
        <span style={{ flex: 1 }} />
        {isEdit && (
          <button
            className="note-editor-delete"
            onClick={() => setConfirmOpen(true)}
            disabled={saving}
          >
            Delete
          </button>
        )}
      </div>

      <input
        className="note-editor-title"
        placeholder="Note title…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {editor && (
        <RichTextToolbar
          editor={editor}
          uploading={uploading}
          onUploadImage={() => insertImage(editor)}
        />
      )}

      <RichTextSurface editor={editor} placeholder="Write your note…" />

      <div className="note-editor-actions">
        <label className="note-editor-publish">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          Published
        </label>
        <span style={{ flex: 1 }} />
        {(error || uploadError) && (
          <span className="note-editor-error">{error ?? uploadError}</span>
        )}
        <button
          className="note-editor-cancel"
          onClick={() => router.push("/admin/notes")}
          disabled={saving}
        >
          Cancel
        </button>
        <AccentButton
          onClick={save}
          disabled={saving}
          style={{
            borderRadius: 2,
            padding: "0.5rem 1.1rem",
            fontSize: "0.75rem",
            letterSpacing: 0,
            textTransform: "none",
          }}
        >
          {saving ? "Saving…" : isEdit ? "Save changes" : "Create note"}
        </AccentButton>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete note"
        message="Delete this note? This cannot be undone."
        busy={saving}
        onConfirm={remove}
        onCancel={() => setConfirmOpen(false)}
      />

      <RichTextStyles />

      <style>{`
        .note-editor { display: flex; flex-direction: column; gap: 1rem; }
        .note-editor-header { display: flex; align-items: center; }
        .note-editor-title {
          font-family: var(--font-heading);
          font-size: 1.9rem; font-weight: 600;
          background: transparent; border: none; border-bottom: 1px solid var(--border-light);
          color: var(--fg); padding: 0.5rem 0; outline: none;
        }
        .note-editor-title::placeholder { color: var(--muted); opacity: 0.6; }
        .note-editor-actions { display: flex; align-items: center; gap: 0.75rem; }
        .note-editor-publish {
          display: inline-flex; align-items: center; gap: 0.4rem;
          font-family: var(--font-mono); font-size: 0.75rem; color: var(--muted); cursor: pointer;
        }
        .note-editor-error { font-family: var(--font-mono); font-size: 0.72rem; color: var(--danger); }
        .note-editor-delete {
          background: transparent; color: var(--danger); border: 1px solid var(--danger);
          border-radius: 2px; padding: 0.5rem 0.9rem; font-family: var(--font-mono);
          font-size: 0.75rem; cursor: pointer;
        }
        .note-editor-delete:disabled { opacity: 0.6; cursor: default; }
        .note-editor-cancel {
          background: transparent; color: var(--fg); border: 1px solid var(--border);
          border-radius: 2px; padding: 0.5rem 0.9rem; font-family: var(--font-mono);
          font-size: 0.75rem; cursor: pointer;
        }
        .note-editor-cancel:disabled { opacity: 0.6; cursor: default; }
      `}</style>
    </div>
  );
}

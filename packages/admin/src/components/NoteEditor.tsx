"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import ConfirmDialog from "./ConfirmDialog";

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
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ inline: false }),
    ],
    content:
      (note?.bodyJson as object | undefined) ?? note?.bodyHtml ?? "<p></p>",
    editorProps: {
      attributes: { class: "note-editor-prose" },
    },
  });

  async function uploadImage() {
    if (!editor) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setUploading(true);
      setError(null);
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: fd,
        });
        if (!res.ok) throw new Error("upload failed");
        const { url } = await res.json();
        editor.chain().focus().setImage({ src: url }).run();
      } catch {
        setError("Image upload failed.");
      } finally {
        setUploading(false);
      }
    };
    input.click();
  }

  function setLink() {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  }

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

  const btn = (active: boolean): React.CSSProperties => ({
    background: active ? "var(--fg)" : "transparent",
    color: active ? "var(--bg)" : "var(--fg)",
    border: "1px solid var(--border)",
    borderRadius: 2,
    padding: "0.3rem 0.55rem",
    fontFamily: "var(--font-mono)",
    fontSize: "0.72rem",
    cursor: "pointer",
    lineHeight: 1,
  });

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
        <div className="note-editor-toolbar">
          <button style={btn(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
          <button style={btn(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
          <button style={btn(editor.isActive("strike"))} onClick={() => editor.chain().focus().toggleStrike().run()}>S</button>
          <button style={btn(editor.isActive("heading", { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
          <button style={btn(editor.isActive("heading", { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
          <button style={btn(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
          <button style={btn(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
          <button style={btn(editor.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()}>❝</button>
          <button style={btn(editor.isActive("link"))} onClick={setLink}>Link</button>
          <button style={btn(false)} onClick={uploadImage} disabled={uploading}>
            {uploading ? "Uploading…" : "Image"}
          </button>
          <span style={{ flex: 1 }} />
          <button style={btn(false)} onClick={() => editor.chain().focus().undo().run()}>↶</button>
          <button style={btn(false)} onClick={() => editor.chain().focus().redo().run()}>↷</button>
        </div>
      )}

      <EditorContent editor={editor} className="note-editor-surface" />

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
        {error && <span className="note-editor-error">{error}</span>}
        <button
          className="note-editor-cancel"
          onClick={() => router.push("/admin/notes")}
          disabled={saving}
        >
          Cancel
        </button>
        <button className="note-editor-save" onClick={save} disabled={saving}>
          {saving ? "Saving…" : isEdit ? "Save changes" : "Create note"}
        </button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete note"
        message="Delete this note? This cannot be undone."
        busy={saving}
        onConfirm={remove}
        onCancel={() => setConfirmOpen(false)}
      />

      <style>{`
        .note-editor { display: flex; flex-direction: column; gap: 1rem; }
        .note-editor-header { display: flex; align-items: center; }
        .note-editor-title {
          font-family: var(--font-crimson-text), Georgia, serif;
          font-size: 1.9rem; font-weight: 600;
          background: transparent; border: none; border-bottom: 1px solid var(--border-light);
          color: var(--fg); padding: 0.5rem 0; outline: none;
        }
        .note-editor-title::placeholder { color: var(--muted); opacity: 0.6; }
        .note-editor-toolbar {
          display: flex; flex-wrap: wrap; gap: 0.35rem; align-items: center;
          padding: 0.5rem; border: 1px solid var(--border-light); border-radius: 3px;
          background: var(--bg-secondary);
        }
        .note-editor-surface {
          border: 1px solid var(--border-light); border-radius: 3px;
          background: var(--bg); min-height: 320px;
        }
        .note-editor-prose {
          padding: 1.25rem 1.4rem; min-height: 320px; outline: none;
          font-size: 1rem; line-height: 1.75; color: var(--fg);
        }
        .note-editor-prose:focus { outline: none; }
        .note-editor-prose p { margin: 0 0 0.9em; }
        .note-editor-prose h2, .note-editor-prose h3 {
          font-family: var(--font-crimson-text), Georgia, serif; margin: 1.1em 0 0.4em;
        }
        .note-editor-prose blockquote {
          border-left: 3px solid var(--border); margin: 1em 0; padding-left: 1rem; color: var(--muted);
        }
        .note-editor-prose img { max-width: 100%; height: auto; border-radius: 2px; margin: 0.75em 0; }
        .note-editor-prose a { color: var(--fg); text-decoration: underline; }
        .note-editor-prose ul, .note-editor-prose ol { padding-left: 1.4rem; margin: 0 0 0.9em; }
        .note-editor-prose:empty::before,
        .note-editor-prose p.is-editor-empty:first-child::before {
          content: "Write your note…"; color: var(--muted); opacity: 0.5; pointer-events: none; height: 0; float: left;
        }
        .note-editor-actions { display: flex; align-items: center; gap: 0.75rem; }
        .note-editor-publish {
          display: inline-flex; align-items: center; gap: 0.4rem;
          font-family: var(--font-mono); font-size: 0.75rem; color: var(--muted); cursor: pointer;
        }
        .note-editor-error { font-family: var(--font-mono); font-size: 0.72rem; color: #b00020; }
        .note-editor-save {
          background: var(--accent); color: var(--accent-fg); border: 1px solid var(--accent-fg);
          border-radius: 2px; padding: 0.5rem 1.1rem; font-family: var(--font-mono);
          font-size: 0.75rem; font-weight: 700; cursor: pointer;
        }
        .note-editor-save:disabled { opacity: 0.6; cursor: default; }
        .note-editor-delete {
          background: transparent; color: #b00020; border: 1px solid #b00020;
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

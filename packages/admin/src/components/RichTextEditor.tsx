"use client";

import { useState } from "react";
import { useEditor, EditorContent, type Editor, type Extensions } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

/**
 * The Tiptap surface shared by the note editor and the blog editor.
 * The parent owns the editor instance (so it can call getHTML/getJSON on save)
 * and composes the toolbar; extra controls — e.g. the blog anchor picker —
 * slot in through `extra`.
 */

export interface RichEditorOptions {
  /** Tiptap JSON (preferred) or HTML. */
  content: object | string;
  /** Extra extensions, e.g. the blog anchor nodes. */
  extensions?: Extensions;
}

export function useRichEditor({ content, extensions = [] }: RichEditorOptions) {
  return useEditor({
    immediatelyRender: false,
    // Keep toolbar active-states (bold, heading, anchor under caret…) in sync
    // with the selection.
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ inline: false }),
      ...extensions,
    ],
    content,
    editorProps: {
      attributes: { class: "rte-prose" },
    },
  });
}

export function toolbarButtonStyle(active: boolean): React.CSSProperties {
  return {
    background: active ? "var(--fg)" : "transparent",
    color: active ? "var(--bg)" : "var(--fg)",
    border: "1px solid var(--border)",
    borderRadius: 2,
    padding: "0.3rem 0.55rem",
    fontFamily: "var(--font-mono)",
    fontSize: "0.72rem",
    cursor: "pointer",
    lineHeight: 1,
  };
}

/** Prompt for a link URL on the current selection. */
export function promptForLink(editor: Editor) {
  const prev = editor.getAttributes("link").href as string | undefined;
  const url = window.prompt("Link URL", prev ?? "https://");
  if (url === null) return;
  if (url === "") {
    editor.chain().focus().unsetLink().run();
    return;
  }
  editor.chain().focus().setLink({ href: url }).run();
}

/** Upload through the existing owner-auth-gated admin endpoint. */
export async function uploadEditorImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  if (!res.ok) throw new Error("upload failed");
  const { url } = (await res.json()) as { url: string };
  return url;
}

/** Pick a file and hand it to `upload`; returns the uploaded URL or null. */
export function pickImage(
  upload: (file: File) => Promise<string>,
  onDone: (url: string | null, error?: string) => void,
  onStart?: () => void
) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;
    onStart?.();
    try {
      onDone(await upload(file));
    } catch {
      onDone(null, "Image upload failed.");
    }
  };
  input.click();
}

export function RichTextToolbar({
  editor,
  onUploadImage,
  uploading = false,
  codeBlock = false,
  extra,
}: {
  editor: Editor;
  onUploadImage?: () => void;
  uploading?: boolean;
  /** Show the code-block control (blog only; notes keep their original set). */
  codeBlock?: boolean;
  /** Rendered after the built-in controls, before the undo/redo group. */
  extra?: React.ReactNode;
}) {
  const btn = toolbarButtonStyle;
  return (
    <div className="rte-toolbar">
      <button style={btn(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
      <button style={btn(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
      <button style={btn(editor.isActive("strike"))} onClick={() => editor.chain().focus().toggleStrike().run()}>S</button>
      <button style={btn(editor.isActive("heading", { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
      <button style={btn(editor.isActive("heading", { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
      <button style={btn(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
      <button style={btn(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
      <button style={btn(editor.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()}>❝</button>
      {codeBlock && (
        <button style={btn(editor.isActive("codeBlock"))} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>{"</>"}</button>
      )}
      <button style={btn(editor.isActive("link"))} onClick={() => promptForLink(editor)}>Link</button>
      {onUploadImage && (
        <button style={btn(false)} onClick={onUploadImage} disabled={uploading}>
          {uploading ? "Uploading…" : "Image"}
        </button>
      )}
      {extra}
      <span style={{ flex: 1 }} />
      <button style={btn(false)} onClick={() => editor.chain().focus().undo().run()}>↶</button>
      <button style={btn(false)} onClick={() => editor.chain().focus().redo().run()}>↷</button>
    </div>
  );
}

export function RichTextSurface({
  editor,
  placeholder = "Write…",
  minHeight = 320,
}: {
  editor: Editor | null;
  placeholder?: string;
  minHeight?: number;
}) {
  return (
    <EditorContent
      editor={editor}
      className="rte-surface"
      style={
        {
          "--rte-placeholder": JSON.stringify(placeholder),
          "--rte-min-height": `${minHeight}px`,
        } as React.CSSProperties
      }
    />
  );
}

/** Image picking + upload state for the toolbar's Image button. */
export function useImageUpload(upload: (file: File) => Promise<string>) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return {
    uploading,
    uploadError: error,
    clearUploadError: () => setError(null),
    insertImage: (editor: Editor) => {
      pickImage(
        upload,
        (url, err) => {
          setUploading(false);
          if (url) editor.chain().focus().setImage({ src: url }).run();
          if (err) setError(err);
        },
        () => {
          setUploading(true);
          setError(null);
        }
      );
    },
  };
}

/**
 * Styles for the toolbar/surface/prose. Rendered once per editor instance
 * (duplicate <style> tags are harmless) so the component stays self-contained.
 * `anchors` adds the blog anchor colouring — blue for definitions, purple for
 * code examples, matching the live InteractiveAnchor / CodeAnchor components.
 */
export function RichTextStyles({ anchors = false }: { anchors?: boolean }) {
  return (
    <style>{`
      .rte-toolbar {
        display: flex; flex-wrap: wrap; gap: 0.35rem; align-items: center;
        padding: 0.5rem; border: 1px solid var(--border-light); border-radius: 3px;
        background: var(--bg-secondary);
      }
      .rte-surface {
        border: 1px solid var(--border-light); border-radius: 3px;
        background: var(--bg); min-height: var(--rte-min-height, 320px);
      }
      .rte-prose {
        padding: 1.25rem 1.4rem; min-height: var(--rte-min-height, 320px); outline: none;
        font-size: 1rem; line-height: 1.75; color: var(--fg);
      }
      .rte-prose:focus { outline: none; }
      .rte-prose p { margin: 0 0 0.9em; }
      .rte-prose h2, .rte-prose h3 {
        font-family: var(--font-heading); margin: 1.1em 0 0.4em;
      }
      .rte-prose blockquote {
        border-left: 3px solid var(--border); margin: 1em 0; padding-left: 1rem; color: var(--muted);
      }
      .rte-prose img { max-width: 100%; height: auto; border-radius: 2px; margin: 0.75em 0; }
      .rte-prose a { color: var(--fg); text-decoration: underline; }
      .rte-prose ul, .rte-prose ol { padding-left: 1.4rem; margin: 0 0 0.9em; }
      .rte-prose pre {
        background: var(--bg-secondary); border: 1px solid var(--border-light);
        border-radius: 3px; padding: 0.8rem 1rem; overflow-x: auto;
        font-family: var(--font-mono); font-size: 0.82rem; margin: 0 0 0.9em;
      }
      .rte-prose code { font-family: var(--font-mono); font-size: 0.86em; }
      .rte-prose:empty::before,
      .rte-prose p.is-editor-empty:first-child::before {
        content: var(--rte-placeholder, "Write…");
        color: var(--muted); opacity: 0.5; pointer-events: none; height: 0; float: left;
      }
      ${
        anchors
          ? `
      /* Anchors: obvious in the editor, but the saved HTML carries no class —
         these hang off the same data attributes the renderer reads. */
      .rte-prose span[data-anchor] {
        border-radius: 3px; padding: 0 0.2em;
        font-weight: 500; cursor: text;
        box-decoration-break: clone; -webkit-box-decoration-break: clone;
      }
      .rte-prose span[data-anchor="definition"] {
        color: #1d4ed8; background: #eff6ff; box-shadow: inset 0 -1px 0 #93c5fd;
      }
      .rte-prose span[data-anchor="code"] {
        color: #7e22ce; background: #faf5ff; box-shadow: inset 0 -1px 0 #d8b4fe;
        font-family: var(--font-mono); font-size: 0.92em;
      }
      /* Flag anchors that would not resolve — empty label or missing key. */
      .rte-prose span[data-anchor]:empty::after,
      .rte-prose span[data-anchor][data-anchor-key=""]::after {
        content: "⚠"; margin-left: 0.2em; color: var(--danger);
      }
      [data-theme="dark"] .rte-prose span[data-anchor="definition"] {
        color: #93c5fd; background: rgba(30, 58, 138, 0.35); box-shadow: inset 0 -1px 0 #1d4ed8;
      }
      [data-theme="dark"] .rte-prose span[data-anchor="code"] {
        color: #d8b4fe; background: rgba(88, 28, 135, 0.35); box-shadow: inset 0 -1px 0 #7e22ce;
      }
      .rte-prose span[data-anchor].ProseMirror-selectednode {
        outline: 2px solid var(--fg); outline-offset: 1px;
      }
      `
          : ""
      }
    `}</style>
  );
}

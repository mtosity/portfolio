"use client";

import { useCallback, useEffect, useState } from "react";
import { AccentButton, ConfirmDialog } from "@mtosity/design-system";
import {
  RichTextStyles,
  RichTextSurface,
  RichTextToolbar,
  uploadEditorImage,
  useImageUpload,
  useRichEditor,
} from "../RichTextEditor";
import { ANCHOR_KEY_PATTERN } from "./anchorNodes";
import {
  deleteCodeExample,
  deleteDefinition,
  listCodeExamples,
  listDefinitions,
  saveCodeExample,
  saveDefinition,
  type BlogCodeExample,
  type BlogDefinition,
  type CodeSnippet,
} from "./blogApi";

type Tab = "definitions" | "code";

const EMPTY_SNIPPET: CodeSnippet = { code: "", language: "tsx", explanation: "" };

export default function DefinitionsManager() {
  const [tab, setTab] = useState<Tab>("definitions");

  // Deep link from the anchor picker: /admin/blog/definitions?tab=code
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("tab") === "code") setTab("code");
  }, []);

  return (
    <div className="defs">
      <div className="defs-head">
        <h1 className="defs-h1">Anchor sources</h1>
        <span style={{ flex: 1 }} />
      </div>
      <p className="defs-intro">
        Definitions and code examples are what the blog anchors point at. A key
        used here is what you pick in the editor and what ends up in{" "}
        <code>data-anchor-key</code>.
      </p>

      <div className="defs-tabs">
        <button
          className={`defs-tab${tab === "definitions" ? " is-active" : ""}`}
          onClick={() => setTab("definitions")}
        >
          Definitions
        </button>
        <button
          className={`defs-tab${tab === "code" ? " is-active" : ""}`}
          onClick={() => setTab("code")}
        >
          Code examples
        </button>
      </div>

      {tab === "definitions" ? <DefinitionsPanel /> : <CodeExamplesPanel />}

      <RichTextStyles />

      <style>{`
        .defs { display: flex; flex-direction: column; gap: 1rem; }
        .defs-head { display: flex; align-items: baseline; gap: 1rem; }
        .defs-h1 { font-family: var(--font-heading); font-size: 2rem; font-weight: 600; margin: 0; }
        .defs-intro {
          font-family: var(--font-mono); font-size: 0.72rem; color: var(--muted);
          line-height: 1.7; margin: 0; max-width: 60ch;
        }
        .defs-intro code {
          font-family: var(--font-mono); background: var(--bg-secondary);
          border: 1px solid var(--border-light); padding: 0.05em 0.3em;
        }
        .defs-tabs { display: flex; gap: 0.4rem; border-bottom: 1px solid var(--border); }
        .defs-tab {
          background: transparent; border: none; border-bottom: 2px solid transparent;
          padding: 0.5rem 0.2rem; margin-right: 0.9rem; cursor: pointer;
          font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.12em; color: var(--muted);
        }
        .defs-tab.is-active { color: var(--fg); border-bottom-color: var(--fg); }
        .defs-panel { display: flex; flex-direction: column; gap: 1rem; }
        .defs-list { list-style: none; margin: 0; padding: 0; }
        .defs-row {
          display: flex; align-items: center; gap: 0.75rem; padding: 0.7rem 0;
          border-bottom: 1px solid var(--border-light);
        }
        .defs-row-key {
          font-family: var(--font-mono); font-size: 0.74rem; font-weight: 700;
          color: var(--fg); width: 200px; flex-shrink: 0;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .defs-row-title {
          font-family: var(--font-heading); font-size: 0.98rem; color: var(--fg);
          flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .defs-btn {
          background: transparent; color: var(--fg); border: 1px solid var(--border);
          border-radius: 2px; padding: 0.35rem 0.7rem; font-family: var(--font-mono);
          font-size: 0.7rem; cursor: pointer; white-space: nowrap;
        }
        .defs-btn:disabled { opacity: 0.55; cursor: default; }
        .defs-btn-danger { color: var(--danger); border-color: var(--danger); }
        .defs-form {
          display: flex; flex-direction: column; gap: 0.8rem;
          border: 1px solid var(--border); border-radius: 4px;
          background: var(--bg-secondary); padding: 1.1rem 1.2rem;
        }
        .defs-form-head {
          display: flex; align-items: baseline; gap: 0.6rem;
          font-family: var(--font-mono); font-size: 0.68rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.14em; color: var(--fg);
        }
        .defs-field { display: flex; flex-direction: column; gap: 0.3rem; }
        .defs-field > span {
          font-family: var(--font-mono); font-size: 0.62rem; text-transform: uppercase;
          letter-spacing: 0.12em; color: var(--muted);
        }
        .defs-field input, .defs-field textarea {
          background: var(--bg); border: 1px solid var(--border-light); border-radius: 2px;
          padding: 0.5rem 0.6rem; color: var(--fg); font-family: var(--font-mono);
          font-size: 0.78rem; outline: none; width: 100%; resize: vertical;
        }
        .defs-field input:focus, .defs-field textarea:focus { border-color: var(--fg); }
        .defs-field input:disabled { opacity: 0.7; }
        .defs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; }
        @media (max-width: 640px) { .defs-grid { grid-template-columns: 1fr; } }
        .defs-actions { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; }
        .defs-error { font-family: var(--font-mono); font-size: 0.72rem; color: var(--danger); }
        .defs-note { font-family: var(--font-mono); font-size: 0.68rem; color: var(--muted); margin: 0; line-height: 1.6; }
        .defs-snippet {
          border: 1px solid var(--border-light); border-radius: 3px; padding: 0.8rem;
          display: flex; flex-direction: column; gap: 0.6rem; background: var(--bg);
        }
        .defs-snippet-head {
          display: flex; align-items: center; gap: 0.5rem;
          font-family: var(--font-mono); font-size: 0.66rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.12em; color: var(--fg);
        }
        .defs-snippet textarea { font-size: 0.74rem; line-height: 1.5; }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

function keyError(key: string, existing: string[], editingKey: string | null) {
  const trimmed = key.trim();
  if (!trimmed) return "A key is required.";
  if (!ANCHOR_KEY_PATTERN.test(trimmed))
    return "Keys may only contain letters, digits, _ and -.";
  if (trimmed !== editingKey && existing.includes(trimmed))
    return `The key "${trimmed}" already exists.`;
  return null;
}

function useList<T>(loader: () => Promise<T[]>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    setLoading(true);
    loader()
      .then((rows) => {
        setItems(rows);
        setError(null);
      })
      .catch((e: Error) => setError(e.message || "Could not load."))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(reload, [reload]);
  return { items, loading, error, reload, setError };
}

/* ------------------------------------------------------------------ */
/* Definitions                                                         */
/* ------------------------------------------------------------------ */

function DefinitionsPanel() {
  const { items, loading, error, reload, setError } =
    useList<BlogDefinition>(listDefinitions);
  const [editing, setEditing] = useState<BlogDefinition | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [key, setKey] = useState("");
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmKey, setConfirmKey] = useState<string | null>(null);

  const editor = useRichEditor({ content: "<p></p>" });
  const { uploading, insertImage } = useImageUpload(uploadEditorImage);

  function openNew() {
    setIsNew(true);
    setEditing(null);
    setKey("");
    setTitle("");
    setFormError(null);
    editor?.commands.setContent("<p></p>");
  }

  function openEdit(item: BlogDefinition) {
    setIsNew(false);
    setEditing(item);
    setKey(item.key);
    setTitle(item.title);
    setFormError(null);
    editor?.commands.setContent(item.contentHtml || "<p></p>");
  }

  function close() {
    setIsNew(false);
    setEditing(null);
    setFormError(null);
  }

  async function save() {
    if (!editor) return;
    const problem = keyError(
      key,
      items.map((i) => i.key),
      editing?.key ?? null
    );
    if (problem) return setFormError(problem);
    if (!title.trim()) return setFormError("A title is required.");

    setSaving(true);
    setFormError(null);
    try {
      await saveDefinition({
        key: key.trim(),
        title: title.trim(),
        contentHtml: editor.getHTML(),
      });
      close();
      reload();
    } catch (e) {
      setFormError((e as Error).message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(k: string) {
    setSaving(true);
    try {
      await deleteDefinition(k);
      setConfirmKey(null);
      if (editing?.key === k) close();
      reload();
    } catch (e) {
      setError((e as Error).message || "Failed to delete.");
      setConfirmKey(null);
    } finally {
      setSaving(false);
    }
  }

  const open = isNew || Boolean(editing);

  return (
    <div className="defs-panel">
      <div className="defs-actions">
        <AccentButton
          onClick={openNew}
          style={{
            borderRadius: 2,
            padding: "0.5rem 1rem",
            fontSize: "0.72rem",
            letterSpacing: 0,
            textTransform: "none",
          }}
        >
          + New definition
        </AccentButton>
        {error && <span className="defs-error">{error}</span>}
      </div>

      {open && (
        <div className="defs-form">
          <div className="defs-form-head">
            {editing ? `Editing ${editing.key}` : "New definition"}
          </div>
          <div className="defs-grid">
            <label className="defs-field">
              <span>Key (data-anchor-key)</span>
              <input
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="thamHutNganSach"
                disabled={Boolean(editing)}
              />
            </label>
            <label className="defs-field">
              <span>Title</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Thâm hụt ngân sách"
              />
            </label>
          </div>

          <div className="defs-field">
            <span>Sidebar content</span>
            {editor && (
              <RichTextToolbar
                editor={editor}
                uploading={uploading}
                codeBlock
                onUploadImage={() => insertImage(editor)}
              />
            )}
            <RichTextSurface
              editor={editor}
              placeholder="Explain the term…"
              minHeight={200}
            />
          </div>

          <div className="defs-actions">
            {formError && <span className="defs-error">{formError}</span>}
            <span style={{ flex: 1 }} />
            <button className="defs-btn" onClick={close} disabled={saving}>
              Cancel
            </button>
            <AccentButton
              onClick={save}
              disabled={saving}
              style={{
                borderRadius: 2,
                padding: "0.5rem 1rem",
                fontSize: "0.72rem",
                letterSpacing: 0,
                textTransform: "none",
              }}
            >
              {saving ? "Saving…" : editing ? "Save changes" : "Create"}
            </AccentButton>
          </div>
        </div>
      )}

      {loading ? (
        <p className="defs-note">Loading definitions…</p>
      ) : items.length === 0 ? (
        <p className="defs-note">
          No definitions yet. Create one so the editor has something to link to.
        </p>
      ) : (
        <ul className="defs-list">
          {items.map((d) => (
            <li key={d.key} className="defs-row">
              <span className="defs-row-key">{d.key}</span>
              <span className="defs-row-title">{d.title}</span>
              <button className="defs-btn" onClick={() => openEdit(d)}>
                Edit
              </button>
              <button
                className="defs-btn defs-btn-danger"
                onClick={() => setConfirmKey(d.key)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={confirmKey !== null}
        title="Delete definition"
        message={`Delete "${confirmKey}"? Posts that anchor to this key will lose their sidebar content.`}
        busy={saving}
        onConfirm={() => confirmKey && remove(confirmKey)}
        onCancel={() => setConfirmKey(null)}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Code examples                                                       */
/* ------------------------------------------------------------------ */

function SnippetFields({
  label,
  value,
  onChange,
}: {
  label: string;
  value: CodeSnippet | null;
  onChange: (next: CodeSnippet | null) => void;
}) {
  return (
    <div className="defs-snippet">
      <label className="defs-snippet-head">
        <input
          type="checkbox"
          checked={value !== null}
          onChange={(e) => onChange(e.target.checked ? { ...EMPTY_SNIPPET } : null)}
        />
        {label}
      </label>
      {value && (
        <>
          <label className="defs-field">
            <span>Language</span>
            <input
              value={value.language}
              onChange={(e) => onChange({ ...value, language: e.target.value })}
              placeholder="tsx"
            />
          </label>
          <label className="defs-field">
            <span>Code</span>
            <textarea
              value={value.code}
              onChange={(e) => onChange({ ...value, code: e.target.value })}
              rows={8}
              spellCheck={false}
            />
          </label>
          <label className="defs-field">
            <span>Explanation</span>
            <textarea
              value={value.explanation}
              onChange={(e) =>
                onChange({ ...value, explanation: e.target.value })
              }
              rows={3}
            />
          </label>
        </>
      )}
    </div>
  );
}

function CodeExamplesPanel() {
  const { items, loading, error, reload, setError } =
    useList<BlogCodeExample>(listCodeExamples);
  const [editing, setEditing] = useState<BlogCodeExample | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [key, setKey] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [wrongCode, setWrongCode] = useState<CodeSnippet | null>(null);
  const [correctCode, setCorrectCode] = useState<CodeSnippet | null>(null);
  const [alternativeCode, setAlternativeCode] = useState<CodeSnippet | null>(
    null
  );
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmKey, setConfirmKey] = useState<string | null>(null);

  function reset(item: BlogCodeExample | null) {
    setKey(item?.key ?? "");
    setTitle(item?.title ?? "");
    setDescription(item?.description ?? "");
    setWrongCode(item?.wrongCode ?? null);
    setCorrectCode(item?.correctCode ?? { ...EMPTY_SNIPPET });
    setAlternativeCode(item?.alternativeCode ?? null);
    setFormError(null);
  }

  function openNew() {
    setIsNew(true);
    setEditing(null);
    reset(null);
  }

  function openEdit(item: BlogCodeExample) {
    setIsNew(false);
    setEditing(item);
    reset(item);
  }

  function close() {
    setIsNew(false);
    setEditing(null);
    setFormError(null);
  }

  async function save() {
    const problem = keyError(
      key,
      items.map((i) => i.key),
      editing?.key ?? null
    );
    if (problem) return setFormError(problem);
    if (!title.trim()) return setFormError("A title is required.");
    if (!wrongCode && !correctCode && !alternativeCode)
      return setFormError("Add at least one code block.");

    setSaving(true);
    setFormError(null);
    try {
      await saveCodeExample({
        key: key.trim(),
        title: title.trim(),
        description: description.trim(),
        wrongCode,
        correctCode,
        alternativeCode,
      });
      close();
      reload();
    } catch (e) {
      setFormError((e as Error).message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(k: string) {
    setSaving(true);
    try {
      await deleteCodeExample(k);
      setConfirmKey(null);
      if (editing?.key === k) close();
      reload();
    } catch (e) {
      setError((e as Error).message || "Failed to delete.");
      setConfirmKey(null);
    } finally {
      setSaving(false);
    }
  }

  const open = isNew || Boolean(editing);

  return (
    <div className="defs-panel">
      <div className="defs-actions">
        <AccentButton
          onClick={openNew}
          style={{
            borderRadius: 2,
            padding: "0.5rem 1rem",
            fontSize: "0.72rem",
            letterSpacing: 0,
            textTransform: "none",
          }}
        >
          + New code example
        </AccentButton>
        {error && <span className="defs-error">{error}</span>}
      </div>

      {open && (
        <div className="defs-form">
          <div className="defs-form-head">
            {editing ? `Editing ${editing.key}` : "New code example"}
          </div>
          <div className="defs-grid">
            <label className="defs-field">
              <span>Key (data-anchor-key)</span>
              <input
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="useMemoExample"
                disabled={Boolean(editing)}
              />
            </label>
            <label className="defs-field">
              <span>Title</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Memoising an expensive value"
              />
            </label>
          </div>
          <label className="defs-field">
            <span>Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </label>

          <SnippetFields
            label="Wrong code"
            value={wrongCode}
            onChange={setWrongCode}
          />
          <SnippetFields
            label="Correct code"
            value={correctCode}
            onChange={setCorrectCode}
          />
          <SnippetFields
            label="Alternative code"
            value={alternativeCode}
            onChange={setAlternativeCode}
          />

          <div className="defs-actions">
            {formError && <span className="defs-error">{formError}</span>}
            <span style={{ flex: 1 }} />
            <button className="defs-btn" onClick={close} disabled={saving}>
              Cancel
            </button>
            <AccentButton
              onClick={save}
              disabled={saving}
              style={{
                borderRadius: 2,
                padding: "0.5rem 1rem",
                fontSize: "0.72rem",
                letterSpacing: 0,
                textTransform: "none",
              }}
            >
              {saving ? "Saving…" : editing ? "Save changes" : "Create"}
            </AccentButton>
          </div>
        </div>
      )}

      {loading ? (
        <p className="defs-note">Loading code examples…</p>
      ) : items.length === 0 ? (
        <p className="defs-note">No code examples yet.</p>
      ) : (
        <ul className="defs-list">
          {items.map((c) => (
            <li key={c.key} className="defs-row">
              <span className="defs-row-key">{c.key}</span>
              <span className="defs-row-title">{c.title}</span>
              <button className="defs-btn" onClick={() => openEdit(c)}>
                Edit
              </button>
              <button
                className="defs-btn defs-btn-danger"
                onClick={() => setConfirmKey(c.key)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={confirmKey !== null}
        title="Delete code example"
        message={`Delete "${confirmKey}"? Posts that anchor to this key will lose their sidebar content.`}
        busy={saving}
        onConfirm={() => confirmKey && remove(confirmKey)}
        onCancel={() => setConfirmKey(null)}
      />
    </div>
  );
}

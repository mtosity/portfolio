"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Editor } from "@tiptap/react";
import { toolbarButtonStyle } from "../RichTextEditor";
import {
  ANCHOR_KEY_PATTERN,
  activeAnchor,
  insertAnchor,
  removeAnchor,
  selectedText,
  type AnchorType,
} from "./anchorNodes";
import {
  listAnchorSources,
  type BlogCodeExample,
  type BlogDefinition,
} from "./blogApi";

/* ------------------------------------------------------------------ */
/* Source data                                                         */
/* ------------------------------------------------------------------ */

export interface AnchorSource {
  key: string;
  title: string;
  subtitle: string;
}

export interface AnchorSources {
  definition: AnchorSource[];
  code: AnchorSource[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/** Loads the pickable definition / code-example keys. */
export function useAnchorSources(): AnchorSources {
  const [definition, setDefinition] = useState<AnchorSource[]>([]);
  const [code, setCode] = useState<AnchorSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    listAnchorSources()
      .then(({ definitions: defs, codeExamples: codes }) => {
        setDefinition(
          defs.map((d: BlogDefinition) => ({
            key: d.key,
            title: d.title,
            subtitle: stripHtml(d.contentHtml),
          }))
        );
        setCode(
          codes.map((c: BlogCodeExample) => ({
            key: c.key,
            title: c.title,
            subtitle: c.description ?? "",
          }))
        );
      })
      .catch((e: Error) =>
        setError(e.message || "Could not load anchor sources.")
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(reload, [reload]);

  return { definition, code, loading, error, reload };
}

function stripHtml(html: string | undefined): string {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* ------------------------------------------------------------------ */
/* Toolbar controls                                                    */
/* ------------------------------------------------------------------ */

const LABEL: Record<AnchorType, string> = {
  definition: "Definition",
  code: "Code",
};

export function AnchorToolbarControls({
  editor,
  sources,
}: {
  editor: Editor;
  sources: AnchorSources;
}) {
  const [picking, setPicking] = useState<AnchorType | null>(null);
  const current = activeAnchor(editor);

  return (
    <>
      <span className="anchor-toolbar-sep" />
      <button
        style={{
          ...toolbarButtonStyle(current?.type === "definition"),
          color:
            current?.type === "definition" ? "var(--bg)" : "var(--anchor-blue)",
        }}
        onClick={() => setPicking("definition")}
        title="Wrap the selection in a definition anchor"
      >
        ⓘ Definition
      </button>
      <button
        style={{
          ...toolbarButtonStyle(current?.type === "code"),
          color: current?.type === "code" ? "var(--bg)" : "var(--anchor-purple)",
        }}
        onClick={() => setPicking("code")}
        title="Wrap the selection in a code-example anchor"
      >
        {"</>"} Code
      </button>
      {current && (
        <button
          style={toolbarButtonStyle(false)}
          onClick={() => removeAnchor(editor)}
          title="Unwrap the anchor under the caret"
        >
          ✕ Anchor
        </button>
      )}

      {picking && (
        <AnchorPickerDialog
          editor={editor}
          type={picking}
          sources={sources}
          onClose={() => setPicking(null)}
        />
      )}

      <style>{`
        .anchor-toolbar-sep {
          width: 1px; align-self: stretch; background: var(--border-light); margin: 0 0.15rem;
        }
        :root { --anchor-blue: #1d4ed8; --anchor-purple: #7e22ce; }
        [data-theme="dark"] { --anchor-blue: #93c5fd; --anchor-purple: #d8b4fe; }
      `}</style>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Picker dialog                                                       */
/* ------------------------------------------------------------------ */

function AnchorPickerDialog({
  editor,
  type,
  sources,
  onClose,
}: {
  editor: Editor;
  type: AnchorType;
  sources: AnchorSources;
  onClose: () => void;
}) {
  const current = activeAnchor(editor);
  const [query, setQuery] = useState("");
  const [label, setLabel] = useState(
    () => current?.text ?? selectedText(editor)
  );
  const [manualKey, setManualKey] = useState("");

  const options = type === "definition" ? sources.definition : sources.code;
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) =>
        o.key.toLowerCase().includes(q) || o.title.toLowerCase().includes(q)
    );
  }, [options, query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const canInsert = Boolean(label.trim());

  function choose(key: string) {
    if (!key) return;
    if (!ANCHOR_KEY_PATTERN.test(key)) return;
    insertAnchor(editor, type, key, label);
    onClose();
  }

  const manageHref =
    type === "definition"
      ? "/admin/blog/definitions"
      : "/admin/blog/definitions?tab=code";

  return (
    <div className="anchor-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="anchor-card" onClick={(e) => e.stopPropagation()}>
        <h3 className="anchor-title">
          {current ? `Change ${LABEL[type].toLowerCase()} anchor` : `Insert ${LABEL[type].toLowerCase()} anchor`}
        </h3>

        <label className="anchor-field">
          <span>Label shown in the post</span>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Select text first, or type it here"
            autoFocus={!label}
          />
        </label>

        <label className="anchor-field">
          <span>Search {type === "definition" ? "definitions" : "code examples"}</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by key or title…"
            autoFocus={Boolean(label)}
          />
        </label>

        {sources.loading && <p className="anchor-note">Loading keys…</p>}
        {sources.error && (
          <p className="anchor-note anchor-error">
            {sources.error}{" "}
            <button className="anchor-linkish" onClick={sources.reload}>
              Retry
            </button>
          </p>
        )}

        {!sources.loading && !sources.error && filtered.length === 0 && (
          <p className="anchor-note">
            No {type === "definition" ? "definitions" : "code examples"} yet.{" "}
            <Link href={manageHref} className="anchor-linkish">
              Create one →
            </Link>
          </p>
        )}

        <ul className="anchor-list">
          {filtered.map((o) => (
            <li key={o.key}>
              <button
                className={`anchor-option${current?.key === o.key ? " is-current" : ""}`}
                onClick={() => choose(o.key)}
                disabled={!canInsert}
              >
                <span className="anchor-option-key">{o.key}</span>
                <span className="anchor-option-title">{o.title}</span>
                {o.subtitle && (
                  <span className="anchor-option-sub">{o.subtitle}</span>
                )}
              </button>
            </li>
          ))}
        </ul>

        <details className="anchor-manual">
          <summary>Use a key that isn&apos;t listed</summary>
          <div className="anchor-manual-row">
            <input
              value={manualKey}
              onChange={(e) => setManualKey(e.target.value)}
              placeholder="staticFileKey"
            />
            <button
              className="anchor-primary"
              onClick={() => choose(manualKey.trim())}
              disabled={
                !canInsert || !ANCHOR_KEY_PATTERN.test(manualKey.trim())
              }
            >
              Insert
            </button>
          </div>
          <p className="anchor-note">
            Keys from the legacy static definitions file also resolve. Allowed
            characters: letters, digits, <code>_</code> and <code>-</code>.
          </p>
        </details>

        <div className="anchor-actions">
          <Link href={manageHref} className="anchor-linkish">
            Manage {type === "definition" ? "definitions" : "code examples"} ↗
          </Link>
          <span style={{ flex: 1 }} />
          {current && (
            <button
              className="anchor-secondary"
              onClick={() => {
                removeAnchor(editor);
                onClose();
              }}
            >
              Remove anchor
            </button>
          )}
          <button className="anchor-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>

      <style>{`
        .anchor-backdrop {
          position: fixed; inset: 0; z-index: 2000;
          background: rgba(13,13,13,0.55); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center; padding: 1.5rem;
        }
        .anchor-card {
          width: 100%; max-width: 520px; max-height: 85vh; overflow-y: auto;
          background: var(--bg); border: 1px solid var(--border); border-radius: 4px;
          box-shadow: 8px 12px 40px rgba(0,0,0,0.3); padding: 1.5rem;
          display: flex; flex-direction: column; gap: 0.85rem;
        }
        .anchor-title {
          font-family: var(--font-heading); font-size: 1.25rem; font-weight: 600;
          margin: 0; color: var(--fg);
        }
        .anchor-field { display: flex; flex-direction: column; gap: 0.3rem; }
        .anchor-field > span {
          font-family: var(--font-mono); font-size: 0.64rem; text-transform: uppercase;
          letter-spacing: 0.12em; color: var(--muted);
        }
        .anchor-field input, .anchor-manual-row input {
          background: var(--bg-secondary); border: 1px solid var(--border-light);
          border-radius: 2px; padding: 0.5rem 0.6rem; color: var(--fg);
          font-family: var(--font-mono); font-size: 0.8rem; outline: none; width: 100%;
        }
        .anchor-field input:focus, .anchor-manual-row input:focus { border-color: var(--fg); }
        .anchor-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.3rem; }
        .anchor-option {
          width: 100%; text-align: left; cursor: pointer;
          background: var(--bg-secondary); border: 1px solid var(--border-light);
          border-radius: 3px; padding: 0.55rem 0.7rem; color: var(--fg);
          display: flex; flex-direction: column; gap: 0.15rem;
        }
        .anchor-option:hover:not(:disabled) { border-color: var(--fg); }
        .anchor-option:disabled { opacity: 0.5; cursor: not-allowed; }
        .anchor-option.is-current { border-color: var(--fg); }
        .anchor-option-key {
          font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700;
        }
        .anchor-option-title { font-family: var(--font-heading); font-size: 0.9rem; }
        .anchor-option-sub {
          font-family: var(--font-mono); font-size: 0.66rem; color: var(--muted);
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .anchor-note {
          font-family: var(--font-mono); font-size: 0.7rem; color: var(--muted);
          line-height: 1.6; margin: 0;
        }
        .anchor-error { color: var(--danger); }
        .anchor-manual { border-top: 1px solid var(--border-light); padding-top: 0.6rem; }
        .anchor-manual summary {
          font-family: var(--font-mono); font-size: 0.7rem; color: var(--muted); cursor: pointer;
        }
        .anchor-manual-row { display: flex; gap: 0.4rem; margin: 0.5rem 0 0.4rem; }
        .anchor-actions { display: flex; align-items: center; gap: 0.5rem; }
        .anchor-primary {
          background: var(--fg); color: var(--bg); border: 1px solid var(--fg);
          border-radius: 2px; padding: 0.5rem 0.8rem; font-family: var(--font-mono);
          font-size: 0.72rem; cursor: pointer; white-space: nowrap;
        }
        .anchor-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .anchor-secondary {
          background: transparent; color: var(--fg); border: 1px solid var(--border-light);
          border-radius: 2px; padding: 0.45rem 0.8rem; font-family: var(--font-mono);
          font-size: 0.72rem; cursor: pointer;
        }
        .anchor-linkish {
          background: none; border: none; padding: 0; cursor: pointer;
          font-family: var(--font-mono); font-size: 0.7rem; color: var(--fg);
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}

"use client";

import { SlideTabs } from "@/components/SlideTabs";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Note {
  id: string;
  url: string;
  title: string;
  content_html: string;
  date_modified: string;
}

interface Feed {
  title: string;
  description: string;
  items: Note[];
}

const LEAFLET_BASE = "https://mtosity.leaflet.pub";

// ─── Sticky-note palette ───────────────────────────────────
const STICKY_COLORS = [
  { bg: "#fff9c4", border: "#f9e44c" }, // yellow
  { bg: "#f8bbd0", border: "#e57fa2" }, // pink
  { bg: "#bbdefb", border: "#7eb8e4" }, // blue
  { bg: "#c8e6c9", border: "#81c784" }, // green
  { bg: "#e1bee7", border: "#ba8ec4" }, // lavender
  { bg: "#ffe0b2", border: "#e6a95c" }, // peach
  { bg: "#b2ebf2", border: "#6cc9d6" }, // cyan
  { bg: "#d1c4e9", border: "#9e8ec4" }, // purple
];

// Deterministic pseudo-random rotation per index
function getRotation(index: number): number {
  const seed = ((index * 7 + 3) % 13) - 6; // range roughly -6..6
  return seed * 0.5; // ±3°
}

function getColor(index: number) {
  return STICKY_COLORS[index % STICKY_COLORS.length];
}

// ─── Helpers ───────────────────────────────────────────────

function formatDate(iso: string) {
  const d = new Date(iso);
  return d
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
}

function cleanNoteHtml(html: string): string {
  if (typeof window === "undefined") return html;
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.querySelectorAll("script").forEach((s) => s.remove());
  doc.querySelectorAll<HTMLImageElement>("img").forEach((img) => {
    if (img.src.startsWith(window.location.origin + "/api/")) {
      img.src = LEAFLET_BASE + img.getAttribute("src")!;
    }
  });
  doc.querySelectorAll<HTMLAnchorElement>("a[href^='/']").forEach((a) => {
    a.href = LEAFLET_BASE + a.getAttribute("href")!;
  });
  doc.querySelectorAll<HTMLElement>("blockquote.instagram-media").forEach((bq) => {
    const href =
      bq.getAttribute("data-instgrm-permalink")?.split("?")[0] ||
      bq.querySelector("a")?.getAttribute("href") ||
      "#";
    const a = doc.createElement("a");
    a.href = href;
    a.textContent = "View on Instagram ↗";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    bq.replaceWith(a);
  });
  return doc.body.innerHTML;
}

function getPlainPreview(html: string, max = 120): string {
  if (typeof window === "undefined") return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  const text = doc.body.textContent || "";
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}

// ─── StickyNote ────────────────────────────────────────────

function StickyNote({
  note,
  index,
  onClick,
}: {
  note: Note;
  index: number;
  onClick: () => void;
}) {
  const color = getColor(index);
  const rotation = getRotation(index);

  return (
    <motion.button
      className="sticky-note"
      onClick={onClick}
      style={{
        ["--note-bg" as string]: color.bg,
        ["--note-border" as string]: color.border,
        ["--note-rotation" as string]: `${rotation}deg`,
      }}
      initial={{ opacity: 0, y: 30, rotate: rotation }}
      animate={{ opacity: 1, y: 0, rotate: rotation }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.6) }}
      whileHover={{
        scale: 1.04,
        rotate: 0,
        y: -6,
        boxShadow: "0 12px 32px rgba(0,0,0,0.18)",
        transition: { duration: 0.2 },
      }}
    >
      {/* Tape decoration */}
      <span className="sticky-tape" />

      <span className="sticky-date">{formatDate(note.date_modified)}</span>
      <span className="sticky-title">{note.title}</span>
      <span className="sticky-preview">{getPlainPreview(note.content_html)}</span>
    </motion.button>
  );
}

// ─── NoteModal ─────────────────────────────────────────────

function NoteModal({ note, onClose }: { note: Note; onClose: () => void }) {
  // close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <motion.div
      className="note-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className="note-modal-card"
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 30 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="note-modal-close" onClick={onClose}>
          ✕
        </button>
        <span className="note-modal-date">{formatDate(note.date_modified)}</span>
        <h2 className="note-modal-title">{note.title}</h2>
        <div
          className="note-content"
          dangerouslySetInnerHTML={{ __html: cleanNoteHtml(note.content_html) }}
        />
        <Link
          href={note.url}
          target="_blank"
          rel="noopener noreferrer"
          className="note-modal-link"
        >
          Read on Leaflet ↗
        </Link>
      </motion.div>
    </motion.div>
  );
}

// ─── Loading placeholders ──────────────────────────────────

function LoadingBoard() {
  return (
    <div className="board-grid">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="sticky-note sticky-note--placeholder"
          style={{
            ["--note-bg" as string]: getColor(i).bg,
            ["--note-rotation" as string]: `${getRotation(i)}deg`,
            opacity: 0.5,
          }}
        >
          <div
            style={{
              height: "0.6rem",
              width: "60%",
              background: "rgba(0,0,0,0.08)",
              borderRadius: 3,
              marginBottom: "0.75rem",
            }}
          />
          <div
            style={{
              height: "1rem",
              width: "80%",
              background: "rgba(0,0,0,0.1)",
              borderRadius: 3,
              marginBottom: "0.5rem",
            }}
          />
          <div
            style={{
              height: "0.7rem",
              width: "90%",
              background: "rgba(0,0,0,0.06)",
              borderRadius: 3,
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────

export default function Notes() {
  const [feed, setFeed] = useState<Feed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState<Note | null>(null);

  const closeModal = useCallback(() => setSelected(null), []);

  useEffect(() => {
    fetch("/api/notes")
      .then((r) => r.json())
      .then((data) => {
        setFeed(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  return (
    <div className="notes-page">
      <SlideTabs />

      {/* Board header */}
      <div className="board-header">
        <div className="board-header-label">
          <span className="board-header-num">06 —</span>
          <span className="board-header-title">NOTES</span>
        </div>
        <p className="board-header-desc">
          What you see here is only between us. My thoughts will change over
          time, so don&apos;t map these notes to my personality.
        </p>
      </div>

      {/* Board area */}
      <div className="board-area">
        {loading && <LoadingBoard />}

        {error && (
          <p className="board-error">
            Failed to load notes.{" "}
            <Link
              href="https://mtosity.leaflet.pub"
              target="_blank"
              style={{
                color: "var(--fg)",
                borderBottom: "1px solid var(--border-light)",
              }}
            >
              Read on Leaflet ↗
            </Link>
          </p>
        )}

        {!loading && !error && feed && (
          <div className="board-grid">
            {feed.items.map((note, idx) => (
              <StickyNote
                key={note.id}
                note={note}
                index={idx}
                onClick={() => setSelected(note)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && <NoteModal note={selected} onClose={closeModal} />}
      </AnimatePresence>

      {/* ─── Styles ────────────────────────────────────────── */}
      <style>{`
        .notes-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 20% 35%, rgba(190, 242, 100, 0.07) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(190, 170, 255, 0.06) 0%, transparent 50%),
            var(--bg);
          color: var(--fg);
        }

        /* ── Header ── */
        .board-header {
          margin-top: 56px;
          padding: 2.5rem clamp(1.5rem, 5vw, 4rem) 1.5rem;
        }
        .board-header-label {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }
        .board-header-num {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .board-header-title {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--fg);
        }
        .board-header-desc {
          font-family: var(--font-mono);
          font-size: 0.8125rem;
          letter-spacing: 0.03em;
          color: var(--muted);
          max-width: 480px;
        }

        /* ── Board ── */
        .board-area {
          padding: 1rem clamp(1rem, 4vw, 3rem) 6rem;
        }
        .board-grid {
          columns: 4;
          column-gap: 1.25rem;
        }
        @media (max-width: 1200px) { .board-grid { columns: 3; } }
        @media (max-width: 800px)  { .board-grid { columns: 2; } }
        @media (max-width: 480px)  { .board-grid { columns: 1; } }

        .board-error {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--muted);
          padding: 4rem 0;
        }

        /* ── Sticky note ── */
        .sticky-note {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          width: 100%;
          break-inside: avoid;
          margin-bottom: 1.25rem;
          padding: 1.5rem 1.4rem 1.3rem;
          background: var(--note-bg);
          border: none;
          border-left: 3px solid var(--note-border, #ccc);
          border-radius: 2px;
          box-shadow: 2px 3px 12px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06);
          cursor: pointer;
          position: relative;
          transform: rotate(var(--note-rotation, 0deg));
          transition: box-shadow 0.2s ease;
          font-family: inherit;
        }
        .sticky-note:focus-visible {
          outline: 2px solid var(--fg);
          outline-offset: 2px;
        }

        /* Tape strip */
        .sticky-tape {
          position: absolute;
          top: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 12px;
          background: rgba(255,255,255,0.55);
          border-radius: 1px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.06);
          pointer-events: none;
        }

        .sticky-date {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.4);
          margin-bottom: 0.5rem;
        }
        .sticky-title {
          font-family: var(--font-crimson-text), Georgia, serif;
          font-size: 1.1rem;
          font-weight: 600;
          line-height: 1.35;
          color: rgba(0,0,0,0.82);
          margin-bottom: 0.4rem;
        }
        .sticky-preview {
          font-size: 0.78rem;
          line-height: 1.55;
          color: rgba(0,0,0,0.5);
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .sticky-note--placeholder {
          min-height: 100px;
          cursor: default;
          animation: pulse-placeholder 1.6s ease-in-out infinite;
        }
        @keyframes pulse-placeholder {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.6; }
        }

        /* ── Modal ── */
        .note-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .note-modal-card {
          position: relative;
          background: var(--bg);
          border: 1px solid var(--border-light);
          border-radius: 4px;
          padding: 2.5rem 2.5rem 2rem;
          max-width: 640px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 24px 64px rgba(0,0,0,0.2);
        }
        .note-modal-close {
          position: absolute;
          top: 1rem;
          right: 1.25rem;
          background: none;
          border: none;
          font-size: 1.1rem;
          cursor: pointer;
          color: var(--muted);
          padding: 0.25rem;
          line-height: 1;
          transition: color 0.15s;
        }
        .note-modal-close:hover { color: var(--fg); }
        .note-modal-date {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .note-modal-title {
          font-family: var(--font-crimson-text), Georgia, serif;
          font-size: 1.6rem;
          font-weight: 600;
          line-height: 1.3;
          color: var(--fg);
          margin: 0.4rem 0 1.25rem;
        }
        .note-modal-link {
          display: inline-block;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--fg);
          text-decoration: none;
          border-bottom: 1px solid var(--border-light);
          padding-bottom: 1px;
          margin-top: 1.5rem;
        }
        .note-modal-link:hover {
          border-bottom-color: var(--fg);
        }

        /* ── Note content (shared) ── */
        .note-content p { margin-bottom: 1em; }
        .note-content p:last-child { margin-bottom: 0; }
        .note-content s { opacity: 0.5; }
        .note-content a { color: var(--fg); border-bottom: 1px solid var(--border-light); text-decoration: none; }
        .note-content strong { color: var(--fg); font-weight: 600; }
        .note-content em { font-style: italic; }
        .note-content h1, .note-content h2, .note-content h3 {
          font-family: var(--font-crimson-text), Georgia, serif;
          color: var(--fg);
          margin: 1.25em 0 0.5em;
        }
        .note-content blockquote.instagram-media { display: none; }
        .note-content img { max-width: 100%; height: auto; display: block; margin: 1em 0; border: 1px solid var(--border-light); border-radius: 2px; }
        .note-content {
          font-size: 1rem;
          line-height: 1.75;
          color: var(--muted);
        }
      `}</style>
    </div>
  );
}

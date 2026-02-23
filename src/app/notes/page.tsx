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

const INSTAGRAM_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="flex-shrink:0;vertical-align:-1px"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`;
const TIKTOK_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="flex-shrink:0;vertical-align:-1px"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/></svg>`;

function socialLinkHtml(iconSvg: string, title: string): string {
  return `${iconSvg}<span>${title} ↗</span>`;
}

function extractCaption(el: Element, platform: string): string {
  const h3Text = el.querySelector("h3")?.textContent || "";
  const match = h3Text.match(new RegExp(`on ${platform}:\\s*[""""]\\s*(.+)`, "i"));
  const caption = match ? match[1].replace(/[""""]/g, "").trim() : "";
  return caption.length > 60 ? caption.slice(0, 57) + "…" : caption;
}

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
  doc.querySelectorAll<HTMLElement>("span.line-through, span[class*='line-through']").forEach((span) => {
    const s = doc.createElement("s");
    s.innerHTML = span.innerHTML;
    span.replaceWith(s);
  });
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
    a.className = "social-embed-link";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.innerHTML = socialLinkHtml(INSTAGRAM_ICON_SVG, "Instagram");
    bq.replaceWith(a);
  });
  doc.querySelectorAll<HTMLAnchorElement>("a[href*='instagram.com']").forEach((a) => {
    const href = a.getAttribute("href") || "#";
    const caption = extractCaption(a, "Instagram");
    a.className = "social-embed-link";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.innerHTML = socialLinkHtml(INSTAGRAM_ICON_SVG, caption || "Instagram");
    a.href = href;
  });
  doc.querySelectorAll<HTMLElement>("blockquote.tiktok-embed").forEach((bq) => {
    const href = bq.getAttribute("cite") || bq.querySelector("a")?.getAttribute("href") || "#";
    const a = doc.createElement("a");
    a.href = href;
    a.className = "social-embed-link";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.innerHTML = socialLinkHtml(TIKTOK_ICON_SVG, "TikTok");
    bq.replaceWith(a);
  });
  doc.querySelectorAll<HTMLAnchorElement>("a[href*='tiktok.com']").forEach((a) => {
    const href = a.getAttribute("href") || "#";
    const caption = extractCaption(a, "TikTok");
    a.className = "social-embed-link";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.innerHTML = socialLinkHtml(TIKTOK_ICON_SVG, caption || "TikTok");
    a.href = href;
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

function NoteModal({
  note,
  index,
  notes,
  onClose,
  onNavigate,
}: {
  note: Note;
  index: number;
  notes: Note[];
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const color = getColor(index);
  const srcRotation = getRotation(index);
  const prevNote = notes[index - 1] ?? null;
  const nextNote = notes[index + 1] ?? null;

  // close on Escape, navigate on arrow keys
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && prevNote) onNavigate(index - 1);
      if (e.key === "ArrowRight" && nextNote) onNavigate(index + 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onNavigate, index, prevNote, nextNote]);

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
        style={{
          backgroundColor: color.bg,
          borderLeftColor: color.border,
        }}
        initial={{ opacity: 0, scale: 0.25, y: -80, rotate: srcRotation * 3 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
        exit={{ opacity: 0, scale: 0.75, y: 24, transition: { duration: 0.15, ease: "easeIn" } }}
        transition={{
          type: "spring",
          stiffness: 320,
          damping: 26,
          mass: 0.85,
          opacity: { duration: 0.12 },
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Adhesive strip at top */}
        <div className="note-modal-strip" style={{ background: `color-mix(in srgb, ${color.bg} 60%, #0005 40%)` }}>
          <span className="sticky-tape" style={{ top: "50%", transform: "translateX(-50%) translateY(-50%)" }} />
        </div>

        <button className="note-modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        {/* Scrollable inner body */}
        <div className="note-modal-inner">
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
        </div>

        {/* Prev / Next navigation */}
        <div className="note-modal-nav">
          <button
            className="note-modal-nav-btn"
            onClick={() => onNavigate(index - 1)}
            disabled={!prevNote}
            aria-label="Previous note"
          >
            ← {prevNote ? prevNote.title : ""}
          </button>
          <button
            className="note-modal-nav-btn note-modal-nav-btn--next"
            onClick={() => onNavigate(index + 1)}
            disabled={!nextNote}
            aria-label="Next note"
          >
            {nextNote ? nextNote.title : ""} →
          </button>
        </div>

        {/* Folded corner */}
        <div className="note-modal-fold" />
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
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const getNoteSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // remove special chars
      .replace(/\s+/g, "-") // spaces to dashes
      .replace(/-+/g, "-"); // remove consecutive dashes
  };

  const closeModal = useCallback(() => {
    setSelected(null);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("note");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  const openModal = useCallback((note: Note, index: number) => {
    setSelected(note);
    setSelectedIndex(index);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("note", getNoteSlug(note.title));
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  useEffect(() => {
    fetch("/api/notes")
      .then((r) => r.json())
      .then((data: Feed) => {
        setFeed(data);
        setLoading(false);
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          const noteId = params.get("note");
          if (noteId) {
            const foundIndex = data.items.findIndex(n => getNoteSlug(n.title) === noteId || getNoteSlug(n.id) === noteId || n.id === noteId);
            if (foundIndex !== -1) { setSelected(data.items[foundIndex]); setSelectedIndex(foundIndex); }
          }
        }
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
          Etching small truths into the world — a quiet legacy, one note at a time
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
                onClick={() => openModal(note, idx)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence mode="wait">
        {selected && (
          <NoteModal
            key={selected.id}
            note={selected}
            index={selectedIndex}
            notes={feed?.items ?? []}
            onClose={closeModal}
            onNavigate={(i) => openModal((feed?.items ?? [])[i], i)}
          />
        )}
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
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
          align-items: start;
        }
        @media (max-width: 1200px) { .board-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 800px)  { .board-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px)  { .board-grid { grid-template-columns: 1fr; } }

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
          background: rgba(13,13,13,0.55);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .note-modal-card {
          position: relative;
          border-left: 5px solid;
          border-radius: 1px;
          max-width: 620px;
          width: 100%;
          max-height: 84vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow:
            8px 16px 48px rgba(0,0,0,0.32),
            2px 4px 12px rgba(0,0,0,0.14),
            inset 0 0 0 1px rgba(255,255,255,0.35);
          transform-origin: top center;
        }

        /* Adhesive / "sticky" strip at the top */
        .note-modal-strip {
          height: 32px;
          flex-shrink: 0;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Scrollable content area with ruled lines */
        .note-modal-inner {
          flex: 1;
          overflow-y: auto;
          padding: 1.4rem 2.2rem 2.2rem 2.2rem;
          background-image: repeating-linear-gradient(
            transparent 0px,
            transparent 27px,
            rgba(0,0,0,0.06) 27px,
            rgba(0,0,0,0.06) 28px
          );
          background-size: 100% 28px;
          background-position: 0 14px;
          scrollbar-width: thin;
          scrollbar-color: rgba(0,0,0,0.2) transparent;
        }

        /* Nav footer */
        .note-modal-nav {
          display: flex;
          justify-content: space-between;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-top: 1px solid rgba(0,0,0,0.08);
          flex-shrink: 0;
        }
        .note-modal-nav-btn {
          background: none;
          border: none;
          font-family: var(--font-mono);
          font-size: 0.6rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.4);
          cursor: pointer;
          padding: 0.25rem 0;
          max-width: 45%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          transition: color 0.15s;
        }
        .note-modal-nav-btn--next { text-align: right; }
        .note-modal-nav-btn:hover:not(:disabled) { color: rgba(0,0,0,0.8); }
        .note-modal-nav-btn:disabled { opacity: 0.25; cursor: default; }

        /* Folded corner */
        .note-modal-fold {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 38px;
          height: 38px;
          background: linear-gradient(
            225deg,
            rgba(0,0,0,0.22) 0%,
            rgba(0,0,0,0.22) 50%,
            rgba(0,0,0,0.04) 50%
          );
          pointer-events: none;
        }

        .note-modal-close {
          position: absolute;
          top: 0.5rem;
          right: 0.9rem;
          background: none;
          border: none;
          font-size: 1rem;
          cursor: pointer;
          color: rgba(0,0,0,0.45);
          padding: 0.3rem;
          line-height: 1;
          transition: color 0.15s;
          z-index: 2;
        }
        .note-modal-close:hover { color: rgba(0,0,0,0.8); }

        .note-modal-date {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.62rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.4);
          margin-bottom: 0.5rem;
        }
        .note-modal-title {
          font-family: var(--font-crimson-text), Georgia, serif;
          font-size: 1.75rem;
          font-weight: 600;
          line-height: 1.25;
          color: rgba(0,0,0,0.85);
          margin: 0 0 1.1rem;
        }
        .note-modal-link {
          display: inline-block;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.6);
          text-decoration: none;
          border-bottom: 1px solid rgba(0,0,0,0.2);
          padding-bottom: 1px;
          margin-top: 1.75rem;
          transition: color 0.15s, border-color 0.15s;
        }
        .note-modal-link:hover {
          color: rgba(0,0,0,0.9);
          border-bottom-color: rgba(0,0,0,0.6);
        }

        /* ── Note content ── */
        .note-content {
          font-size: 0.975rem;
          line-height: 1.78;
          color: rgba(0,0,0,0.62);
        }
        .note-content p { margin-bottom: 1em; }
        .note-content p:last-child { margin-bottom: 0; }
        .note-content s { opacity: 0.5; }
        .note-content a { color: rgba(0,0,0,0.8); border-bottom: 1px solid rgba(0,0,0,0.25); text-decoration: none; }
        .note-content a:hover { border-bottom-color: rgba(0,0,0,0.65); }
        .note-content .social-embed-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.55);
          background: rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.12);
          border-bottom: 1px solid rgba(0,0,0,0.12);
          border-radius: 2px;
          padding: 0.25rem 0.55rem;
          margin: 0.5rem 0;
          transition: color 0.15s, background 0.15s, border-color 0.15s;
        }
        .note-content .social-embed-link:hover {
          color: rgba(0,0,0,0.85);
          background: rgba(0,0,0,0.07);
          border-color: rgba(0,0,0,0.25);
        }
        .note-content strong { color: rgba(0,0,0,0.85); font-weight: 600; }
        .note-content em { font-style: italic; }
        .note-content h1, .note-content h2, .note-content h3 {
          font-family: var(--font-crimson-text), Georgia, serif;
          color: rgba(0,0,0,0.85);
          margin: 1.25em 0 0.5em;
        }
        .note-content blockquote.instagram-media { display: none; }
        .note-content img { max-width: 100%; height: auto; display: block; margin: 1em 0; border: 1px solid rgba(0,0,0,0.12); border-radius: 2px; }
      `}</style>
    </div>
  );
}

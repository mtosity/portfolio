"use client";

import { SlideTabs } from "@/components/SlideTabs";
import { useEffect, useState } from "react";
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

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).toUpperCase();
}

function groupByYear(items: Note[]) {
  const groups: Record<string, Note[]> = {};
  for (const item of items) {
    const year = new Date(item.date_modified).getFullYear().toString();
    if (!groups[year]) groups[year] = [];
    groups[year].push(item);
  }
  return Object.entries(groups).sort(([a], [b]) => Number(b) - Number(a));
}

function NoteRow({ note }: { note: Note }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        borderBottom: "1px solid var(--border-light)",
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          width: "100%",
          padding: "1.1rem 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          gap: "1.5rem",
          textAlign: "left",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-crimson-text), Georgia, serif",
            fontSize: "1.2rem",
            fontWeight: 400,
            color: "var(--fg)",
            lineHeight: 1.3,
            flex: 1,
          }}
        >
          {note.title}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            letterSpacing: "0.1em",
            color: "var(--muted)",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          {formatDate(note.date_modified)}
          <span
            style={{
              display: "inline-block",
              transition: "transform 0.2s ease",
              transform: open ? "rotate(45deg)" : "rotate(0deg)",
              fontSize: "1rem",
              lineHeight: 1,
              color: "var(--fg)",
            }}
          >
            +
          </span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div
              className="note-content"
              dangerouslySetInnerHTML={{ __html: note.content_html }}
              style={{
                padding: "0 0 1.75rem",
                fontSize: "1rem",
                lineHeight: 1.75,
                color: "var(--muted)",
                maxWidth: "62ch",
              }}
            />
            <Link
              href={note.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--fg)",
                textDecoration: "none",
                borderBottom: "1px solid var(--border-light)",
                paddingBottom: "1px",
                marginBottom: "1.5rem",
              }}
            >
              Read on Leaflet ↗
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Notes() {
  const [feed, setFeed] = useState<Feed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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

  const yearGroups = feed ? groupByYear(feed.items) : [];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--fg)" }}>
      <SlideTabs />

      {/* Page header */}
      <div
        style={{
          marginTop: "56px",
          borderBottom: "1px solid var(--border)",
          padding: "3rem clamp(1.5rem, 5vw, 4rem) 2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "0.75rem",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--muted)",
            }}
          >
            06 —
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--fg)",
            }}
          >
            NOTES
          </span>
        </div>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.8125rem",
            letterSpacing: "0.03em",
            color: "var(--muted)",
            maxWidth: "480px",
          }}
        >
          What you see here is only between us. My thoughts will change over
          time, so don&apos;t map these notes to my personality.
        </p>
      </div>

      {/* Notes feed */}
      <div
        style={{
          padding: "0 clamp(1.5rem, 5vw, 4rem) 6rem",
          maxWidth: "800px",
        }}
      >
        {loading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "4rem 0",
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
              color: "var(--muted)",
            }}
          >
            <motion.div
              style={{
                width: "1rem",
                height: "1rem",
                border: "1px solid var(--border-light)",
                borderTopColor: "var(--fg)",
                borderRadius: "50%",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            LOADING
          </div>
        )}

        {error && (
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "var(--muted)",
              padding: "4rem 0",
            }}
          >
            Failed to load notes.{" "}
            <Link
              href="https://mtosity.leaflet.pub"
              target="_blank"
              style={{ color: "var(--fg)", borderBottom: "1px solid var(--border-light)" }}
            >
              Read on Leaflet ↗
            </Link>
          </p>
        )}

        {!loading && !error && yearGroups.map(([year, notes]) => (
          <div key={year}>
            <div
              style={{
                padding: "2.5rem 0 0.5rem",
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                color: "var(--muted)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {year}
            </div>
            {notes.map((note) => (
              <NoteRow key={note.id} note={note} />
            ))}
          </div>
        ))}
      </div>

      <style>{`
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
      `}</style>
    </div>
  );
}

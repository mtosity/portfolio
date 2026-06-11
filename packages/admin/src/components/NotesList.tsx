"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export interface NoteListItem {
  id: string;
  title: string;
  createdAt: string;
  published: boolean;
}

function formatDate(iso: string) {
  return new Date(iso)
    .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    .toUpperCase();
}

function RevealRow({ note, index }: { note: NoteListItem; index: number }) {
  const ref = useRef<HTMLLIElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <li
      ref={ref}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "0.9rem 0",
        borderBottom: "1px solid var(--border-light)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
        transitionDelay: `${Math.min(index, 8) * 40}ms`,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.62rem",
          letterSpacing: "0.1em",
          color: "var(--muted)",
          width: 100,
          flexShrink: 0,
        }}
      >
        {formatDate(note.createdAt)}
      </span>
      <Link
        href={`/admin/notes/${note.id}/edit`}
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "1.05rem",
          color: "var(--fg)",
          textDecoration: "none",
          flex: 1,
        }}
      >
        {note.title}
      </Link>
      {!note.published && (
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--muted)",
            border: "1px solid var(--border-light)",
            borderRadius: 2,
            padding: "0.15rem 0.4rem",
          }}
        >
          Draft
        </span>
      )}
    </li>
  );
}

export default function NotesList({ notes }: { notes: NoteListItem[] }) {
  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
      {notes.map((n, i) => (
        <RevealRow key={n.id} note={n} index={i} />
      ))}
    </ul>
  );
}

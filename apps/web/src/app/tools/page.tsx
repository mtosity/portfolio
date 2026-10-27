"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SiteNav, SiteFooter } from "@mtosity/design-system";
import { tools, type ToolIconName } from "@/data/tools";

const STATUS_LABEL: Record<string, string> = {
  live: "Live",
  beta: "Beta",
  wip: "In progress",
};

export default function ToolsPage() {
  return (
    <>
      <SiteNav />
      <main id="main" className="tools frame">
        <header className="tools-head">
          <motion.h1
            className="tools-title display"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          >
            Small tools. Built to be useful.
          </motion.h1>
          <motion.p
            className="tools-lede"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
          >
            A growing shelf of one-page utilities I&apos;ve built for myself —
            most of them run entirely in your browser. No accounts, no uploads,
            no telemetry.
          </motion.p>
        </header>

        <ul className="tools-list">
          {tools.map((tool, i) => (
            <ToolRow key={tool.slug} tool={tool} index={i} />
          ))}
        </ul>
      </main>
      <SiteFooter />
    </>
  );
}

function ToolRow({
  tool,
  index,
}: {
  tool: (typeof tools)[number];
  index: number;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.18 + index * 0.07, ease: [0.23, 1, 0.32, 1] }}
    >
      <Link href={`/tools/${tool.slug}`} className="tool-row">
        <ToolThumbnail name={tool.icon} />
        <div className="tool-body">
          <h2 className="tool-title display">{tool.title}</h2>
          <p className="tool-tagline">{tool.tagline}</p>
          <p className="tool-desc">{tool.description}</p>
          <p className="tool-meta">
            <span className={`tool-status tool-status-${tool.status}`}>{STATUS_LABEL[tool.status]}</span>
            <span aria-hidden="true">·</span>
            <span>{tool.year}</span>
            <span aria-hidden="true">·</span>
            <span>{tool.tags.join(", ")}</span>
          </p>
        </div>
        <span className="tool-open" aria-hidden="true">
          Open
          <svg viewBox="0 0 16 16"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
        </span>
      </Link>
    </motion.li>
  );
}

function ToolThumbnail({ name }: { name: ToolIconName }) {
  return (
    <div className="tool-thumb" aria-hidden>
      <ToolIcon name={name} />
    </div>
  );
}

function ToolIcon({ name }: { name: ToolIconName }) {
  const stroke = "currentColor";
  const sw = 1.5;

  if (name === "mic") {
    return (
      <svg
        viewBox="0 0 32 32"
        fill="none"
        stroke={stroke}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: "100%", height: "100%" }}
      >
        <rect x="12" y="4" width="8" height="16" rx="4" />
        <path d="M6 14a10 10 0 0 0 20 0" />
        <line x1="16" y1="24" x2="16" y2="28" />
        <line x1="11" y1="28" x2="21" y2="28" />
        {/* sound arcs */}
        <path d="M3 12c0 1.5 0.4 2.9 1 4" opacity="0.5" />
        <path d="M29 12c0 1.5 -0.4 2.9 -1 4" opacity="0.5" />
      </svg>
    );
  }

  if (name === "grid") {
    return (
      <svg
        viewBox="0 0 32 32"
        fill="none"
        stroke={stroke}
        strokeWidth={sw}
        strokeLinejoin="miter"
        style={{ width: "100%", height: "100%" }}
      >
        <rect x="4" y="4" width="11" height="11" />
        <rect x="17" y="4" width="11" height="11" />
        <rect x="4" y="17" width="11" height="11" />
        <rect x="17" y="17" width="11" height="11" />
        {/* "image" hint inside top-left tile */}
        <circle cx="8" cy="8" r="1.2" fill="currentColor" />
        <path d="M5 13l3-3 4 4" />
      </svg>
    );
  }

  // reel — phone-shape with play triangle
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke={stroke}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: "100%", height: "100%" }}
    >
      <rect x="9" y="2" width="14" height="28" rx="2.5" />
      <line x1="13" y1="5" x2="19" y2="5" opacity="0.5" />
      <circle cx="16" cy="26.5" r="0.9" fill="currentColor" />
      <path d="M14 13l6 3 -6 3 z" fill="currentColor" stroke="none" />
    </svg>
  );
}

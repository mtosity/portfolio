"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SlideTabs } from "@mtosity/design-system";
import { tools, type ToolIconName } from "@/data/tools";

const STATUS_LABEL: Record<string, string> = {
  live: "● LIVE",
  beta: "◐ BETA",
  wip: "○ WIP",
};

export default function ToolsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--fg)" }}>
      <SlideTabs />

      <main
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "calc(56px + 4rem) clamp(1.5rem, 5vw, 4rem) 6rem",
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            paddingBottom: "1.25rem",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              letterSpacing: "0.2em",
              color: "var(--muted)",
            }}
          >
            07 —
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            TOOLS
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              letterSpacing: "0.18em",
              color: "var(--muted)",
              textTransform: "uppercase",
            }}
          >
            {tools.length.toString().padStart(2, "0")} ITEM{tools.length === 1 ? "" : "S"}
          </span>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ padding: "3rem 0 4rem" }}
        >
          <h1
            style={{
              fontFamily: "var(--font-crimson-text), Georgia, serif",
              fontSize: "clamp(2.5rem, 6vw, 4.75rem)",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
              maxWidth: "18ch",
              margin: 0,
            }}
          >
            Small tools.{" "}
            <span style={{ fontStyle: "italic", color: "var(--muted)" }}>
              Built to be useful.
            </span>
          </h1>
          <p
            style={{
              marginTop: "1.5rem",
              fontSize: "1.0625rem",
              lineHeight: 1.7,
              color: "var(--muted)",
              maxWidth: "52ch",
            }}
          >
            A growing shelf of one-page utilities I&apos;ve built for myself —
            most of them run entirely in your browser. No accounts, no uploads,
            no telemetry.
          </p>
        </motion.div>

        {/* Tools list */}
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {tools.map((tool, i) => (
            <ToolRow key={tool.slug} tool={tool} index={i} />
          ))}
        </ul>
      </main>
    </div>
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
      initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
      animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
      transition={{
        duration: 0.8,
        delay: 0.25 + index * 0.08,
        ease: [0.65, 0, 0.35, 1],
      }}
      style={{ borderBottom: "1px solid var(--border-light)" }}
    >
      <Link
        href={`/tools/${tool.slug}`}
        className="tool-row"
        style={{
          display: "grid",
          gridTemplateColumns: "auto auto 1fr auto",
          alignItems: "start",
          gap: "clamp(0.85rem, 2.5vw, 1.75rem)",
          padding: "1.75rem 1rem",
          color: "var(--fg)",
          textDecoration: "none",
          position: "relative",
          transition: "background 0.3s ease, padding 0.3s ease",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            letterSpacing: "0.18em",
            color: "var(--muted)",
            minWidth: "3ch",
            paddingTop: "0.55rem",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <ToolThumbnail name={tool.icon} />

        <div style={{ minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "0.75rem",
              flexWrap: "wrap",
              marginBottom: "0.5rem",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-crimson-text), Georgia, serif",
                fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              {tool.title}
            </h2>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                color: "var(--muted)",
                textTransform: "uppercase",
              }}
            >
              {STATUS_LABEL[tool.status]} · {tool.year}
            </span>
          </div>
          <p
            style={{
              fontSize: "1rem",
              color: "var(--muted)",
              lineHeight: 1.6,
              margin: "0 0 0.85rem",
              maxWidth: "62ch",
            }}
          >
            {tool.description}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {tool.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  border: "1px solid var(--border-light)",
                  padding: "0.18rem 0.55rem",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <span
          aria-hidden
          className="tool-arrow"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.95rem",
            color: "var(--fg)",
            transform: "translateX(0)",
            transition: "transform 0.3s ease",
            display: "inline-block",
          }}
        >
          →
        </span>
      </Link>

      {/* jsx global: motion.li doesn't receive the styled-jsx scope class,
          so scoped selectors would never match the row. */}
      <style jsx global>{`
        .tool-row:hover {
          background: var(--accent);
          padding-left: 1.5rem !important;
          /* Ink-on-lime: children read their colors from these vars */
          --fg: var(--accent-fg);
          --muted: var(--accent-fg-muted);
          --border-light: var(--accent-fg-muted);
        }
        .tool-row:hover .tool-arrow {
          transform: translateX(8px);
        }
        .tool-row:hover .tool-thumb {
          /* Cream chip on lime — constant across themes (matches light --bg).
             !important: the chip sets background/border inline. */
          background: #f2efe8 !important;
          border-color: var(--fg) !important;
        }
        .tool-row:hover .tool-thumb svg {
          transform: rotate(-4deg) scale(1.05);
        }
      `}</style>
    </motion.li>
  );
}

function ToolThumbnail({ name }: { name: ToolIconName }) {
  return (
    <div
      className="tool-thumb"
      style={{
        width: "clamp(56px, 8vw, 72px)",
        height: "clamp(56px, 8vw, 72px)",
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-light)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transition: "background 0.25s ease, border-color 0.25s ease",
        position: "relative",
        overflow: "hidden",
      }}
      aria-hidden
    >
      <div
        style={{
          width: "60%",
          height: "60%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--fg)",
          transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <ToolIcon name={name} />
      </div>
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

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SlideTabs, Tag, type TagTone } from "@mtosity/design-system";
import { tools, type ToolIconName } from "@/data/tools";

const STATUS_LABEL: Record<string, string> = {
  live: "Live",
  beta: "Beta",
  wip: "In progress",
};

const STATUS_TONE: Record<string, TagTone> = {
  live: "positive",
  beta: "warning",
  wip: "neutral",
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
              fontSize: "0.8125rem",
              color: "var(--accent-text)",
            }}
          >
            07 —
          </span>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.75rem",
              fontWeight: 700,
            }}
          >
            Tools
          </span>
          <div style={{ flex: 1 }} />
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.75rem",
              color: "var(--muted)",
            }}
          >
            {tools.length.toString().padStart(2, "0")} {tools.length === 1 ? "tool" : "tools"}
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
              fontFamily: "var(--font-heading)",
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
        <ul className="ds-group" style={{ listStyle: "none", margin: 0 }}>
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
    >
      <Link href={`/tools/${tool.slug}`} className="ds-group-row tool-row">
        <ToolThumbnail name={tool.icon} />

        <div style={{ minWidth: 0 }}>
          <div className="tool-title-line">
            <h2 className="tool-title">{tool.title}</h2>
            <Tag tone={STATUS_TONE[tool.status] ?? "neutral"}>
              {STATUS_LABEL[tool.status]}
            </Tag>
            <span className="tool-year">{tool.year}</span>
          </div>
          <p className="tool-desc">{tool.description}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {tool.tags.map((tag) => (
              <span key={tag} className="chip">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <svg className="tool-chevron" width="9" height="15" viewBox="0 0 9 15" fill="none" aria-hidden>
          <path d="M1.5 1.5l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>

      {/* jsx global: motion.li doesn't receive the styled-jsx scope class,
          so scoped selectors would never match the row. */}
      <style jsx global>{`
        .tool-row {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: clamp(0.9rem, 2.5vw, 1.5rem);
          padding: 1.1rem 1rem;
        }
        .tool-title-line {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-wrap: wrap;
          margin-bottom: 0.3rem;
        }
        .tool-title {
          font-family: var(--font-heading);
          font-stretch: var(--heading-stretch);
          font-size: clamp(1.35rem, 3vw, 1.75rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1.15;
          margin: 0;
        }
        .tool-year {
          font-size: 0.8125rem;
          color: var(--muted);
          font-variant-numeric: tabular-nums;
        }
        .tool-desc {
          font-size: 0.9375rem;
          line-height: 1.45;
          color: var(--muted);
          margin: 0 0 0.75rem;
          max-width: 62ch;
        }
        .tool-chevron {
          color: var(--muted);
          opacity: 0.6;
          transition: transform var(--duration-fast) var(--ease-out);
        }
        .tool-row:hover .tool-chevron {
          transform: translateX(3px);
          opacity: 1;
        }
        /* The status capsule and chips go white on the blue row. */
        .tool-row:hover .tag {
          color: var(--accent);
          background: var(--accent-fg);
        }
        /* On the blue row the icon tile flips to white with a blue
           glyph. !important: the tile sets background/colour inline. */
        .tool-row:hover .tool-thumb {
          background: #ffffff !important;
        }
        .tool-row:hover .tool-thumb > div {
          color: var(--accent) !important;
        }
        .tool-row:hover .tool-thumb svg {
          transform: rotate(-4deg) scale(1.05);
        }
      `}</style>
    </motion.li>
  );
}

/* An app icon: a blue squircle tile with a white glyph — the same
   corner ratio (≈22%) as an iOS icon. */
function ToolThumbnail({ name }: { name: ToolIconName }) {
  return (
    <div
      className="tool-thumb"
      style={{
        width: "clamp(52px, 7vw, 64px)",
        height: "clamp(52px, 7vw, 64px)",
        borderRadius: "22.5%",
        background:
          "linear-gradient(160deg, color-mix(in srgb, var(--accent) 78%, #ffffff), var(--accent) 55%, color-mix(in srgb, var(--accent) 80%, #000000))",
        boxShadow: "var(--shadow-sm)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transition: "box-shadow 0.25s ease",
        overflow: "hidden",
      }}
      aria-hidden
    >
      <div
        style={{
          width: "56%",
          height: "56%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
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
  const sw = 2;

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

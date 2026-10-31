"use client";

import React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SlideTabs } from "@mtosity/design-system";
import {
  definitions,
  type Definition,
  codeExamples,
  type CodeExample,
} from "./definitions";
import { BlogProvider, useBlogInteraction } from "./BlogContext";
import CodeView from "./CodeView";

interface BlogLayoutProps {
  title: string;
  date: string;
  category?: string;
  children: React.ReactNode;
  /**
   * Extra anchor targets for editor-authored posts, keyed the same way as
   * definitions.tsx (contract §1's `data-anchor-key`).
   *
   * Contract §4: static wins. These are merged UNDER the static maps, so a key
   * that exists in definitions.tsx always resolves to the hand-written version
   * and the 5 legacy posts cannot be affected by a database row. Legacy posts
   * pass neither prop, so their lookup is byte-identical to before.
   *
   * `Definition.content` is a ReactNode here even though the DB stores HTML —
   * the caller converts with `renderBlogHtml()` before passing it in.
   */
  extraDefinitions?: Record<string, Definition>;
  extraCodeExamples?: Record<string, CodeExample>;
}

interface Heading {
  id: string;
  text: string;
  level: number;
}

type SidebarMode = "toc" | "definition" | "code";

const OFFSET = "calc(56px + 2.5rem)";
const SIDEBAR_HEIGHT = "calc(100vh - 56px - 5rem)";

function Sidebar({
  headings,
  sidebarMode,
  currentDefinition,
  currentCodeExample,
  onScrollToHeading,
  isTransitioning,
  isClosing,
  activeHeadingId,
  hideBackLink,
}: {
  headings: Heading[];
  sidebarMode: SidebarMode;
  currentDefinition: Definition | null;
  currentCodeExample: CodeExample | null;
  onScrollToHeading: (id: string) => void;
  isTransitioning: boolean;
  isClosing: boolean;
  activeHeadingId: string;
  hideBackLink?: boolean;
}) {
  const { onClose } = useBlogInteraction();

  return (
    <div>
      {!hideBackLink && (
        <Link href="/blog" className="rail-backlink">
          ← Back to blog
        </Link>
      )}

      {/* Definition cards used to carry hardcoded pastel hex, so this panel
          pinned `theme-light-scope` whenever one was open — which meant a
          reader in dark mode got a bright white panel next to a dark article.
          The cards now use the --def-* tokens (tokens.css), which have dark
          values, so the panel follows the theme like everything else. */}
      <div
        style={{
          background: "var(--bg-secondary)",
          borderRadius: "var(--radius-lg)",
          padding: "1.25rem 0.75rem 1.25rem 1.25rem",
          height: SIDEBAR_HEIGHT,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {sidebarMode === "definition" && (
          <div
            className={`${
              isClosing
                ? "animate-definition-exit"
                : isTransitioning
                ? "animate-fade-blur-out"
                : "animate-slide-in-left"
            }`}
            style={{ display: "flex", flexDirection: "column", overflow: "hidden", flex: 1 }}
          >
            <div className="rail-panel-head">
              <h3 className="rail-panel-title">{currentDefinition?.title}</h3>
              <button onClick={onClose} className="rail-back">
                Back
              </button>
            </div>
            <div className="def-content rail-panel-scroll">
              {currentDefinition?.content}
            </div>
          </div>
        )}

        {sidebarMode === "code" && currentCodeExample && (
          <CodeView
            codeExample={currentCodeExample}
            isTransitioning={isTransitioning}
            isClosing={isClosing}
            onClose={onClose}
          />
        )}

        {sidebarMode === "toc" && (
          <div
            className="animate-fade-in-smooth"
            style={{ display: "flex", flexDirection: "column", overflow: "hidden", flex: 1 }}
          >
            <h3 className="rail-toc-title">Contents</h3>
            <nav className="rail-toc">
              {headings.map((heading) => {
                const isActive = heading.id === activeHeadingId;
                return (
                  <button
                    key={heading.id}
                    onClick={() => onScrollToHeading(heading.id)}
                    aria-current={isActive ? "location" : undefined}
                    data-level={heading.level > 2 ? "sub" : undefined}
                  >
                    {heading.text}
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BlogLayout({
  title,
  date,
  category,
  children,
  extraDefinitions,
  extraCodeExamples,
}: BlogLayoutProps) {
  void category;
  // Static-file first, DB second (contract §4): spreading the static maps last
  // means a key present in both resolves to the hand-written entry.
  const resolvedDefinitions = extraDefinitions
    ? { ...extraDefinitions, ...definitions }
    : definitions;
  const resolvedCodeExamples = extraCodeExamples
    ? { ...extraCodeExamples, ...codeExamples }
    : codeExamples;
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>("toc");
  const [currentDefinition, setCurrentDefinition] = useState<Definition | null>(null);
  const [currentCodeExample, setCurrentCodeExample] = useState<CodeExample | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [activeHeadingId, setActiveHeadingId] = useState<string>("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  // Auto-expand sidebar on desktop
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    // One-time mount sync with the media query; the state is also toggled by
    // the user, so useSyncExternalStore does not fit here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsSidebarCollapsed(!mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsSidebarCollapsed(!e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const extractHeadings = () => {
      const articleElement = document.querySelector("article.blog-article");
      if (!articleElement) return;
      const headingElements = articleElement.querySelectorAll("h1,h2,h3,h4,h5,h6");
      const headingData: Heading[] = [];
      headingElements.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1));
        const text = heading.textContent || "";
        const id = `heading-${index}`;
        heading.id = id;
        headingData.push({ id, text, level });
      });
      setHeadings(headingData.filter((h) => h.level >= 2));
    };
    const timer = setTimeout(extractHeadings, 100);
    return () => clearTimeout(timer);
  }, [children]);

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings
        .map((h) => document.getElementById(h.id))
        .filter(Boolean);
      if (headingElements.length === 0) return;
      let activeId = "";
      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i];
        if (el && el.getBoundingClientRect().top <= 100) {
          activeId = el.id;
          break;
        }
      }
      if (!activeId && headingElements[0]) {
        if (headingElements[0]!.getBoundingClientRect().top > 100) {
          activeId = headingElements[0]!.id;
        }
      }
      setActiveHeadingId(activeId);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  const scrollToHeading = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDefinitionRequest = (definitionKey: string, _anchorId: string) => {
    const definition = resolvedDefinitions[definitionKey];
    if (!definition) return;
    if (isSidebarCollapsed) setIsSidebarCollapsed(false);
    if (sidebarMode === "definition" && currentDefinition) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentDefinition(definition);
        setCurrentCodeExample(null);
        setIsTransitioning(false);
      }, 250);
    } else {
      setCurrentDefinition(definition);
      setCurrentCodeExample(null);
      setSidebarMode("definition");
    }
  };

  const handleCodeExampleRequest = (codeKey: string, _anchorId: string) => {
    const codeExample = resolvedCodeExamples[codeKey];
    if (!codeExample) return;
    if (isSidebarCollapsed) setIsSidebarCollapsed(false);
    if (sidebarMode === "code" && currentCodeExample) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentCodeExample(codeExample);
        setCurrentDefinition(null);
        setIsTransitioning(false);
      }, 250);
    } else {
      setCurrentCodeExample(codeExample);
      setCurrentDefinition(null);
      setSidebarMode("code");
    }
  };

  const handleBackToToc = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSidebarMode("toc");
      setCurrentDefinition(null);
      setCurrentCodeExample(null);
      setIsClosing(false);
    }, 300);
  };

  return (
    <BlogProvider
      onInteract={handleDefinitionRequest}
      onCodeExampleInteract={handleCodeExampleRequest}
      onClose={handleBackToToc}
    >
      <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--fg)" }}>
        <SlideTabs />

        {/* Mobile TOC toggle button */}
        <button
          className="blog-mobile-toc-btn"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          aria-label={isSidebarCollapsed ? "Show table of contents" : "Hide table of contents"}
        >
          {isSidebarCollapsed ? "☰ TOC" : "✕ Close"}
        </button>

        {/* Mobile sidebar backdrop */}
        <div
          className={`blog-sidebar-overlay${!isSidebarCollapsed ? " open" : ""}`}
          onClick={() => setIsSidebarCollapsed(true)}
        />

        {/* Mobile sidebar panel */}
        <div className={`blog-sidebar-mobile${!isSidebarCollapsed ? " open" : ""}`}>
          <Sidebar
            headings={headings}
            sidebarMode={sidebarMode}
            currentDefinition={currentDefinition}
            currentCodeExample={currentCodeExample}
            onScrollToHeading={(id) => {
              scrollToHeading(id);
              setIsSidebarCollapsed(true);
            }}
            isTransitioning={isTransitioning}
            isClosing={isClosing}
            activeHeadingId={activeHeadingId}
            hideBackLink
          />
        </div>

        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: `${OFFSET} clamp(1.5rem, 4vw, 3rem) 6rem`,
          }}
        >
          <div className="blog-post-grid">
            {/* Sidebar — desktop only (sticky) */}
            <div className="blog-sidebar-desktop">
              <Sidebar
                headings={headings}
                sidebarMode={sidebarMode}
                currentDefinition={currentDefinition}
                currentCodeExample={currentCodeExample}
                onScrollToHeading={scrollToHeading}
                isTransitioning={isTransitioning}
                isClosing={isClosing}
                activeHeadingId={activeHeadingId}
              />
            </div>

            {/* Article */}
            <div>
              <article className="blog-article">
                <header className="article-head">
                  <h1 className="article-headline">{title}</h1>
                  <p className="article-date">{date}</p>
                </header>
                <div className="article-body">{children}</div>
              </article>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Reading typography — a newspaper-style serif column: Literata
           at --read-size / --read-leading, full-strength ink, headings
           in the same serif so the page reads as one voice. */
        .article-head {
          padding-bottom: 2rem;
          margin-bottom: 2.5rem;
          border-bottom: 1px solid var(--border-light);
        }
        .article-headline {
          font-family: var(--font-serif);
          font-weight: 700;
          font-stretch: normal;
          font-size: clamp(2.1rem, 1.5rem + 2.6vw, 3.4rem);
          line-height: 1.06;
          letter-spacing: -0.018em;
          font-optical-sizing: auto;
          color: var(--fg);
          margin: 0;
        }
        .article-date {
          margin: 1.25rem 0 0;
          font-family: var(--font-sans);
          font-size: 0.95rem;
          color: var(--muted);
          font-variant-numeric: tabular-nums;
        }
        .article-body {
          font-family: var(--font-serif);
          font-size: var(--read-size);
          line-height: var(--read-leading);
          color: var(--fg);
          font-optical-sizing: auto;
          hanging-punctuation: first;
        }
        .blog-article .article-body p { margin: 0 0 1.1em; }
        .blog-article h2 {
          font-family: var(--font-serif);
          font-weight: 700;
          font-stretch: normal;
          font-size: 1.55em;
          line-height: 1.15;
          letter-spacing: -0.012em;
          color: var(--fg);
          margin: 2.2em 0 0.6em;
        }
        .blog-article h3 {
          font-family: var(--font-serif);
          font-weight: 700;
          font-stretch: normal;
          font-size: 1.2em;
          line-height: 1.25;
          letter-spacing: -0.006em;
          color: var(--fg);
          margin: 1.9em 0 0.45em;
        }
        .blog-article h4 {
          font-family: var(--font-sans);
          font-weight: 700;
          font-stretch: normal;
          font-size: 0.85em;
          letter-spacing: 0;
          color: var(--fg);
          margin: 1.6em 0 0.35em;
        }
        .blog-article .article-body a {
          color: inherit;
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 0.2em;
          text-decoration-color: color-mix(in srgb, var(--accent) 70%, transparent);
          transition: text-decoration-thickness 0.15s ease;
        }
        .blog-article .article-body a:hover { text-decoration-thickness: 2px; }
        .blog-article :not(pre) > code {
          font-family: var(--font-mono);
          font-size: 0.84em;
          background: var(--fill);
          border-radius: var(--radius-xs);
          padding: 0.12em 0.36em;
          color: var(--fg);
        }
        .blog-article pre {
          background: var(--bg-secondary) !important;
          color: var(--fg) !important;
          border-radius: var(--radius-md);
          padding: 1.15rem 1.35rem;
          overflow-x: auto;
          margin: 1.8em 0;
          font-size: 0.85rem;
          line-height: 1.65;
        }
        .blog-article pre code {
          background: none !important;
          border: none !important;
          padding: 0 !important;
          font-size: inherit;
        }
        .blog-article blockquote {
          margin: 1.8em 0;
          padding: 0;
          font-size: 1.2em;
          line-height: 1.4;
          font-style: italic;
          color: var(--fg);
        }
        .blog-article blockquote::before {
          content: "";
          display: block;
          width: 2.5rem;
          height: 3px;
          background: var(--accent);
          margin-bottom: 0.8rem;
        }
        .blog-article blockquote p { margin: 0; }
        .blog-article ul, .blog-article ol { padding-left: 1.25em; margin: 0 0 1.1em; }
        .blog-article li { margin-bottom: 0.35em; padding-left: 0.2em; }
        .blog-article li::marker { color: var(--muted); }
        .blog-article strong { color: var(--fg); font-weight: 700; }
        .blog-article em { font-style: italic; }
        .blog-article hr {
          border: none;
          text-align: center;
          margin: 2.5em 0;
        }
        .blog-article hr::before {
          content: "· · ·";
          color: var(--muted);
          letter-spacing: 0.6em;
        }
        .blog-article img {
          max-width: 100%;
          height: auto;
          border-radius: var(--radius-md);
          display: block;
          margin: 2em 0;
        }
        .blog-article figcaption {
          font-family: var(--font-sans);
          font-size: 0.85rem;
          color: var(--muted);
          margin-top: 0.6rem;
        }

        /* ── Rail: contents, definitions, code examples ──
           Same sans and sizes as #111's reading rail, in the panel's
           existing box. */
        .rail-backlink {
          display: inline-block;
          margin-bottom: 1rem;
          font-family: var(--font-sans);
          font-size: 0.92rem;
          color: var(--muted);
          text-decoration: none;
          transition: color 0.15s ease;
        }
        .rail-backlink:hover { color: var(--accent-text); }
        .rail-toc-title,
        .rail-panel-title {
          font-family: var(--font-sans);
          font-size: 0.95rem;
          font-weight: 700;
          font-stretch: normal;
          letter-spacing: 0;
          line-height: 1.25;
          color: var(--fg);
          margin: 0;
        }
        .rail-toc-title {
          flex-shrink: 0;
          padding-bottom: 0.75rem;
          margin-bottom: 0.75rem;
          border-bottom: 1px solid var(--border-light);
        }
        .rail-toc { display: flex; flex-direction: column; overflow-y: auto; flex: 1; }
        .rail-toc button {
          display: block;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          border-radius: var(--radius-sm);
          padding: 0.38rem 0.6rem 0.38rem 0.75rem;
          font-family: var(--font-sans);
          font-size: 0.92rem;
          line-height: 1.35;
          color: var(--muted);
          cursor: pointer;
          overflow-wrap: anywhere;
          transition: color 0.15s ease, background 0.15s ease;
        }
        .rail-toc button[data-level="sub"] { padding-left: 1.6rem; }
        .rail-toc button:hover { color: var(--fg); background: var(--fill); }
        /* Current section: a tinted selection, like a sidebar row */
        .rail-toc button[aria-current] { color: var(--accent-text); background: var(--accent-soft); font-weight: 600; }

        .rail-panel-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 0.75rem;
          flex-shrink: 0;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border-light);
        }
        .rail-panel-title { font-size: 1.15rem; }
        .rail-back {
          flex-shrink: 0;
          font-family: var(--font-sans);
          font-size: 0.88rem;
          color: var(--muted);
          background: none;
          border: none;
          padding: 0.2rem 0;
          cursor: pointer;
          transition: color 0.15s ease;
        }
        .rail-back::before { content: "← "; }
        .rail-back:hover { color: var(--accent-text); }
        .rail-panel-scroll { overflow-y: auto; flex: 1; min-height: 0; padding-top: 1rem; }
        .rail-panel-lede {
          font-family: var(--font-sans);
          font-size: 0.92rem;
          line-height: 1.5;
          color: var(--muted);
          margin: 0.75rem 0 1rem;
          flex-shrink: 0;
        }
        .rail-panel-body {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          flex: 1;
          overflow-y: auto;
          min-height: 0;
          padding-bottom: 3rem;
        }

        /* Definitions (definitions.tsx + DB rows) carry inline mono label
           styles; normalise them to the rail's sans. Code keeps mono. */
        .def-content { font-family: var(--font-sans); font-size: 0.92rem; line-height: 1.55; }
        .def-content p { color: var(--fg) !important; font-size: 0.92rem !important; line-height: 1.55 !important; }
        .def-content li { color: var(--muted); font-size: 0.9rem; padding: 0.15em 0; }
        .def-content strong { color: var(--fg); font-weight: 600; }
        .def-content h4 {
          font-family: var(--font-sans) !important;
          font-size: 0.85rem !important;
          font-weight: 700 !important;
          letter-spacing: 0 !important;
          text-transform: none !important;
          font-stretch: normal;
        }
        .def-content code { font-family: var(--font-mono) !important; }

        .code-example-label {
          font-family: var(--font-sans);
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0;
          margin: 0 0 0.45rem;
        }
        .code-example-error { color: var(--def-red-text); }
        .code-example-success { color: var(--def-green-text); }
        .code-example-default { color: var(--muted); }
        .code-example-note {
          font-family: var(--font-sans);
          font-size: 0.86rem;
          line-height: 1.5;
          color: var(--muted);
          margin: 0.5rem 0 0;
        }
      `}</style>
    </BlogProvider>
  );
}

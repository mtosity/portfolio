"use client";

import React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SlideTabs } from "@/components/SlideTabs";
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
        <Link
          href="/blog"
          style={{
            display: "inline-block",
            fontFamily: "var(--font-mono)",
            fontSize: "0.68rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--muted)",
            textDecoration: "none",
            marginBottom: "1rem",
            borderBottom: "1px solid var(--border-light)",
            paddingBottom: "1px",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.color = "var(--fg)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.color = "var(--muted)")
          }
        >
          ← Back to Blog
        </Link>
      )}

      <div
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-light)",
          padding: "1.25rem",
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1rem",
                gap: "0.5rem",
                flexShrink: 0,
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--fg)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {currentDefinition?.title}
              </h3>
              <button
                onClick={onClose}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "var(--fg)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "var(--muted)")
                }
              >
                ← Back
              </button>
            </div>
            <div
              className="def-content"
              style={{
                borderTop: "1px solid var(--border-light)",
                paddingTop: "1rem",
                overflowY: "auto",
                flex: 1,
              }}
            >
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
            <h3
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: "1rem",
                flexShrink: 0,
                borderBottom: "1px solid var(--border-light)",
                paddingBottom: "0.75rem",
              }}
            >
              Contents
            </h3>
            <nav
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0",
                overflowY: "auto",
                flex: 1,
              }}
            >
              {headings.map((heading) => {
                const isActive = heading.id === activeHeadingId;
                return (
                  <button
                    key={heading.id}
                    onClick={() => onScrollToHeading(heading.id)}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      background: isActive ? "var(--bg)" : "transparent",
                      border: "none",
                      paddingTop: "0.25rem",
                      paddingBottom: "0.25rem",
                      paddingRight: "0.5rem",
                      paddingLeft: heading.level > 2 ? "1.5rem" : "0.5rem",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.7rem",
                      lineHeight: 1.5,
                      color: isActive ? "var(--fg)" : "var(--muted)",
                      cursor: "pointer",
                      borderLeft: isActive ? "2px solid var(--fg)" : "2px solid transparent",
                      transition: "color 0.15s",
                      wordBreak: "break-word",
                    }}
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
}: BlogLayoutProps) {
  void category;
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
    const definition = definitions[definitionKey];
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
    const codeExample = codeExamples[codeKey];
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
                <header
                  style={{
                    marginBottom: "3rem",
                    paddingBottom: "2rem",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <h1
                    style={{
                      fontFamily: "var(--font-crimson-text), Georgia, serif",
                      fontSize: "clamp(1.75rem, 4vw, 3rem)",
                      fontWeight: 700,
                      lineHeight: 1.15,
                      letterSpacing: "-0.02em",
                      color: "var(--fg)",
                      marginBottom: "1rem",
                    }}
                  >
                    {title}
                  </h1>
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.68rem",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--muted)",
                    }}
                  >
                    {date}
                  </p>
                </header>
                <div style={{ lineHeight: 1.85 }}>{children}</div>
              </article>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .blog-article h2 {
          font-family: var(--font-crimson-text), Georgia, serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--fg);
          margin: 2.75rem 0 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border-light);
          letter-spacing: -0.01em;
          line-height: 1.25;
        }
        .blog-article h3 {
          font-family: var(--font-crimson-text), Georgia, serif;
          font-size: 1.35rem;
          font-weight: 600;
          color: var(--fg);
          margin: 2rem 0 0.75rem;
          line-height: 1.3;
        }
        .blog-article h4 {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          margin: 1.75rem 0 0.5rem;
        }
        .blog-article p {
          font-size: 1.0625rem;
          color: var(--muted);
          margin-bottom: 1.5em;
          max-width: 68ch;
        }
        .blog-article a {
          color: var(--fg);
          text-decoration: none;
          border-bottom: 1px solid var(--border-light);
          transition: border-color 0.15s;
        }
        .blog-article a:hover {
          border-bottom-color: var(--fg);
        }
        .blog-article code {
          font-family: var(--font-mono);
          font-size: 0.85em;
          background: var(--bg-secondary);
          border: 1px solid var(--border-light);
          padding: 0.1em 0.4em;
          color: var(--fg);
        }
        .blog-article pre {
          background: var(--bg-secondary) !important;
          color: var(--fg) !important;
          border: 1px solid var(--border-light);
          padding: 1.25rem 1.5rem;
          overflow-x: auto;
          margin: 1.75rem 0;
          line-height: 1.6;
        }
        .blog-article pre code {
          background: none !important;
          border: none !important;
          padding: 0 !important;
          font-size: 0.875rem;
        }
        .blog-article blockquote {
          border-left: 3px solid var(--border);
          margin: 2rem 0;
          padding: 0.25rem 0 0.25rem 1.5rem;
          color: var(--muted);
          font-style: italic;
        }
        .blog-article blockquote p { margin-bottom: 0; }
        .blog-article ul, .blog-article ol {
          padding-left: 1.5rem;
          margin-bottom: 1.5em;
          color: var(--muted);
          max-width: 68ch;
        }
        .blog-article li { margin-bottom: 0.4em; font-size: 1.0625rem; }
        .blog-article strong { color: var(--fg); font-weight: 600; }
        .blog-article em { font-style: italic; }
        .blog-article hr {
          border: none;
          border-top: 1px solid var(--border-light);
          margin: 2.5rem 0;
        }
        .blog-article img {
          max-width: 100%;
          height: auto;
          border: 1px solid var(--border-light);
          display: block;
          margin: 2rem 0;
        }

        /* Definition content */
        .def-content li { color: var(--muted); font-size: 0.9rem; padding: 0.15em 0; }
        .def-content strong { color: var(--fg); font-weight: 600; }
      `}</style>
    </BlogProvider>
  );
}

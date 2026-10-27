"use client";

import React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteNav, SiteFooter } from "@mtosity/design-system";
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
  /** The standfirst under the headline (the post's excerpt). */
  dek?: string;
  readingMinutes?: number;
}

interface Heading {
  id: string;
  text: string;
  level: number;
}

type SidebarMode = "toc" | "definition" | "code";


function Sidebar({
  headings,
  sidebarMode,
  currentDefinition,
  currentCodeExample,
  onScrollToHeading,
  isTransitioning,
  isClosing,
  activeHeadingId,
}: {
  headings: Heading[];
  sidebarMode: SidebarMode;
  currentDefinition: Definition | null;
  currentCodeExample: CodeExample | null;
  onScrollToHeading: (id: string) => void;
  isTransitioning: boolean;
  isClosing: boolean;
  activeHeadingId: string;
}) {
  const { onClose } = useBlogInteraction();

  if (sidebarMode === "definition") {
    return (
      <div
        className={`rail-panel ${
          isClosing
            ? "animate-definition-exit"
            : isTransitioning
            ? "animate-fade-blur-out"
            : "animate-slide-in-left"
        }`}
      >
        <div className="rail-panel-head">
          <h3 className="rail-panel-title">{currentDefinition?.title}</h3>
          <button onClick={onClose} className="rail-back">
            Contents
          </button>
        </div>
        <div className="rail-panel-body def-content">{currentDefinition?.content}</div>
      </div>
    );
  }

  if (sidebarMode === "code" && currentCodeExample) {
    return (
      <CodeView
        codeExample={currentCodeExample}
        isTransitioning={isTransitioning}
        isClosing={isClosing}
        onClose={onClose}
      />
    );
  }

  if (headings.length === 0) return null;

  return (
    <nav className="rail-toc animate-fade-in-smooth" aria-label="In this article">
      <h3 className="rail-toc-title">In this article</h3>
      <ol>
        {headings.map((heading) => (
          <li key={heading.id} data-level={heading.level > 2 ? "sub" : undefined}>
            <button
              onClick={() => onScrollToHeading(heading.id)}
              aria-current={heading.id === activeHeadingId ? "location" : undefined}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default function BlogLayout({
  title,
  date,
  category,
  children,
  extraDefinitions,
  extraCodeExamples,
  dek,
  readingMinutes,
}: BlogLayoutProps) {
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
    const mq = window.matchMedia("(min-width: 1200px)");
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

  const sidebarProps = {
    headings,
    sidebarMode,
    currentDefinition,
    currentCodeExample,
    isTransitioning,
    isClosing,
    activeHeadingId,
  };
  const railOpen = sidebarMode !== "toc";

  return (
    <BlogProvider
      onInteract={handleDefinitionRequest}
      onCodeExampleInteract={handleCodeExampleRequest}
      onClose={handleBackToToc}
    >
      <SiteNav />
      <main id="main" className="reading">
        <div className="reading-grid frame">
          <article className="blog-article">
            <header className="article-head">
              <h1 className="article-headline">{title}</h1>
              {dek ? <p className="article-dek">{dek}</p> : null}
              <p className="article-byline">
                <span>
                  By <Link href="/">Minh Tam Nguyen</Link>
                </span>
                {category ? (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{category}</span>
                  </>
                ) : null}
                <span aria-hidden="true">·</span>
                <time>{date}</time>
                {readingMinutes ? (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{readingMinutes} min read</span>
                  </>
                ) : null}
              </p>
            </header>
            <div className="article-body">{children}</div>
            <footer className="article-end">
              <p>Thanks for reading.</p>
              <Link href="/blog" className="link">
                Keep reading
              </Link>
            </footer>
          </article>

          {/* Desktop rail: sticky beside the column */}
          <aside className="reading-rail" aria-label="Article tools">
            <Sidebar {...sidebarProps} onScrollToHeading={scrollToHeading} />
          </aside>
        </div>
      </main>

      {/* Phone / tablet: the rail becomes a bottom sheet */}
      <button
        className="reading-sheet-toggle"
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        aria-expanded={!isSidebarCollapsed}
        aria-controls="reading-sheet"
      >
        {isSidebarCollapsed ? (railOpen ? "Show note" : "Contents") : "Done"}
      </button>
      <div
        className={`reading-sheet-scrim${!isSidebarCollapsed ? " is-open" : ""}`}
        onClick={() => setIsSidebarCollapsed(true)}
      />
      <div id="reading-sheet" className={`reading-sheet${!isSidebarCollapsed ? " is-open" : ""}`}>
        <Sidebar
          {...sidebarProps}
          onScrollToHeading={(id) => {
            scrollToHeading(id);
            setIsSidebarCollapsed(true);
          }}
        />
      </div>

      <SiteFooter />
    </BlogProvider>
  );
}

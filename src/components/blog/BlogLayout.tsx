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

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-8 h-[calc(100vh-6rem)] overflow-y-hidden">
        <Link
          href="/blog"
          className="text-blue-500 hover:underline mb-4 inline-block"
        >
          ← Back to Blog
        </Link>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 transition-all duration-300 h-full flex flex-col overflow-hidden">
          {sidebarMode === "definition" && (
            <div
              className={`mb-6 overflow-hidden ${
                isClosing
                  ? "animate-definition-exit"
                  : isTransitioning
                  ? "animate-fade-blur-out"
                  : "animate-slide-in-left"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate pr-2">
                  {currentDefinition?.title}
                </h3>
                <button
                  onClick={onClose}
                  className="text-sm text-blue-500 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors flex items-center gap-1 flex-shrink-0"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back
                </button>
              </div>
              <div className="text-gray-600 dark:text-gray-300 overflow-y-auto break-words text-base">
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
            <div className="mt-auto animate-fade-in-smooth overflow-hidden">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Table of Contents
              </h3>
              <nav className="space-y-2 overflow-y-auto max-h-[calc(100vh-16rem)]">
                {headings.map((heading) => {
                  const isActive = heading.id === activeHeadingId;
                  return (
                    <button
                      key={heading.id}
                      onClick={() => onScrollToHeading(heading.id)}
                      className={`block w-full text-left text-base hover:text-blue-500 dark:hover:text-blue-400 transition-colors break-words ${
                        heading.level === 2
                          ? "font-medium"
                          : "text-gray-600 dark:text-gray-400 ml-4"
                      } ${
                        isActive
                          ? "text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded"
                          : ""
                      }`}
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
    </div>
  );
}

export default function BlogLayout({
  title,
  date,
  category,
  children,
}: BlogLayoutProps) {
  void category; // Suppress unused parameter warning
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>("toc");
  const [currentDefinition, setCurrentDefinition] = useState<Definition | null>(
    null
  );
  const [currentCodeExample, setCurrentCodeExample] =
    useState<CodeExample | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [activeHeadingId, setActiveHeadingId] = useState<string>("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const extractHeadings = () => {
      // Only extract headings from the article content, not the entire page
      const articleElement = document.querySelector("article.prose");
      if (!articleElement) return;

      const headingElements = articleElement.querySelectorAll(
        "h1, h2, h3, h4, h5, h6"
      );
      const headingData: Heading[] = [];

      headingElements.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1));
        const text = heading.textContent || "";
        const id = `heading-${index}`;

        heading.id = id;
        headingData.push({ id, text, level });
      });

      setHeadings(headingData.filter((h) => h.level >= 2)); // Exclude h1 (title)
    };

    // Small delay to ensure content is rendered
    const timer = setTimeout(extractHeadings, 100);
    return () => clearTimeout(timer);
  }, [children]);

  // Scroll listener to highlight active section
  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings
        .map((h) => document.getElementById(h.id))
        .filter(Boolean);

      if (headingElements.length === 0) return;

      // Find the heading that is currently in view
      let activeId = "";
      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i];
        if (element) {
          const rect = element.getBoundingClientRect();
          // Check if heading is in the upper portion of viewport
          if (rect.top <= 100) {
            activeId = element.id;
            break;
          }
        }
      }

      // If no heading is above the viewport, highlight the first one
      if (!activeId && headingElements[0]) {
        const firstRect = headingElements[0].getBoundingClientRect();
        if (firstRect.top > 100) {
          activeId = headingElements[0].id;
        }
      }

      setActiveHeadingId(activeId);
    };

    // Listen for scroll events
    window.addEventListener("scroll", handleScroll);
    // Initial call to set active heading
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleDefinitionRequest = (definitionKey: string, anchorId: string) => {
    void anchorId; // Suppress unused parameter warning
    const definition = definitions[definitionKey];
    if (definition) {
      // Expand sidebar if collapsed on mobile
      if (isSidebarCollapsed) {
        setIsSidebarCollapsed(false);
      }
      
      if (sidebarMode === "definition" && currentDefinition) {
        // If already showing a definition, animate out first
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
    }
  };

  const handleCodeExampleRequest = (codeKey: string, anchorId: string) => {
    void anchorId; // Suppress unused parameter warning
    const codeExample = codeExamples[codeKey];
    if (codeExample) {
      // Expand sidebar if collapsed on mobile
      if (isSidebarCollapsed) {
        setIsSidebarCollapsed(false);
      }
      
      if (sidebarMode === "code" && currentCodeExample) {
        // If already showing a code example, animate out first
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
      <div className="relative">
        <div className="sticky top-4 bg-transparent z-10">
          <SlideTabs />
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-8 relative">
          {/* Mobile Toggle Button */}
          <button
            className="md:hidden fixed top-24 right-4 z-50 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-200"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            aria-label={isSidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
          >
            {isSidebarCollapsed ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Sidebar - Navigation */}
            <div className={`${isSidebarCollapsed ? 'hidden md:block' : 'block'} lg:block`}>
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

            {/* Right Content Area */}
            <div className={`h-[calc(100vh-6rem)] overflow-y-auto ${isSidebarCollapsed ? 'col-span-full' : 'lg:col-span-1'}`}>
              <article className="prose prose-xl max-w-none dark:prose-invert tracking-wide prose-lg">
                <header className="mb-8">
                  <h1 className="text-4xl font-bold mb-4">{title}</h1>
                  <p className="text-gray-500 dark:text-gray-400">{date}</p>
                </header>

                <div className="space-y-6">{children}</div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </BlogProvider>
  );
}

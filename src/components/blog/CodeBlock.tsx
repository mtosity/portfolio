"use client";

import { useEffect, useRef } from "react";

const loadPrism = async () => {
  if (typeof window === "undefined") return null;
  try {
    const Prism = (await import("prismjs")).default;
    await Promise.all(
      [
        "prismjs/components/prism-clike",
        "prismjs/components/prism-javascript",
        "prismjs/components/prism-typescript",
        "prismjs/components/prism-jsx",
        "prismjs/components/prism-tsx",
        "prismjs/components/prism-bash",
        "prismjs/components/prism-json",
        "prismjs/components/prism-css",
        "prismjs/components/prism-markup",
      ].map((lang) => import(/* webpackChunkName: "prism-lang" */ lang).catch(() => {}))
    );
    return Prism;
  } catch {
    return null;
  }
};

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
  variant?: "default" | "error" | "success";
}

const VARIANT_BORDER: Record<string, string> = {
  error:   "2px solid #fca5a5",
  success: "2px solid #86efac",
  default: "1px solid var(--border-light)",
};

export default function CodeBlock({
  code,
  language = "javascript",
  className = "",
  variant = "default",
}: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null);

  // Re-highlight whenever code or language changes
  useEffect(() => {
    let mounted = true;
    const highlight = async () => {
      if (!codeRef.current) return;
      // Reset text so Prism re-processes from scratch
      codeRef.current.textContent = code;
      const Prism = await loadPrism();
      if (Prism && mounted && codeRef.current) {
        Prism.highlightElement(codeRef.current);
      }
    };
    highlight();
    return () => { mounted = false; };
  }, [code, language]);

  return (
    <div
      className={className}
      style={{
        borderLeft: VARIANT_BORDER[variant],
        background: "#2a2836",
        border: `1px solid #3a384a`,
        borderLeftWidth: variant !== "default" ? "3px" : "1px",
        borderLeftColor: variant === "error" ? "#fca5a5" : variant === "success" ? "#86efac" : "#3a384a",
        margin: "0.25rem 0",
        overflow: "hidden",
      }}
    >
      <pre
        style={{
          margin: 0,
          padding: "0.85rem 1rem",
          overflowX: "auto",
          fontSize: "0.78rem",
          lineHeight: 1.6,
          background: "transparent",
        }}
      >
        <code
          ref={codeRef}
          className={`language-${language}`}
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            background: "transparent",
          }}
        >
          {code}
        </code>
      </pre>
    </div>
  );
}

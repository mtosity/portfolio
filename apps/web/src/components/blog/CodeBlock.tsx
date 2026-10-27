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
    <div className={`code-strip code-strip-${variant} ${className}`}>
      <pre>
        <code ref={codeRef} className={`language-${language}`}>
          {code}
        </code>
      </pre>
    </div>
  );
}

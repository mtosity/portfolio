"use client";

import { useEffect, useRef, useState } from "react";

// Dynamic import to avoid SSR issues
const loadPrism = async () => {
  if (typeof window === "undefined") return null;

  try {
    const Prism = (await import("prismjs")).default;

    // Import language components dynamically
    const languageImports = [
      "prismjs/components/prism-clike",
      "prismjs/components/prism-javascript",
      "prismjs/components/prism-typescript",
      "prismjs/components/prism-jsx",
      "prismjs/components/prism-tsx",
      "prismjs/components/prism-bash",
      "prismjs/components/prism-json",
      "prismjs/components/prism-css",
      "prismjs/components/prism-markup",
    ];

    await Promise.all(
      languageImports.map(async (lang) => {
        try {
          await import(/* webpackChunkName: "prism-lang" */ lang);
        } catch {
          // Silently fail if language can't be loaded
        }
      })
    );

    return Prism;
  } catch (error) {
    console.warn("Failed to load Prism.js:", error);
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
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    let mounted = true;

    const highlightCode = async () => {
      if (codeRef.current && !isHighlighted) {
        const Prism = await loadPrism();
        if (Prism && mounted) {
          Prism.highlightElement(codeRef.current);
          setIsHighlighted(true);
        }
      }
    };

    highlightCode();

    return () => {
      mounted = false;
    };
  }, [code, language, isHighlighted]);

  const getVariantClasses = () => {
    switch (variant) {
      case "error":
        return "bg-red-600 dark:bg-gray-900/80 border border-red-200 dark:border-red-900";
      case "success":
        return "bg-green-50 dark:bg-gray-900/80 border border-green-200 dark:border-green-900";
      default:
        return "border border-gray-200 dark:border-gray-700";
    }
  };

  const getCodeVariantClasses = () => {
    switch (variant) {
      // case "error":
      //   return "bg-red-100 dark:bg-red-900/30";
      // case "success":
      //   return "bg-green-100 dark:bg-green-900/30";
      default:
        return "";
    }
  };

  return (
    <div className={`rounded-lg p-4 my-6 ${getVariantClasses()} ${className}`}>
      <pre
        className={`${getCodeVariantClasses()} p-3 rounded text-sm overflow-x-auto`}
      >
        <code
          ref={codeRef}
          className={`language-${language}`}
          style={{
            fontFamily:
              'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            backgroundColor: "transparent",
          }}
        >
          {code}
        </code>
      </pre>
    </div>
  );
}

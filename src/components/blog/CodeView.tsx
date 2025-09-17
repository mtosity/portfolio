"use client";

import React from "react";
import { type CodeExample } from "./definitions";
import CodeBlock from "./CodeBlock";

interface CodeViewProps {
  codeExample: CodeExample;
  isTransitioning: boolean;
  isClosing: boolean;
  onClose: () => void;
}

export default function CodeView({
  codeExample,
  isTransitioning,
  isClosing,
  onClose,
}: CodeViewProps) {
  return (
    <div
      className={`h-full flex flex-col overflow-hidden ${
        isClosing
          ? "animate-definition-exit"
          : isTransitioning
          ? "animate-fade-blur-out"
          : "animate-slide-in-left"
      }`}
    >
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate pr-2">
          {codeExample.title}
        </h3>
        <button
          onClick={onClose}
          className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 transition-colors flex items-center gap-1 flex-shrink-0"
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

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 break-words flex-shrink-0">
        {codeExample.description}
      </p>

      <div className="space-y-4 flex-1 overflow-y-auto min-h-0 pb-12">
        {codeExample.wrongCode && (
          <div>
            <h4 className="text-red-800 dark:text-red-200 font-semibold mb-2 text-sm">
              ❌ Wrong Approach
            </h4>
            <CodeBlock
              code={codeExample.wrongCode.code}
              language={codeExample.wrongCode.language}
              variant="error"
            />
            <p className="text-xs text-red-700 dark:text-red-300 mt-2 break-words">
              {codeExample.wrongCode.explanation}
            </p>
          </div>
        )}

        {codeExample.correctCode && (
          <div>
            <h4 className="text-green-800 dark:text-green-200 font-semibold mb-2 text-sm">
              ✅ Correct Approach
            </h4>
            <CodeBlock
              code={codeExample.correctCode.code}
              language={codeExample.correctCode.language}
              variant="success"
            />
            <p className="text-xs text-green-700 dark:text-green-300 mt-2 break-words">
              {codeExample.correctCode.explanation}
            </p>
          </div>
        )}

        {codeExample.alternativeCode && (
          <div>
            <h4 className="text-blue-800 dark:text-blue-200 font-semibold mb-2 text-sm">
              💡 Alternative Approach
            </h4>
            <CodeBlock
              code={codeExample.alternativeCode.code}
              language={codeExample.alternativeCode.language}
            />
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-2 break-words">
              {codeExample.alternativeCode.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

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
  const blocks = [
    { key: "wrong", label: "Wrong approach", tone: "error" as const, data: codeExample.wrongCode },
    { key: "correct", label: "Correct approach", tone: "success" as const, data: codeExample.correctCode },
    { key: "alt", label: "Alternative", tone: "default" as const, data: codeExample.alternativeCode },
  ];

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
        <h3 className="rail-panel-title">{codeExample.title}</h3>
        <button onClick={onClose} className="rail-back">
          Contents
        </button>
      </div>
      <p className="rail-panel-lede">{codeExample.description}</p>

      <div className="rail-panel-body">
        {blocks.map(({ key, label, tone, data }) =>
          data ? (
            <div key={key} className="code-example">
              <h4 className={`code-example-label code-example-${tone}`}>{label}</h4>
              <CodeBlock code={data.code} language={data.language} variant={tone} />
              <p className="code-example-note">{data.explanation}</p>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}

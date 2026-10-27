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
      className={`${
        isClosing
          ? "animate-definition-exit"
          : isTransitioning
          ? "animate-fade-blur-out"
          : "animate-slide-in-left"
      }`}
      style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}
    >
      <div className="rail-panel-head">
        <h3 className="rail-panel-title">{codeExample.title}</h3>
        <button onClick={onClose} className="rail-back">
          Back
        </button>
      </div>

      <p className="rail-panel-lede">{codeExample.description}</p>

      <div className="rail-panel-body">
        {codeExample.wrongCode && (
          <div>
            <h4 className="code-example-label code-example-error">✗ Wrong approach</h4>
            <CodeBlock
              code={codeExample.wrongCode.code}
              language={codeExample.wrongCode.language}
              variant="error"
            />
            <p className="code-example-note">
              {codeExample.wrongCode.explanation}
            </p>
          </div>
        )}

        {codeExample.correctCode && (
          <div>
            <h4 className="code-example-label code-example-success">✓ Correct approach</h4>
            <CodeBlock
              code={codeExample.correctCode.code}
              language={codeExample.correctCode.language}
              variant="success"
            />
            <p className="code-example-note">
              {codeExample.correctCode.explanation}
            </p>
          </div>
        )}

        {codeExample.alternativeCode && (
          <div>
            <h4 className="code-example-label code-example-default">→ Alternative</h4>
            <CodeBlock
              code={codeExample.alternativeCode.code}
              language={codeExample.alternativeCode.language}
            />
            <p className="code-example-note">
              {codeExample.alternativeCode.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

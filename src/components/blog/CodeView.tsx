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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "0.75rem",
          flexShrink: 0,
          gap: "0.5rem",
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
          {codeExample.title}
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
        style={{
          borderTop: "1px solid var(--border-light)",
          paddingTop: "0.75rem",
          marginBottom: "1rem",
          flexShrink: 0,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            lineHeight: 1.6,
            color: "var(--muted)",
          }}
        >
          {codeExample.description}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", flex: 1, overflowY: "auto", minHeight: 0, paddingBottom: "3rem" }}>
        {codeExample.wrongCode && (
          <div>
            <h4
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#b91c1c",
                marginBottom: "0.5rem",
              }}
            >
              ✗ Wrong Approach
            </h4>
            <CodeBlock
              code={codeExample.wrongCode.code}
              language={codeExample.wrongCode.language}
              variant="error"
            />
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                lineHeight: 1.5,
                color: "var(--muted)",
                marginTop: "0.5rem",
              }}
            >
              {codeExample.wrongCode.explanation}
            </p>
          </div>
        )}

        {codeExample.correctCode && (
          <div>
            <h4
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#166534",
                marginBottom: "0.5rem",
              }}
            >
              ✓ Correct Approach
            </h4>
            <CodeBlock
              code={codeExample.correctCode.code}
              language={codeExample.correctCode.language}
              variant="success"
            />
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                lineHeight: 1.5,
                color: "var(--muted)",
                marginTop: "0.5rem",
              }}
            >
              {codeExample.correctCode.explanation}
            </p>
          </div>
        )}

        {codeExample.alternativeCode && (
          <div>
            <h4
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: "0.5rem",
              }}
            >
              → Alternative
            </h4>
            <CodeBlock
              code={codeExample.alternativeCode.code}
              language={codeExample.alternativeCode.language}
            />
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                lineHeight: 1.5,
                color: "var(--muted)",
                marginTop: "0.5rem",
              }}
            >
              {codeExample.alternativeCode.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

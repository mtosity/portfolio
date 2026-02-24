"use client";

import React, { useState } from "react";
import { useBlogInteraction } from "./BlogContext";

interface CodeAnchorProps {
  text: string;
  codeKey: string;
}

function CodeAnchor({ text, codeKey }: CodeAnchorProps) {
  const { activeCodeExample, onCodeExampleInteract, onClose } = useBlogInteraction();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [wasActive, setWasActive] = useState(false);

  // Create unique ID for this anchor instance
  const anchorId = `${codeKey}-${text
    .replace(/\s+/g, "-")
    .toLowerCase()}`;
  const isClicked = activeCodeExample === anchorId;

  // Track when this anchor was active and handle closing animation
  React.useEffect(() => {
    if (isClicked && !wasActive) {
      // Anchor just became active
      setWasActive(true);
    } else if (!isClicked && wasActive) {
      // Anchor was active but now isn't (either another anchor opened or TOC restored)
      setIsClosing(true);
      setWasActive(false);
      setTimeout(() => {
        setIsClosing(false);
      }, 300);
    }
  }, [isClicked, wasActive]);

  const handleClick = () => {
    if (isClicked) return;

    setIsAnimating(true);

    // Call onCodeExampleInteract immediately to show content, then handle animation separately
    onCodeExampleInteract(codeKey, anchorId);

    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  const handleClose = () => {
    if (!isClicked) return;

    setIsClosing(true);
    onClose(); // Close sidebar immediately

    // Animate back to original state
    setTimeout(() => {
      setIsClosing(false);
    }, 300);
  };

  return (
    <span className="relative inline-block">
      <span
        className={`relative inline-flex items-center transition-all duration-300 ease-in-out leading-relaxed ${
          isClicked
            ? "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-1.5 py-0 rounded-full"
            : "hover:bg-purple-50 dark:hover:bg-purple-950 rounded px-1"
        } ${isClosing ? "animate-pulse" : ""}`}
      >
        <span
          className={`font-medium transition-all duration-300 ${
            isClicked
              ? "text-purple-800 dark:text-purple-200"
              : "text-purple-600 dark:text-purple-400"
          }`}
        >
          {text}
        </span>

        {/* Code Icon Button (when not clicked) */}
        {!isClicked && (
          <button
            onClick={handleClick}
            className={`ml-1 transition-all duration-300 ease-in-out w-5 h-5 opacity-70 hover:opacity-100 scale-100`}
            aria-label={`View code example for ${text}`}
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              width="20"
              height="20"
              className={`w-full h-full transition-all duration-300 ${
                isAnimating ? "animate-pulse" : ""
              } text-purple-600 dark:text-purple-400`}
            >
              <path
                fillRule="evenodd"
                d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}

        {/* Close Button (when clicked) */}
        {isClicked && (
          <button
            onClick={handleClose}
            className={`ml-2 transition-all duration-300 ease-in-out w-4 h-4 opacity-70 hover:opacity-100 text-purple-600 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-100`}
            aria-label={`Close ${text} code example`}
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              width="16"
              height="16"
              className="w-full h-full"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}

        {/* Animation Overlay */}
        {isAnimating && (
          <span className="absolute inset-0 bg-purple-100 dark:bg-purple-900 rounded-full animate-expand-pill" />
        )}
        {isClosing && (
          <span className="absolute inset-0 bg-purple-100 dark:bg-purple-900 rounded-full animate-collapse-pill" />
        )}
      </span>
    </span>
  );
}

export default CodeAnchor;
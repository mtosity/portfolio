"use client";

import React, { useState } from "react";
import { useBlogInteraction } from "./BlogContext";

interface InteractiveAnchorProps {
  text: string;
  definitionKey: string;
}

function InteractiveAnchor({ text, definitionKey }: InteractiveAnchorProps) {
  const { activeAnchor, onInteract, onClose } = useBlogInteraction();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [wasActive, setWasActive] = useState(false);

  // Create unique ID for this anchor instance
  const anchorId = `${definitionKey}-${text
    .replace(/\s+/g, "-")
    .toLowerCase()}`;
  const isClicked = activeAnchor === anchorId;

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
    console.log('InteractiveAnchor clicked:', { text, definitionKey, anchorId, isClicked });
    if (isClicked) return;

    setIsAnimating(true);

    // Call onInteract immediately to show content, then handle animation separately
    console.log('Calling onInteract with:', definitionKey, anchorId);
    onInteract(definitionKey, anchorId);

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
            ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-1.5 py-0 rounded-full"
            : "hover:bg-blue-50 dark:hover:bg-blue-950 rounded px-1"
        } ${isClosing ? "animate-pulse" : ""}`}
      >
        <span
          className={`font-medium transition-all duration-300 ${
            isClicked
              ? "text-blue-800 dark:text-blue-200"
              : "text-blue-500 dark:text-blue-400"
          }`}
        >
          {text}
        </span>

        {/* Info Button (when not clicked) */}
        {!isClicked && (
          <button
            onClick={handleClick}
            className={`ml-1 transition-all duration-300 ease-in-out w-5 h-5 opacity-70 hover:opacity-100 scale-100`}
            aria-label={`Learn more about ${text}`}
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              width="20"
              height="20"
              className={`w-full h-full transition-all duration-300 ${
                isAnimating ? "animate-pulse" : ""
              } text-blue-500 dark:text-blue-400`}
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}

        {/* Close Button (when clicked) */}
        {isClicked && (
          <button
            onClick={handleClose}
            className={`ml-2 transition-all duration-300 ease-in-out w-4 h-4 opacity-70 hover:opacity-100 text-blue-500 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100`}
            aria-label={`Close ${text} definition`}
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
          <span className="absolute inset-0 bg-blue-100 dark:bg-blue-900 rounded-full animate-expand-pill" />
        )}
        {isClosing && (
          <span className="absolute inset-0 bg-blue-100 dark:bg-blue-900 rounded-full animate-collapse-pill" />
        )}
      </span>
    </span>
  );
}

export default InteractiveAnchor;

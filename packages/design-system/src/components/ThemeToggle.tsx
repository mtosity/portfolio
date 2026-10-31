"use client";
import React from "react";

const STORAGE_KEY = "theme";

/* Appearance switch. The site follows the OS appearance until someone
   presses this; the choice is then remembered. The current theme lives on
   document.documentElement.dataset.theme (set pre-paint by the inline
   script in the web app's root layout); the sun/moon icons swap via the
   .theme-toggle-* CSS rules in tokens.css, so this component is
   stateless and hydration-safe. */
export const ThemeToggle = () => {
  const toggle = () => {
    const next =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private browsing / blocked storage — theme still applies for this page.
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      className="link-hover ds-theme-toggle"
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        width: 36,
        height: 36,
        borderRadius: 9999,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Moon — shown in light mode (click for dark) */}
      <svg
        className="theme-toggle-moon"
        width="17"
        height="17"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M16.5 12.5A7 7 0 0 1 7.5 3.5a7 7 0 1 0 9 9Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
      {/* Sun — shown in dark mode (click for light) */}
      <svg
        className="theme-toggle-sun"
        width="17"
        height="17"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="10" cy="10" r="3.6" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M10 1.5v2M10 16.5v2M18.5 10h-2M3.5 10h-2M16 4l-1.4 1.4M5.4 14.6 4 16M16 16l-1.4-1.4M5.4 5.4 4 4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
};

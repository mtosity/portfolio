"use client";
import React from "react";

const STORAGE_KEY = "theme";

/* Theme switch button. The current theme lives on
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
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "var(--muted)",
        padding: "0.25rem",
        display: "flex",
        alignItems: "center",
        transition: "color 0.15s",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.color = "var(--fg)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.color = "var(--muted)")
      }
    >
      {/* Moon — shown in light mode (click for dark) */}
      <svg
        className="theme-toggle-moon"
        width="18"
        height="18"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M16.5 12.5A7 7 0 0 1 7.5 3.5a7 7 0 1 0 9 9Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      {/* Sun — shown in dark mode (click for light) */}
      <svg
        className="theme-toggle-sun"
        width="18"
        height="18"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M10 1.5v2M10 16.5v2M18.5 10h-2M3.5 10h-2M16 4l-1.4 1.4M5.4 14.6 4 16M16 16l-1.4-1.4M5.4 5.4 4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
};

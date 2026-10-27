"use client";
import React from "react";

const STORAGE_KEY = "theme";

/* Switches the theme. When the browser can, the new theme spreads out as
   a circle from the point that was clicked (the toggle, or the lamp on
   the home page's desk), so the change reads as cause and effect rather
   than a flash. Reduced motion gets the plain swap. */
export function switchTheme(origin?: { x: number; y: number }) {
  const root = document.documentElement;
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  const apply = () => {
    root.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private browsing / blocked storage — theme still applies for this page.
    }
  };
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!doc.startViewTransition || reduce) return apply();
  const x = origin?.x ?? window.innerWidth - 40;
  const y = origin?.y ?? 32;
  root.style.setProperty("--vt-x", `${x}px`);
  root.style.setProperty("--vt-y", `${y}px`);
  doc.startViewTransition(apply);
}

/* The current theme lives on document.documentElement.dataset.theme (set
   pre-paint by the inline script in the web app's root layout); the
   sun/moon icons swap via the .theme-toggle-* CSS rules in tokens.css, so
   this component is stateless and hydration-safe. */
export const ThemeToggle = () => (
  <button
    onClick={(e) => {
      const r = e.currentTarget.getBoundingClientRect();
      switchTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    }}
    aria-label="Switch between light and dark"
    title="Lights on / off"
    className="link-hover theme-toggle"
  >
    <svg className="theme-toggle-moon" width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M16.5 12.5A7 7 0 0 1 7.5 3.5a7 7 0 1 0 9 9Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
    <svg className="theme-toggle-sun" width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
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

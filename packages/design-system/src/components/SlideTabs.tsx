/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { useIsMobile } from "../hooks/useMediaQuery";

declare global {
  interface Window {
    confetti: any;
  }
}

const NAV_LINKS = [
  { label: "About", href: "/" },
  { label: "Photos", href: "/photography" },
  { label: "Writing", href: "/blog" },
  { label: "Tools", href: "/tools" },
  { label: "Design System", href: "/design-system" },
];

const pillSpring = { type: "spring", stiffness: 520, damping: 42, mass: 0.9 } as const;

const isCurrent = (pathname: string | null, href: string) =>
  href === "/" ? pathname === "/" : !!pathname?.startsWith(href);

/* The site's navigation layer: a glass bar (the only translucent surface,
   per HIG › Materials) with a capsule that slides to whichever link the
   pointer is over and settles back on the current page. */
export const SlideTabs = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const router = useRouter();
  const pathname = usePathname();

  const currentIdx = NAV_LINKS.findIndex((l) => isCurrent(pathname, l.href));
  const pillIdx = hovered ?? currentIdx;

  const fireConfetti = () => {
    if (typeof window !== "undefined" && window.confetti) {
      window.confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.1 },
        colors: ["#9a3fd1", "#bf5af2", "#ffffff", "#34c759", "#ff9500"],
      });
    }
  };

  const handleLogoClick = () => {
    fireConfetti();
    router.push("/");
  };

  return (
    <nav className="ds-nav" aria-label="Main">
      <button onClick={handleLogoClick} className="ds-nav-logo" aria-label="MTosity, home">
        MTosity
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {!isMobile && (
          <ul className="ds-nav-links" onMouseLeave={() => setHovered(null)}>
            {NAV_LINKS.map((link, i) => (
              <li key={link.label} style={{ position: "relative" }}>
                {pillIdx === i && (
                  <motion.span
                    layoutId="ds-nav-pill"
                    className="ds-nav-pill"
                    transition={pillSpring}
                    aria-hidden
                  />
                )}
                <Link
                  href={link.href}
                  className="ds-nav-link"
                  aria-current={currentIdx === i ? "page" : undefined}
                  onMouseEnter={() => setHovered(i)}
                  onFocus={() => setHovered(i)}
                  onBlur={() => setHovered(null)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <ThemeToggle />

        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="ds-nav-icon"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path d="M3.5 7h13M3.5 13h13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Mobile menu — a glass sheet that drops from the bar */}
      <AnimatePresence>
        {isMobile && menuOpen && (
          <motion.div
            className="ds-nav-sheet"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 36 }}
          >
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {NAV_LINKS.map((link, i) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="ds-nav-sheet-row"
                    aria-current={currentIdx === i ? "page" : undefined}
                  >
                    {link.label}
                    {currentIdx === i && (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                        <path d="M3 8.5l3.2 3L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

    </nav>
  );
};

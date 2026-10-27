/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

declare global {
  interface Window {
    confetti: any;
  }
}

export const NAV_LINKS = [
  { label: "Work", href: "/#work" },
  { label: "Writing", href: "/blog" },
  { label: "Photos", href: "/photography" },
  { label: "Tools", href: "/tools" },
  { label: "System", href: "/design-system" },
];

function isCurrent(pathname: string, href: string) {
  if (href.startsWith("/#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/* The site's top bar: wordmark, five plain links, the theme switch.

   - `overlay` lets the bar sit transparent over a full-bleed first
     screen (home scene, photo hero) until the page scrolls.
   - The bar tucks away while reading downward and returns the moment
     the reader scrolls up — it never covers a paragraph mid-read.
   - Phones get a full-height sheet of large links. */
export const SiteNav = ({ overlay = false }: { overlay?: boolean }) => {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      // A small dead zone keeps trackpad jitter from flickering the bar.
      if (Math.abs(y - lastY.current) > 6) {
        setHidden(y > lastY.current && y > 240);
        lastY.current = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    sheetRef.current?.querySelector("a")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const onWordmark = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined" && window.confetti) {
      window.confetti({ particleCount: 90, spread: 70, origin: { x: 0.08, y: 0.06 } });
    }
    setOpen(false);
    router.push("/");
  };

  const state = [
    "site-nav",
    overlay && !scrolled && !open ? "is-overlay" : "",
    hidden && !open ? "is-hidden" : "",
    open ? "is-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={state}>
      <a href="#main" className="site-nav-skip">
        Skip to content
      </a>
      <div className="site-nav-bar frame">
        <Link href="/" className="site-nav-mark" onClick={onWordmark} aria-label="MTosity, home">
          MTosity
        </Link>

        <nav aria-label="Primary" className="site-nav-links">
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isCurrent(pathname, link.href) ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-nav-end">
          <ThemeToggle />
          <button
            type="button"
            className="site-nav-menu"
            aria-expanded={open}
            aria-controls="site-nav-sheet"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      <div
        id="site-nav-sheet"
        ref={sheetRef}
        className="site-nav-sheet"
        hidden={!open}
      >
        <ul>
          {NAV_LINKS.map((link, i) => (
            <li key={link.href} style={{ "--i": i } as React.CSSProperties}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={isCurrent(pathname, link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

/** v0 name, kept so existing pages keep working. */
export const SlideTabs = SiteNav;

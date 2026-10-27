import React from "react";
import Link from "next/link";

const ELSEWHERE = [
  { label: "Email", href: "mailto:mtosity@gmail.com" },
  { label: "GitHub", href: "https://github.com/mtosity" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/mtosity/" },
];

const PAGES = [
  { label: "Writing", href: "/blog" },
  { label: "Notes", href: "/notes" },
  { label: "Photos", href: "/photography" },
  { label: "Tools", href: "/tools" },
  { label: "Design system", href: "/design-system" },
];

/* The close of every page: the name returns at full width, with the
   ways to reach me and the rest of the site underneath. */
export const SiteFooter = ({ note }: { note?: React.ReactNode }) => (
  <footer className="site-footer">
    <div className="frame">
      <p className="site-footer-name display" aria-hidden="true">
        Minh Tam Nguyen
      </p>
      <div className="site-footer-grid">
        <p className="site-footer-note">
          {note ?? (
            <>
              Built by hand in Next.js, one detail at a time.
              <br />
              Software engineer in the United States.
            </>
          )}
        </p>
        <nav aria-label="Elsewhere">
          <ul>
            {ELSEWHERE.map((l) => (
              <li key={l.href}>
                <a className="link-hover" href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Pages">
          <ul>
            {PAGES.map((l) => (
              <li key={l.href}>
                <Link className="link-hover" href={l.href}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="site-footer-meta">© {new Date().getFullYear()} MTosity</p>
      </div>
    </div>
  </footer>
);

"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import { Button } from "@mtosity/design-system";
import { HERO_LINE, projects } from "../data";
import type { DeskKey, DeskTarget } from "./desk";

export interface HeroPhoto {
  id: string;
  src: string;
}

/* Where each object on the desk leads. The same list renders as plain
   links under the model, so everything is reachable by keyboard and
   without WebGL; focusing a link lifts its object. */
const DOORS: { key: DeskKey; label: string; href: string }[] = [
  { key: "laptop", label: "Projects", href: "#work" },
  { key: "notebook", label: "Writing", href: "/blog" },
  { key: "camera", label: "Photos", href: "/photography" },
  { key: "toolbox", label: "Tools", href: "/tools" },
  { key: "plant", label: "Notes", href: "/notes" },
  { key: "baymax", label: "About", href: "#about" },
];

function toggleTheme() {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {
    // Storage blocked: the switch still applies for this visit.
  }
}

/* First screen: the name and what I do beside a small clay model of
   the desk it all happens at. The model is the page's one live thing. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Hero = (_props: { photos: HeroPhoto[] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const deskRef = useRef<{ focus: (k: DeskKey | null) => void } | null>(null);
  const router = useRouter();
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [target, setTarget] = useState<DeskTarget | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const label = labelRef.current;
    if (!canvas || !label) return;
    let disposed = false;
    let handle: { dispose: () => void; focus: (k: DeskKey | null) => void } | null = null;
    import("./desk")
      .then(({ createDesk }) => {
        if (disposed) return;
        try {
          handle = createDesk({
            canvas,
            label,
            screens: projects.filter((p) => p.imgSrc.startsWith("/")).map((p) => p.imgSrc),
            reducedMotion: !!reduce,
            onHover: setTarget,
            onSelect: (k) => {
              if (k === "lamp") return toggleTheme();
              if (k === "mug") return void (window.location.href = "mailto:mtosity@gmail.com");
              const door = DOORS.find((d) => d.key === k);
              if (!door) return;
              if (door.href.startsWith("#")) {
                document.querySelector(door.href)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
              } else router.push(door.href);
            },
            onReady: () => setReady(true),
          });
          deskRef.current = handle;
        } catch {
          setFailed(true);
        }
      })
      .catch(() => setFailed(true));
    return () => {
      disposed = true;
      deskRef.current = null;
      handle?.dispose();
    };
  }, [reduce, router]);

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-stage" data-ready={ready || undefined} data-failed={failed || undefined}>
        {!failed && <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />}
        <div ref={labelRef} className="hero-label" data-show={target ? true : undefined} aria-hidden="true">
          {target && (
            <>
              <strong>{target.label}</strong>
              <span>{target.sub}</span>
            </>
          )}
        </div>
      </div>

      <div className="hero-copy frame">
        <h1 id="hero-title" className="hero-title display">
          Minh Tam Nguyen
        </h1>
        <p className="hero-line">{HERO_LINE}</p>
        <div className="hero-actions">
          <Button href="mailto:mtosity@gmail.com">Say hello</Button>
          <Button href="#work" variant="quiet">
            See what I&apos;ve built
          </Button>
        </div>
      </div>

      <nav className="hero-doors frame" aria-label="On the desk">
        <p className="hero-aside">Everything on the desk goes somewhere — try the lamp.</p>
        <ul>
          {DOORS.map((d) => (
            <li key={d.key}>
              <a
                href={d.href}
                onFocus={() => deskRef.current?.focus(d.key)}
                onBlur={() => deskRef.current?.focus(null)}
                onMouseEnter={() => deskRef.current?.focus(d.key)}
                onMouseLeave={() => deskRef.current?.focus(null)}
              >
                {d.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
};

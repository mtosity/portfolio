"use client";
import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SectionHeader } from "@mtosity/design-system";
import { projects, slugOf, type Project } from "./data";
import { ProjectSheet } from "./ProjectSheet";

/* Recent work gets room; the 2020 projects get a line each. The recent
   frames are placed by hand — different sizes, a little tilt, a little
   drop — the way you'd pin prints to a wall, not tile them. */
const recent = projects.filter((p) => Number(p.year) >= 2021);
const earlier = projects.filter((p) => Number(p.year) < 2021);

function Frame({ p, sizes, priority }: { p: Project; sizes: string; priority?: boolean }) {
  const [broken, setBroken] = useState(false);
  return (
    <span className="work-frame" data-broken={broken || undefined}>
      {broken ? (
        <span className="work-frame-fallback" aria-hidden="true">
          {p.title}
        </span>
      ) : (
        <Image src={p.imgSrc} alt="" fill sizes={sizes} priority={priority} onError={() => setBroken(true)} />
      )}
    </span>
  );
}

export const Work = () => {
  const [open, setOpen] = useState<Project | null>(null);
  const reduce = useReducedMotion();

  return (
    <section id="work" className="home-section frame work">
      <SectionHeader title="Things I've built" aside={`${projects.length} projects since 2020`} />

      <ul className="work-wall">
        {recent.map((p, i) => (
          <motion.li
            key={p.title}
            id={`project-${slugOf(p.title)}`}
            className={`work-pin work-pin-${i + 1}`}
            initial={reduce ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: (i % 2) * 0.08, ease: [0.23, 1, 0.32, 1] }}
          >
            <button type="button" className="work-card" onClick={() => setOpen(p)} aria-haspopup="dialog">
              <Frame p={p} sizes={i < 2 ? "(max-width: 760px) 100vw, 60vw" : "(max-width: 760px) 100vw, 40vw"} />
              <span className="work-text">
                <span className="work-title">{p.title}</span>
                <span className="work-meta">
                  {p.year} · {p.tech.slice(0, 3).join(", ")}
                </span>
                <span className="work-desc">{p.description}</span>
              </span>
            </button>
          </motion.li>
        ))}
      </ul>

      <div className="work-earlier">
        <h3 className="work-earlier-title">Before that, in 2020</h3>
        <ul>
          {earlier.map((p) => (
            <li key={p.title} id={`project-${slugOf(p.title)}`}>
              <button type="button" className="work-line" onClick={() => setOpen(p)} aria-haspopup="dialog">
                <Frame p={p} sizes="96px" />
                <span className="work-line-title">{p.title}</span>
                <span className="work-line-desc">{p.description}</span>
                <span className="work-line-tech">{p.tech.slice(0, 3).join(", ")}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <ProjectSheet project={open} onClose={() => setOpen(null)} />
    </section>
  );
};

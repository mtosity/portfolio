"use client";
import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SectionHeader } from "@mtosity/design-system";
import { projects, slugOf, type Project } from "./data";
import { ProjectSheet } from "./ProjectSheet";

/* Selected work as a wall of frames: the two most recent run large, the
   rest three across. Every frame is a real screenshot; opening one shows
   the project's notes and links. */
export const Work = () => {
  const [open, setOpen] = useState<Project | null>(null);
  const reduce = useReducedMotion();

  return (
    <section id="work" className="home-section frame work">
      <SectionHeader title="Projects" aside={`${projects.length} projects, 2020–2024`} />
      <ul className="work-grid">
        {projects.map((p, i) => (
          <motion.li
            key={p.title}
            id={`project-${slugOf(p.title)}`}
            className={i < 2 ? "work-item is-lead" : "work-item"}
            initial={reduce ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, delay: (i % 3) * 0.07, ease: [0.23, 1, 0.32, 1] }}
          >
            <button type="button" className="work-card" onClick={() => setOpen(p)} aria-haspopup="dialog">
              <span className="work-frame">
                <Image
                  src={p.imgSrc}
                  alt=""
                  fill
                  sizes={i < 2 ? "(max-width: 760px) 100vw, 50vw" : "(max-width: 760px) 100vw, 33vw"}
                />
              </span>
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
      <ProjectSheet project={open} onClose={() => setOpen(null)} />
    </section>
  );
};

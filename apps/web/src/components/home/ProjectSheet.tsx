"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Project } from "./data";

/* A project's notes, opened over the page. Esc and the backdrop close it;
   focus moves in on open and back to the card on close. */
export const ProjectSheet = ({ project, onClose }: { project: Project | null; onClose: () => void }) => {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project) return;
    const returnTo = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      returnTo?.focus?.();
    };
  }, [project, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          key="sheet"
          className="sheet-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="sheet-title"
            className="sheet"
            initial={reduce ? false : { y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? undefined : { y: 24, opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.32, 0.72, 0, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sheet-media">
              <Image src={project.imgSrc} alt={`Screenshot of ${project.title}`} fill sizes="(max-width: 900px) 100vw, 860px" priority />
            </div>
            <div className="sheet-body">
              <div className="sheet-head">
                <h2 id="sheet-title" className="display">{project.title}</h2>
                <button className="sheet-close" onClick={onClose}>
                  Close
                </button>
              </div>
              <p className="sheet-meta">
                {project.year} · {project.tech.join(", ")}
              </p>
              <div className="sheet-notes">{project.modalContent}</div>
              <div className="sheet-links">
                <a className="ds-button" href={project.projectLink} target="_blank" rel="noreferrer">
                  Live project
                </a>
                <a className="ds-button ds-button-quiet" href={project.code} target="_blank" rel="noreferrer">
                  Source code
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

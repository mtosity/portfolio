"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ProjectModal } from "./ProjectModal";
import styles from "./projects.module.scss";

interface Props {
  modalContent: JSX.Element;
  description: string;
  projectLink: string;
  imgSrc: string;
  tech: string[];
  title: string;
  code: string;
  index: number;
  year?: string;
}

export const Project = ({
  modalContent,
  projectLink,
  description,
  imgSrc,
  title,
  code,
  tech,
  index,
  year,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });

  const numStr = String(index).padStart(3, "0");

  // Alternate wipe direction: odd from left, even from right
  const fromLeft = index % 2 !== 0;
  const clipHidden = fromLeft
    ? "inset(0 100% 0 0)"
    : "inset(0 0 0 100%)";
  const clipVisible = "inset(0 0% 0 0%)";

  return (
    <>
      <div ref={ref} style={{ overflow: "hidden" }}>
        <motion.div
          className={styles.projectRow}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => setIsOpen(true)}
          style={{
            background: hovered ? "var(--accent)" : "transparent",
            cursor: "pointer",
          }}
          initial={{ clipPath: clipHidden }}
          animate={
            isInView
              ? { clipPath: clipVisible }
              : { clipPath: clipHidden }
          }
          transition={{
            duration: 0.8,
            ease: [0.65, 0, 0.35, 1],
          }}
        >
          {/* Number slides in from the opposite side */}
          <motion.span
            className={styles.projectNum}
            initial={{ opacity: 0, x: fromLeft ? -30 : 30 }}
            animate={
              isInView
                ? { opacity: 1, x: 0 }
                : { opacity: 0, x: fromLeft ? -30 : 30 }
            }
            transition={{
              duration: 0.5,
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {numStr}
          </motion.span>

          <div className={styles.projectMain}>
            {/* Title row fades up */}
            <motion.div
              className={styles.projectTop}
              initial={{ opacity: 0, y: 15 }}
              animate={
                isInView
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 15 }
              }
              transition={{
                duration: 0.5,
                delay: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span className={styles.projectTitle}>{title.toUpperCase()}</span>
              <span className={styles.projectTech}>{tech.join(" · ")}</span>
              {year && <span className={styles.projectYear}>[{year}]</span>}
            </motion.div>

            {/* Description fades up with more delay */}
            <motion.p
              className={styles.projectDesc}
              initial={{ opacity: 0, y: 10 }}
              animate={
                isInView
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 10 }
              }
              transition={{
                duration: 0.5,
                delay: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {description}
            </motion.p>

            {/* Links fade in last */}
            <motion.div
              className={styles.projectLinks}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.6,
                ease: "easeOut",
              }}
            >
              <Link
                href={code}
                target="_blank"
                rel="nofollow"
                className={styles.projectLink}
              >
                GitHub ↗
              </Link>
              <Link
                href={projectLink}
                target="_blank"
                rel="nofollow"
                className={styles.projectLink}
              >
                Live ↗
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <ProjectModal
        modalContent={modalContent}
        projectLink={projectLink}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        imgSrc={imgSrc}
        title={title}
        code={code}
        tech={tech}
      />
    </>
  );
};

"use client";
import { useState } from "react";
import Link from "next/link";
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

  const numStr = String(index).padStart(3, "0");

  return (
    <>
      <div
        className={styles.projectRow}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setIsOpen(true)}
        style={{
          background: hovered ? "var(--accent)" : "transparent",
          cursor: "pointer",
        }}
      >
        <span className={styles.projectNum}>{numStr}</span>

        <div className={styles.projectMain}>
          <div className={styles.projectTop}>
            <span className={styles.projectTitle}>{title.toUpperCase()}</span>
            <span className={styles.projectTech}>{tech.join(" · ")}</span>
            {year && <span className={styles.projectYear}>[{year}]</span>}
          </div>
          <p className={styles.projectDesc}>{description}</p>
          <div className={styles.projectLinks} onClick={(e) => e.stopPropagation()}>
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
          </div>
        </div>
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

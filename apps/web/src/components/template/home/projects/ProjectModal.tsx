"use client";
import type { JSX } from "react";
import styles from "./projectmodal.module.scss";
import { useEffect } from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import Link from "next/link";
import { AiFillGithub, AiOutlineExport } from "react-icons/ai";
import { MdClose } from "react-icons/md";
import Image from "next/image";
interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  title: string;
  imgSrc: string;
  code: string;
  projectLink: string;
  tech: string[];
  modalContent: JSX.Element;
}

export const ProjectModal = ({
  modalContent,
  projectLink,
  setIsOpen,
  imgSrc,
  isOpen,
  title,
  code,
  tech,
}: Props) => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const body = document.querySelector("body");

    if (isOpen) {
      body!.style.overflowY = "hidden";
    } else {
      body!.style.overflowY = "scroll";
    }
  }, [isOpen]);

  const content = (
    <div className={styles.modal} onClick={() => setIsOpen(false)}>
      <button className={styles.closeModalBtn} aria-label="Close">
        <MdClose />
      </button>

      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        onClick={(e) => e.stopPropagation()}
        className={styles.modalCard}
      >
        <Image
          priority
          src={imgSrc}
          alt={`An image of the ${title} project.`}
          width={500}
          height={400}
          className={styles.modalImage}
        />
        {/* <img
          className={styles.modalImage}
          src={imgSrc}
          alt={`An image of the ${title} project.`}
        /> */}
        <div className={styles.modalContent}>
          <h4>{title}</h4>
          <div className={styles.modalTech}>{tech.join(" - ")}</div>

          <div className={styles.suppliedContent}>{modalContent}</div>

          <div className={styles.modalFooter}>
            <p className={styles.linksText}>
              Project links<span>.</span>
            </p>
            <div className={styles.links}>
              <Link target="_blank" rel="nofollow" href={code}>
                <AiFillGithub /> Source Code
              </Link>
              <Link target="_blank" rel="nofollow" href={projectLink}>
                <AiOutlineExport /> Live Project
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  if (!isOpen) return <></>;

  // Only render portal on client side
  if (typeof window === "undefined") return <></>;
  
  const rootElement = document.getElementById("root") || document.body;
  return ReactDOM.createPortal(content, rootElement);
};

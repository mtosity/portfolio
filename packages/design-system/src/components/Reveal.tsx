"use client";
import type { JSX } from "react";
import React, { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

interface Props {
  children: JSX.Element;
  width?: "fit-content" | "100%";
  /** Seconds; use to stagger siblings (heading, then text, then picture). */
  delay?: number;
}

/* Rises 20px into place the first time it scrolls into view. Content is
   rendered visible on the server, so a failed script never hides it. */
export const Reveal = ({ children, width = "100%", delay = 0 }: Props) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <div ref={ref} style={{ width }}>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={isInView || reduce ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.7, delay, ease: [0.23, 1, 0.32, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
};

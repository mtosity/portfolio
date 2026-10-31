"use client";
import type { JSX } from "react";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Props {
  children: JSX.Element;
  width?: "fit-content" | "100%";
}

export const Reveal = ({ children, width = "fit-content" }: Props) => {
  const ref = useRef(null);
  // Trigger only once the element is 20% into the viewport
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div ref={ref} style={{ width }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        // A critically damped spring: settles without overshoot, like a
        // UIKit view coming to rest.
        transition={{ type: "spring", stiffness: 140, damping: 24, mass: 1 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

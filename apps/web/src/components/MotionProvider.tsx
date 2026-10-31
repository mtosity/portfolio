"use client";
import { MotionConfig } from "framer-motion";

/* Honors the OS Reduce Motion setting site-wide: framer-motion drops
   transform and layout animation and keeps opacity fades. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

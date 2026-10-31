"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const MotionLink = motion.create(Link);

/* The blue CTA — a filled capsule in the HIG "prominent" style, for the
   one most likely action in a view. Renders a button, or a Next.js Link
   when `href` is given. While disabled/busy it drops to the gray fill.
   `shadow` adds a soft lift for buttons floating over busy content.
   Size tweaks (fontSize, padding, …) go through `style`. */
export const AccentButton = ({
  children,
  href,
  onClick,
  disabled = false,
  shadow = false,
  style,
  type,
  title,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  shadow?: boolean;
  style?: React.CSSProperties;
  type?: "button" | "submit";
  title?: string;
}) => {
  const base: React.CSSProperties = {
    fontFamily: "var(--font-sans)",
    fontSize: "0.9375rem",
    fontWeight: 600,
    letterSpacing: "-0.01em",
    lineHeight: 1.2,
    color: disabled ? "var(--muted)" : "var(--accent-fg)",
    background: disabled ? "var(--fill-strong)" : "var(--accent)",
    border: "none",
    borderRadius: "var(--radius-full)",
    minHeight: "var(--hit)",
    padding: "0.65rem 1.25rem",
    cursor: disabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.45rem",
    textDecoration: "none",
    boxShadow: shadow && !disabled ? "var(--shadow-md)" : "none",
    ...style,
  };

  const interaction = disabled
    ? {}
    : {
        whileHover: { filter: "brightness(1.08)" },
        whileTap: { scale: 0.96 },
        transition: { type: "spring", stiffness: 600, damping: 32 },
      } as const;

  if (href && !disabled) {
    return (
      <MotionLink href={href} style={base} title={title} {...interaction}>
        {children}
      </MotionLink>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      type={type}
      title={title}
      style={base}
      {...interaction}
    >
      {children}
    </motion.button>
  );
};

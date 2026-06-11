"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const MotionLink = motion.create(Link);

/* The lime CTA: mono uppercase ink-on-lime, used for primary actions
   across the tools and admin. Renders a button, or a Next.js Link when
   `href` is given. While disabled/busy it drops to the muted surface.
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
    fontFamily: "var(--font-mono)",
    fontSize: "0.74rem",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    fontWeight: 700,
    color: disabled ? "var(--fg)" : "var(--accent-fg)",
    background: disabled ? "var(--border-light)" : "var(--accent)",
    border: `1px solid ${disabled ? "var(--border)" : "var(--accent-fg)"}`,
    padding: "0.7rem 1.1rem",
    cursor: disabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    textDecoration: "none",
    boxShadow: shadow && !disabled ? "var(--shadow-brutal)" : "none",
    ...style,
  };

  const interaction = disabled
    ? {}
    : { whileHover: { scale: 1.02 }, whileTap: { scale: 0.97 } };

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

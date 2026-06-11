"use client";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const TICKER_CONTENT =
  "SOFTWARE ENGINEER\u00A0\u00A0·\u00A0\u00A0FULL STACK\u00A0\u00A0·\u00A0\u00A0WEB PERFORMANCE\u00A0\u00A0·\u00A0\u00A0DESIGN SYSTEMS\u00A0\u00A0·\u00A0\u00A0REACT\u00A0\u00A0·\u00A0\u00A0GOLANG\u00A0\u00A0·\u00A0\u00A0OPEN SOURCE\u00A0\u00A0·\u00A0\u00A0";

const DESC =
  "Building things for the web. Specializing in performance, design systems, and full-stack engineering.";

const ease = [0.16, 1, 0.3, 1] as const;

export const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Name parallax: MINH TAM drifts left, NGUYEN drifts right
  const line1XRaw = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const line2XRaw = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const line1X = useSpring(line1XRaw, { stiffness: 60, damping: 20 });
  const line2X = useSpring(line2XRaw, { stiffness: 60, damping: 20 });

  // Photo parallax: rises independently as page scrolls
  const photoYRaw = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const photoY = useSpring(photoYRaw, { stiffness: 50, damping: 18 });

  // Entire content fades out as hero scrolls away
  const contentOpacity = useTransform(scrollYProgress, [0.5, 0.85], [1, 0]);

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        borderBottom: "1px solid var(--border)",
        paddingTop: "56px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dot grid texture */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, var(--border-light) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.45,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Top meta bar */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease }}
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.875rem clamp(1.5rem, 5vw, 4rem)",
          borderBottom: "1px solid var(--border-light)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.75rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--muted)",
        }}
      >
        <span>Software Engineer</span>
        <span>United States</span>
      </motion.div>

      {/* Main content */}
      <motion.div
        style={{
          flex: 1,
          position: "relative",
          zIndex: 1,
          opacity: contentOpacity,
          padding: "3rem clamp(1.5rem, 5vw, 4rem)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "clamp(2rem, 4vw, 5rem)",
            width: "100%",
          }}
        >
          {/* Left: name + ticker + description */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Display name */}
            <div
              style={{
                fontFamily: "var(--font-crimson-text), Georgia, serif",
                fontSize: "clamp(3.5rem, 9vw, 11rem)",
                fontWeight: 700,
                lineHeight: 0.9,
                letterSpacing: "-0.03em",
                color: "var(--fg)",
                userSelect: "none",
              }}
            >
              {/* MINH TAM — clip reveal, drifts left */}
              <div style={{ overflow: "hidden" }}>
                <motion.div
                  style={{ x: line1X, display: "block" }}
                  initial={{ y: "105%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1.1, delay: 0.3, ease }}
                >
                  MINH TAM
                </motion.div>
              </div>

              {/* NGUYEN — clip reveal, drifts right */}
              <div style={{ overflow: "hidden" }}>
                <motion.div
                  style={{ x: line2X, display: "block" }}
                  initial={{ y: "105%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1.1, delay: 0.52, ease }}
                >
                  NGUYEN
                </motion.div>
              </div>
            </div>

            {/* Line draws left → right */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.9, ease }}
              style={{
                transformOrigin: "left",
                height: "1px",
                background: "var(--border-light)",
                marginTop: "2.5rem",
              }}
            />

            {/* Marquee ticker */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 1.05 }}
              style={{ overflow: "hidden", padding: "0.55rem 0" }}
            >
              <motion.div
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                  duration: 28,
                  repeat: Infinity,
                  ease: "linear",
                  repeatType: "loop",
                }}
                style={{
                  display: "flex",
                  whiteSpace: "nowrap",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.18em",
                  color: "var(--muted)",
                  textTransform: "uppercase",
                }}
              >
                <span>{TICKER_CONTENT.repeat(4)}</span>
                <span>{TICKER_CONTENT.repeat(4)}</span>
              </motion.div>
            </motion.div>

            {/* Line draws right → left */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 1.05, ease }}
              style={{
                transformOrigin: "right",
                height: "1px",
                background: "var(--border-light)",
                marginBottom: "2.5rem",
              }}
            />

            {/* Description — word-by-word stagger */}
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "1.0625rem",
                color: "var(--muted)",
                maxWidth: "480px",
                lineHeight: 1.6,
              }}
            >
              {DESC.split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.15 + i * 0.055, ease }}
                  style={{ display: "inline-block", marginRight: "0.3em" }}
                >
                  {word}
                </motion.span>
              ))}
            </p>
          </div>

          {/* Right: profile photo — hidden on small screens */}
          <motion.div
            className="hidden md:block"
            style={{ y: photoY, flexShrink: 0, alignSelf: "center" }}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.65, ease }}
          >
            <div style={{ position: "relative" }}>
              <Image
                src="/mt.png"
                alt="Minh Tam Nguyen"
                width={400}
                height={500}
                priority
                style={{
                  width: "clamp(160px, 17vw, 260px)",
                  height: "auto",
                  display: "block",
                  border: "1px solid var(--border)",
                  boxShadow: "6px 6px 0 var(--border-light)",
                }}
              />
              {/* Name caption under photo */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.1 }}
                style={{
                  marginTop: "0.6rem",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                }}
              >
                Minh Tam Nguyen
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.8 }}
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.875rem clamp(1.5rem, 5vw, 4rem)",
          borderTop: "1px solid var(--border-light)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.75rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--muted)",
        }}
      >
        <span>mtosity.com · 2026</span>
        <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          Scroll
          <motion.span
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ display: "inline-block", lineHeight: 1 }}
          >
            ↓
          </motion.span>
        </span>
      </motion.div>
    </section>
  );
};

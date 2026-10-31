"use client";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const TICKER_CONTENT =
  "Software Engineer\u00A0\u00A0·\u00A0\u00A0Full Stack\u00A0\u00A0·\u00A0\u00A0Web Performance\u00A0\u00A0·\u00A0\u00A0Design Systems\u00A0\u00A0·\u00A0\u00A0React\u00A0\u00A0·\u00A0\u00A0Golang\u00A0\u00A0·\u00A0\u00A0Open Source\u00A0\u00A0·\u00A0\u00A0";

const DESC =
  "Building things for the web. Specializing in performance, design systems, and full-stack engineering.";

const ease = [0.16, 1, 0.3, 1] as const;

export const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Name parallax: Minh Tam drifts left, Nguyen drifts right
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
        paddingTop: "56px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* A soft blue light behind the portrait — the only colour in
          the hero, so the name stays the loudest thing on screen. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(60% 55% at 78% 45%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 70%)",
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
          padding: "1rem clamp(1.25rem, 5vw, 4rem)",
          fontFamily: "var(--font-sans)",
          fontSize: "0.8125rem",
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
          padding: "3rem clamp(1.25rem, 5vw, 4rem)",
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
                fontFamily: "var(--font-heading)",
                fontStretch: "var(--heading-stretch)",
                fontSize: "clamp(3.5rem, 9vw, 11rem)",
                fontWeight: 700,
                lineHeight: 0.92,
                letterSpacing: "-0.045em",
                color: "var(--fg)",
                userSelect: "none",
              }}
            >
              {/* Minh Tam — clip reveal, drifts left */}
              <div style={{ overflow: "hidden" }}>
                <motion.div
                  style={{ x: line1X, display: "block" }}
                  initial={{ y: "105%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1.1, delay: 0.3, ease }}
                >
                  Minh Tam
                </motion.div>
              </div>

              {/* Nguyen — clip reveal, drifts right. The mask is padded so
                  the g and y descenders aren't cut off; the negative margin
                  keeps the line spacing unchanged. */}
              <div style={{ overflow: "hidden", paddingBottom: "0.14em", marginBottom: "-0.14em" }}>
                <motion.div
                  style={{ x: line2X, display: "block" }}
                  initial={{ y: "105%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1.1, delay: 0.52, ease }}
                >
                  Nguyen
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
              style={{
                overflow: "hidden",
                padding: "0.7rem 0",
                // Fade the ticker in and out at the edges instead of hard-cutting it
                maskImage:
                  "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
              }}
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
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                  color: "var(--muted)",
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
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(1.1875rem, 1rem + 0.6vw, 1.5rem)",
                fontWeight: 500,
                letterSpacing: "-0.015em",
                color: "var(--muted)",
                maxWidth: "30ch",
                lineHeight: 1.35,
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
                  borderRadius: "var(--radius-xl)",
                  boxShadow: "var(--shadow-lg)",
                }}
              />
              {/* Name caption under photo */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.1 }}
                style={{
                  marginTop: "0.85rem",
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.8125rem",
                  textAlign: "center",
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
          padding: "1rem clamp(1.25rem, 5vw, 4rem)",
          fontFamily: "var(--font-sans)",
          fontSize: "0.8125rem",
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

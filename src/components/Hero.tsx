"use client";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

export const Hero = () => {
  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        borderBottom: "1px solid var(--border)",
        paddingTop: "56px", // offset fixed nav
      }}
    >
      {/* Top meta bar */}
      <div
        style={{
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
      </div>

      {/* Main display name */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "4rem clamp(1.5rem, 5vw, 4rem)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-crimson-text), Georgia, serif",
            fontSize: "clamp(5rem, 13vw, 15rem)",
            fontWeight: 700,
            lineHeight: 0.88,
            letterSpacing: "-0.03em",
            color: "var(--fg)",
            overflow: "hidden",
          }}
        >
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            style={{ overflow: "hidden" }}
          >
            <div>MINH</div>
          </motion.div>
          <motion.div
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            style={{ overflow: "hidden" }}
          >
            <div>TRAN</div>
          </motion.div>
        </div>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{
            marginTop: "3rem",
            fontFamily: "var(--font-inter)",
            fontSize: "1.0625rem",
            color: "var(--muted)",
            maxWidth: "480px",
          }}
        >
          Building things for the web. Specializing in performance, design
          systems, and full-stack engineering.
        </motion.p>
      </div>

      {/* Bottom scroll indicator */}
      <motion.div
        custom={3}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        style={{
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
        <span>mtosity.com · 2025</span>
        <span>↓ Scroll</span>
      </motion.div>
    </section>
  );
};

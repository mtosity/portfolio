"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SlideTabs } from "@mtosity/design-system";
import Sidebar from "./components/Sidebar";
import Canvas from "./components/Canvas";
import { useImageCombiner } from "./components/useImageCombiner";

export default function ImgGridPage() {
  const c = useImageCombiner();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--fg)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SlideTabs />

      {/* Header strip */}
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          paddingTop: "calc(56px + 1.5rem)",
          padding: "calc(56px + 1.25rem) clamp(1.25rem, 4vw, 2rem) 1.25rem",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          gap: "0.85rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link
            href="/tools"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.75rem",
              fontWeight: 500,
              color: "var(--accent-text)",
              textDecoration: "none",
            }}
          >
            ← All tools
          </Link>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8125rem",
              color: "var(--accent-text)",
            }}
          >
            07.03 — Tool
          </span>
          <div style={{ flex: 1 }} />
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.75rem",
              color: "var(--muted)",
            }}
            className="ig-stack-label"
          >
            Canvas · 100% client-side
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.85rem, 4.5vw, 2.75rem)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            Image{" "}
            <span style={{ fontStyle: "italic", color: "var(--muted)" }}>
              grid.
            </span>
          </h1>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.75rem",
              color: "var(--muted)",
              maxWidth: "60ch",
              margin: 0,
              lineHeight: 1.6,
            }}
            className="ig-tagline"
          >
            Drop images → choose a layout → pan / zoom each tile (drag to pan,
            scroll to zoom) → export PNG. Nothing leaves your browser.
          </p>
        </div>
      </motion.header>

      {/* Workspace */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          display: "flex",
          flex: 1,
          minHeight: "calc(100vh - 56px - 110px)",
          overflow: "hidden",
        }}
        className="ig-workspace"
      >
        <Sidebar
          mode={c.mode}
          setMode={c.setMode}
          stackCount={c.stackImages.length}
          imageCount={c.imageCount}
          setImageCount={c.setImageCount}
          aspectRatio={c.aspectRatio}
          setAspectRatio={c.setAspectRatio}
          layoutIndex={c.layoutIndex}
          setLayoutIndex={c.setLayoutIndex}
          layouts={c.layouts}
          gap={c.gap}
          setGap={c.setGap}
          exportSize={c.exportSize}
          setExportSize={c.setExportSize}
          bgColor={c.bgColor}
          setBgColor={c.setBgColor}
          borderRadius={c.borderRadius}
          setBorderRadius={c.setBorderRadius}
          exportImage={c.exportImage}
          images={c.images}
        />
        <Canvas
          currentLayout={c.currentLayout}
          aspectRatio={c.aspectRatio}
          images={c.images}
          onUpload={c.handleImageUpload}
          onRemove={c.mode === "grid" ? c.handleRemoveImage : c.handleStackRemove}
          onTransform={c.handleImageTransform}
          gap={c.gap}
          bgColor={c.bgColor}
          borderRadius={c.borderRadius}
        />
      </motion.div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .ig-workspace {
            flex-direction: column !important;
          }
          .ig-sidebar {
            width: 100% !important;
            max-height: 50vh;
            border-right: none !important;
            border-bottom: 1px solid var(--border);
          }
          .ig-stack-label {
            display: none;
          }
          .ig-tagline {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

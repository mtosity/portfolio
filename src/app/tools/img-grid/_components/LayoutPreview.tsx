"use client";

import type { AspectRatio, Layout } from "./layouts";

export default function LayoutPreview({
  layout,
  isActive,
  onClick,
  aspectRatio,
}: {
  layout: Layout;
  isActive: boolean;
  onClick: () => void;
  aspectRatio: AspectRatio;
}) {
  const w = 52;
  const h = Math.round(w * (aspectRatio.height / aspectRatio.width));

  return (
    <button
      onClick={onClick}
      title={layout.name}
      style={{
        position: "relative",
        width: w,
        height: h,
        border: `1px solid ${isActive ? "var(--fg)" : "var(--border-light)"}`,
        background: isActive ? "var(--accent)" : "var(--bg)",
        cursor: "pointer",
        flexShrink: 0,
        padding: 0,
        transition: "background 0.15s, border-color 0.15s",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.borderColor = "var(--fg)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.borderColor = "var(--border-light)";
        }
      }}
    >
      {layout.blocks.map((block, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            background: isActive ? "var(--fg)" : "var(--muted)",
            left: `calc(${block.x * 100}% + 2px)`,
            top: `calc(${block.y * 100}% + 2px)`,
            width: `calc(${block.w * 100}% - 4px)`,
            height: `calc(${block.h * 100}% - 4px)`,
          }}
        />
      ))}
    </button>
  );
}

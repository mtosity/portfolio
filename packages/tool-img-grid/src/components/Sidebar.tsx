"use client";

import LayoutPreview from "./LayoutPreview";
import {
  ASPECT_RATIOS,
  EXPORT_SIZES,
  GAP_OPTIONS,
  IMAGE_COUNTS,
  type AspectRatio,
  type Layout,
  type Option,
} from "./layouts";
import type { ImageState } from "./useImageCombiner";

type Props = {
  imageCount: number;
  setImageCount: (n: number) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (a: AspectRatio) => void;
  layoutIndex: number;
  setLayoutIndex: (i: number) => void;
  layouts: Layout[];
  gap: Option<number>;
  setGap: (g: Option<number>) => void;
  exportSize: Option<number>;
  setExportSize: (s: Option<number>) => void;
  bgColor: string;
  setBgColor: (c: string) => void;
  borderRadius: number;
  setBorderRadius: (n: number) => void;
  exportImage: () => void;
  images: Record<number, ImageState>;
};

export default function Sidebar({
  imageCount,
  setImageCount,
  aspectRatio,
  setAspectRatio,
  layoutIndex,
  setLayoutIndex,
  layouts,
  gap,
  setGap,
  exportSize,
  setExportSize,
  bgColor,
  setBgColor,
  borderRadius,
  setBorderRadius,
  exportImage,
  images,
}: Props) {
  const allFilled =
    Object.keys(images).length === imageCount &&
    Object.values(images).every(Boolean);

  return (
    <aside
      style={{
        width: 288,
        flexShrink: 0,
        background: "var(--bg)",
        overflowY: "auto",
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}
      className="ig-sidebar scrollbar-thin"
    >
      <Section title="Images">
        <Pills
          options={IMAGE_COUNTS.map((c) => ({ label: String(c), value: c }))}
          activeValue={imageCount}
          onChange={(v) => setImageCount(v)}
        />
      </Section>

      <Section title="Aspect ratio">
        <Pills
          options={ASPECT_RATIOS.map((a) => ({ label: a.label, value: a.value }))}
          activeValue={aspectRatio.value}
          onChange={(v) => {
            const ar = ASPECT_RATIOS.find((a) => a.value === v);
            if (ar) setAspectRatio(ar);
          }}
        />
      </Section>

      <Section title="Layout">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {layouts.map((layout, i) => (
            <LayoutPreview
              key={`${layout.name}-${i}`}
              layout={layout}
              isActive={layoutIndex === i}
              onClick={() => setLayoutIndex(i)}
              aspectRatio={aspectRatio}
            />
          ))}
        </div>
      </Section>

      <Section title="Gap">
        <Pills
          options={GAP_OPTIONS.map((g) => ({ label: g.label, value: g.value }))}
          activeValue={gap.value}
          onChange={(v) => {
            const g = GAP_OPTIONS.find((o) => o.value === v);
            if (g) setGap(g);
          }}
        />
      </Section>

      <Section title={`Radius — ${borderRadius}px`}>
        <input
          type="range"
          min={0}
          max={32}
          value={borderRadius}
          onChange={(e) => setBorderRadius(Number(e.target.value))}
          style={{
            width: "100%",
            accentColor: "var(--fg)",
          }}
        />
      </Section>

      <Section title="Background">
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            border: "1px solid var(--border-light)",
            padding: "0.5rem 0.6rem",
          }}
        >
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            style={{
              width: 28,
              height: 28,
              border: "1px solid var(--border)",
              padding: 0,
              cursor: "pointer",
              background: "transparent",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
              color: "var(--fg)",
              textTransform: "uppercase",
            }}
          >
            {bgColor}
          </span>
        </div>
      </Section>

      <Section title="Export size">
        <Pills
          options={EXPORT_SIZES.map((s) => ({ label: s.label, value: s.value }))}
          activeValue={exportSize.value}
          onChange={(v) => {
            const s = EXPORT_SIZES.find((o) => o.value === v);
            if (s) setExportSize(s);
          }}
        />
      </Section>

      <button
        onClick={exportImage}
        disabled={!allFilled}
        style={{
          marginTop: "auto",
          fontFamily: "var(--font-mono)",
          fontSize: "0.78rem",
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--fg)",
          background: allFilled ? "var(--accent)" : "var(--border-light)",
          border: "1px solid var(--border)",
          padding: "0.95rem",
          cursor: allFilled ? "pointer" : "not-allowed",
          boxShadow: allFilled ? "4px 4px 0 var(--border)" : "none",
          transition: "transform 0.15s, box-shadow 0.15s, background 0.15s",
        }}
        onMouseEnter={(e) => {
          if (!allFilled) return;
          (e.currentTarget as HTMLElement).style.transform = "translate(-2px, -2px)";
          (e.currentTarget as HTMLElement).style.boxShadow = "6px 6px 0 var(--border)";
        }}
        onMouseLeave={(e) => {
          if (!allFilled) return;
          (e.currentTarget as HTMLElement).style.transform = "translate(0, 0)";
          (e.currentTarget as HTMLElement).style.boxShadow = "4px 4px 0 var(--border)";
        }}
      >
        {allFilled ? "↓ Export PNG" : `Fill ${imageCount - Object.keys(images).length} more`}
      </button>
    </aside>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--muted)",
          fontWeight: 700,
          marginBottom: "0.6rem",
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function Pills<T extends string | number>({
  options,
  activeValue,
  onChange,
}: {
  options: { label: string; value: T }[];
  activeValue: T;
  onChange: (v: T) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 0,
        border: "1px solid var(--border-light)",
      }}
    >
      {options.map((o, i) => {
        const active = o.value === activeValue;
        return (
          <button
            key={String(o.value)}
            onClick={() => onChange(o.value)}
            style={{
              flex: 1,
              padding: "0.55rem 0.4rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: active ? "var(--fg)" : "var(--muted)",
              background: active ? "var(--accent)" : "transparent",
              border: "none",
              borderLeft: i === 0 ? "none" : "1px solid var(--border-light)",
              cursor: "pointer",
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              if (!active) {
                (e.currentTarget as HTMLElement).style.color = "var(--fg)";
                (e.currentTarget as HTMLElement).style.background = "var(--bg-secondary)";
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                (e.currentTarget as HTMLElement).style.color = "var(--muted)";
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

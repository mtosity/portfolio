"use client";

import { AccentButton } from "@mtosity/design-system";
import LayoutPreview from "./LayoutPreview";
import {
  ASPECT_RATIOS,
  EXPORT_SIZES,
  GAP_OPTIONS,
  IMAGE_COUNTS,
  MODES,
  type AspectRatio,
  type Layout,
  type Mode,
  type Option,
} from "./layouts";
import type { ImageState } from "./useImageCombiner";

type Props = {
  mode: Mode;
  setMode: (m: Mode) => void;
  stackCount: number;
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
  mode,
  setMode,
  stackCount,
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
  const isStack = mode === "hstack" || mode === "vstack";
  const allFilled = isStack
    ? stackCount >= 1
    : Object.keys(images).length === imageCount &&
      Object.values(images).every(Boolean);
  const remaining = imageCount - Object.keys(images).length;

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
      <Section title="Layout">
        <Pills
          options={MODES}
          activeValue={mode}
          onChange={(v) => setMode(v)}
        />
      </Section>

      {isStack ? (
        <Section title="Stack">
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              lineHeight: 1.6,
              letterSpacing: "0.04em",
              color: "var(--muted)",
              margin: 0,
            }}
          >
            {mode === "hstack"
              ? "Images stack left → right at equal height."
              : "Images stack top → bottom at equal width."}{" "}
            Drop into the trailing tile to keep adding — the strip grows with
            every image.
          </p>
        </Section>
      ) : (
        <>
          <Section title="Images">
            <Pills
              options={IMAGE_COUNTS.map((c) => ({ label: String(c), value: c }))}
              activeValue={imageCount}
              onChange={(v) => setImageCount(v)}
            />
          </Section>

          <Section title="Aspect ratio">
            <Pills
              options={ASPECT_RATIOS.map((a) => ({
                label: a.label,
                value: a.value,
              }))}
              activeValue={aspectRatio.value}
              onChange={(v) => {
                const ar = ASPECT_RATIOS.find((a) => a.value === v);
                if (ar) setAspectRatio(ar);
              }}
            />
          </Section>

          <Section title="Grid">
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
        </>
      )}

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

      <Section
        title={
          mode === "hstack"
            ? "Export height"
            : mode === "vstack"
              ? "Export width"
              : "Export size"
        }
      >
        <Pills
          options={EXPORT_SIZES.map((s) => ({ label: s.label, value: s.value }))}
          activeValue={exportSize.value}
          onChange={(v) => {
            const s = EXPORT_SIZES.find((o) => o.value === v);
            if (s) setExportSize(s);
          }}
        />
      </Section>

      <AccentButton
        onClick={exportImage}
        disabled={!allFilled}
        shadow
        style={{
          marginTop: "auto",
          fontSize: "0.78rem",
          letterSpacing: "0.18em",
          padding: "0.95rem",
        }}
      >
        {isStack
          ? allFilled
            ? "↓ Export PNG"
            : "Add an image"
          : allFilled
            ? "↓ Export PNG"
            : `Fill ${remaining} more`}
      </AccentButton>
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
              color: active ? "var(--accent-fg)" : "var(--muted)",
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

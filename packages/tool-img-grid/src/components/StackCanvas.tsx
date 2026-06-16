"use client";

import { useEffect, useRef, useState } from "react";
import ImageBlock from "./ImageBlock";
import type { Mode, Option } from "./layouts";
import type { ImageState, Transform } from "./useImageCombiner";

type Props = {
  mode: Mode; // "hstack" | "vstack"
  stackImages: ImageState[];
  onUpload: (i: number, file: File) => void;
  onRemove: (i: number) => void;
  onTransform: (i: number, t: Transform) => void;
  gap: Option<number>;
  bgColor: string;
  borderRadius: number;
};

// Caps the on-screen size of the stacked strip's cross axis so a single
// portrait/landscape image can't blow up the preview; the export stays full-res.
const MAX_CROSS = 480;
const EMPTY_RATIO = 0.66;

export default function StackCanvas({
  mode,
  stackImages,
  onUpload,
  onRemove,
  onTransform,
  gap,
  bgColor,
  borderRadius,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [cross, setCross] = useState(360);
  const horizontal = mode === "hstack";

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      const inner = (horizontal ? rect.height : rect.width) - 48;
      setCross(Math.max(120, Math.min(inner, MAX_CROSS)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [horizontal]);

  // Filled cells followed by one trailing empty "add" cell → infinite stacking.
  const cells: { image: ImageState | undefined; index: number }[] = [
    ...stackImages.map((image, index) => ({ image, index })),
    { image: undefined, index: stackImages.length },
  ];

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        display: "flex",
        alignItems: "safe center",
        justifyContent: "safe center",
        overflow: "auto",
        minWidth: 0,
        padding: 24,
        background: "var(--bg-secondary)",
        borderLeft: "1px solid var(--border)",
      }}
      className="scrollbar-thin"
    >
      <div
        style={{
          display: "flex",
          flexDirection: horizontal ? "row" : "column",
          gap: gap.value,
          flexShrink: 0,
          backgroundColor: bgColor,
          borderRadius: borderRadius > 0 ? borderRadius + 2 : 0,
          transition: "background 0.2s",
        }}
      >
        {cells.map((cell) => {
          const ratio = cell.image?.ratio ?? EMPTY_RATIO;
          const w = horizontal
            ? Math.round(cross * (cell.image ? ratio : EMPTY_RATIO))
            : cross;
          const h = horizontal
            ? cross
            : Math.round(cross / (cell.image ? ratio : 1 / EMPTY_RATIO));

          return (
            <div
              key={cell.image ? cell.image.url : "add"}
              style={{
                position: "relative",
                flex: "0 0 auto",
                width: w,
                height: h,
              }}
            >
              <ImageBlock
                index={cell.index}
                image={cell.image}
                onUpload={onUpload}
                onRemove={onRemove}
                onTransform={onTransform}
                style={{ inset: 0, borderRadius }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

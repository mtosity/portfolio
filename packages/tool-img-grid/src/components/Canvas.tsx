"use client";

import { useEffect, useRef, useState } from "react";
import ImageBlock from "./ImageBlock";
import StackCanvas from "./StackCanvas";
import type { AspectRatio, Layout, Mode, Option } from "./layouts";
import type { ImageState, Transform } from "./useImageCombiner";

type Props = {
  mode: Mode;
  stackImages: ImageState[];
  onStackRemove: (i: number) => void;
  currentLayout: Layout;
  aspectRatio: AspectRatio;
  images: Record<number, ImageState>;
  onUpload: (i: number, file: File) => void;
  onRemove: (i: number) => void;
  onTransform: (i: number, t: Transform) => void;
  gap: Option<number>;
  bgColor: string;
  borderRadius: number;
};

export default function Canvas({
  mode,
  stackImages,
  onStackRemove,
  currentLayout,
  aspectRatio,
  images,
  onUpload,
  onRemove,
  onTransform,
  gap,
  bgColor,
  borderRadius,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 400, height: 400 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      const padded = { w: rect.width - 32, h: rect.height - 32 };
      const ratio = aspectRatio.width / aspectRatio.height;

      let w: number;
      let h: number;
      if (padded.w / padded.h > ratio) {
        h = padded.h;
        w = h * ratio;
      } else {
        w = padded.w;
        h = w / ratio;
      }
      setSize({ width: Math.round(w), height: Math.round(h) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [aspectRatio]);

  if (mode === "hstack" || mode === "vstack") {
    return (
      <StackCanvas
        mode={mode}
        stackImages={stackImages}
        onUpload={onUpload}
        onRemove={onStackRemove}
        onTransform={onTransform}
        gap={gap}
        bgColor={bgColor}
        borderRadius={borderRadius}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        minWidth: 0,
        background: "var(--bg-secondary)",
        borderLeft: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          position: "relative",
          width: size.width,
          height: size.height,
          backgroundColor: bgColor,
          borderRadius: borderRadius > 0 ? borderRadius + 2 : 0,
          transition: "width 0.2s, height 0.2s, background 0.2s",
        }}
      >
        {currentLayout.blocks.map((block, i) => (
          <ImageBlock
            key={`${currentLayout.name}-${i}`}
            index={i}
            image={images[i]}
            onUpload={onUpload}
            onRemove={onRemove}
            onTransform={onTransform}
            style={{
              left: `calc(${block.x * 100}% + ${gap.value / 2}px)`,
              top: `calc(${block.y * 100}% + ${gap.value / 2}px)`,
              width: `calc(${block.w * 100}% - ${gap.value}px)`,
              height: `calc(${block.h * 100}% - ${gap.value}px)`,
              borderRadius,
            }}
          />
        ))}
      </div>
    </div>
  );
}

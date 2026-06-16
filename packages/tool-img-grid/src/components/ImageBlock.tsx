"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type { ImageState, Transform } from "./useImageCombiner";

type Props = {
  index: number;
  image: ImageState | undefined;
  onUpload: (i: number, file: File) => void;
  onRemove: (i: number) => void;
  onTransform: (i: number, t: Transform) => void;
  style: CSSProperties;
  /** Stack cells match the image aspect ratio exactly, so pan/zoom is disabled. */
  disableTransform?: boolean;
};

export default function ImageBlock({
  index,
  image,
  onUpload,
  onRemove,
  onTransform,
  style,
  disableTransform = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const blockRef = useRef<HTMLDivElement | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<
    | { x: number; y: number; offsetX: number; offsetY: number }
    | null
  >(null);
  const [naturalSize, setNaturalSize] = useState<
    { width: number; height: number } | null
  >(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) onUpload(index, file);
    },
    [index, onUpload],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragOver(false), []);

  const handleClick = useCallback(() => {
    if (!image) inputRef.current?.click();
  }, [image]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onUpload(index, file);
      e.target.value = "";
    },
    [index, onUpload],
  );

  const handleImgLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const t = e.currentTarget;
      setNaturalSize({ width: t.naturalWidth, height: t.naturalHeight });
    },
    [],
  );

  const getImgStyle = (): CSSProperties => {
    if (!image || !naturalSize || !blockRef.current) return {};
    const block = blockRef.current.getBoundingClientRect();
    const bw = block.width;
    const bh = block.height;
    if (bw === 0 || bh === 0) return {};

    const imgRatio = naturalSize.width / naturalSize.height;
    const boxRatio = bw / bh;

    let baseW: number;
    let baseH: number;
    if (imgRatio > boxRatio) {
      baseH = bh;
      baseW = bh * imgRatio;
    } else {
      baseW = bw;
      baseH = bw / imgRatio;
    }

    const scale = image.scale || 1;
    const w = baseW * scale;
    const h = baseH * scale;

    const maxPanX = (w - bw) / 2;
    const maxPanY = (h - bh) / 2;
    const ox = (image.offsetX || 0) * maxPanX;
    const oy = (image.offsetY || 0) * maxPanY;

    return {
      width: w,
      height: h,
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: `translate(calc(-50% + ${ox}px), calc(-50% + ${oy}px))`,
      maxWidth: "none",
      pointerEvents: "none",
    };
  };

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!image || disableTransform) return;
      e.preventDefault();
      const scale = image.scale || 1;
      const delta = -e.deltaY * 0.002;
      const newScale = Math.min(5, Math.max(1, scale + delta));

      let offsetX = image.offsetX || 0;
      let offsetY = image.offsetY || 0;
      if (newScale < scale) {
        offsetX = Math.min(1, Math.max(-1, offsetX));
        offsetY = Math.min(1, Math.max(-1, offsetY));
      }

      onTransform(index, { scale: newScale, offsetX, offsetY });
    },
    [image, index, onTransform, disableTransform],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!image || disableTransform) return;
      if ((e.target as HTMLElement).tagName === "BUTTON") return;
      e.preventDefault();
      setDragging(true);
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        offsetX: image.offsetX || 0,
        offsetY: image.offsetY || 0,
      };
    },
    [image, disableTransform],
  );

  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStart.current || !blockRef.current || !naturalSize) return;
      const block = blockRef.current.getBoundingClientRect();
      const bw = block.width;
      const bh = block.height;
      const imgRatio = naturalSize.width / naturalSize.height;
      const boxRatio = bw / bh;

      let baseW: number;
      let baseH: number;
      if (imgRatio > boxRatio) {
        baseH = bh;
        baseW = bh * imgRatio;
      } else {
        baseW = bw;
        baseH = bw / imgRatio;
      }

      const scale = image?.scale || 1;
      const w = baseW * scale;
      const h = baseH * scale;
      const maxPanX = (w - bw) / 2;
      const maxPanY = (h - bh) / 2;

      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;

      const newOffsetX =
        maxPanX > 0
          ? Math.min(1, Math.max(-1, dragStart.current.offsetX + dx / maxPanX))
          : 0;
      const newOffsetY =
        maxPanY > 0
          ? Math.min(1, Math.max(-1, dragStart.current.offsetY + dy / maxPanY))
          : 0;

      onTransform(index, { scale, offsetX: newOffsetX, offsetY: newOffsetY });
    };

    const handleMouseUp = () => {
      setDragging(false);
      dragStart.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, image, index, naturalSize, onTransform]);

  useEffect(() => {
    const el = blockRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const outline = dragOver
    ? "2px dashed var(--fg)"
    : image
      ? "1px solid transparent"
      : "1px dashed var(--border-light)";

  return (
    <div
      ref={blockRef}
      style={{
        ...style,
        position: "absolute",
        overflow: "hidden",
        outline,
        outlineOffset: -1,
        cursor: image
          ? disableTransform
            ? "default"
            : dragging
              ? "grabbing"
              : "grab"
          : "pointer",
        background: image ? "transparent" : "var(--bg-secondary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "outline-color 0.2s",
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
      onMouseDown={image ? handleMouseDown : undefined}
      onMouseEnter={(e) => {
        if (!dragOver && image) {
          (e.currentTarget as HTMLElement).style.outline = "2px solid var(--accent)";
        } else if (!dragOver && !image) {
          (e.currentTarget as HTMLElement).style.outline = "1px dashed var(--fg)";
        }
      }}
      onMouseLeave={(e) => {
        if (!dragOver) {
          (e.currentTarget as HTMLElement).style.outline = image
            ? "1px solid transparent"
            : "1px dashed var(--border-light)";
        }
      }}
    >
      {image ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.url}
            alt=""
            draggable={false}
            onLoad={handleImgLoad}
            style={getImgStyle()}
          />
          <div
            className="ig-controls"
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              opacity: 0,
              background: "rgba(13,13,13,0)",
              transition: "opacity 0.2s, background 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = "1";
              (e.currentTarget as HTMLElement).style.background =
                "rgba(13,13,13,0.35)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = "0";
              (e.currentTarget as HTMLElement).style.background =
                "rgba(13,13,13,0)";
            }}
          >
            <div style={{ display: "flex", gap: 6 }}>
              <OverlayBtn
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
              >
                Replace
              </OverlayBtn>
              <OverlayBtn
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(index);
                }}
                tone="danger"
              >
                Remove
              </OverlayBtn>
            </div>
            <div
              style={{
                display: disableTransform ? "none" : "flex",
                gap: 4,
                alignItems: "center",
              }}
            >
              <SquareBtn
                onClick={(e) => {
                  e.stopPropagation();
                  const scale = image.scale || 1;
                  onTransform(index, {
                    scale: Math.max(1, scale - 0.25),
                    offsetX: image.offsetX,
                    offsetY: image.offsetY,
                  });
                }}
              >
                −
              </SquareBtn>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  color: "#fff",
                  minWidth: "3.2rem",
                  textAlign: "center",
                  letterSpacing: "0.08em",
                }}
              >
                {Math.round((image.scale || 1) * 100)}%
              </span>
              <SquareBtn
                onClick={(e) => {
                  e.stopPropagation();
                  const scale = image.scale || 1;
                  onTransform(index, {
                    scale: Math.min(5, scale + 0.25),
                    offsetX: image.offsetX,
                    offsetY: image.offsetY,
                  });
                }}
              >
                +
              </SquareBtn>
            </div>
          </div>
        </>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            color: "var(--muted)",
            pointerEvents: "none",
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 4v16M4 12h16" />
          </svg>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Click or drop
          </span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
}

function OverlayBtn({
  children,
  onClick,
  tone = "default",
}: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  tone?: "default" | "danger";
}) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.65rem",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        fontWeight: 700,
        background: tone === "danger" ? "rgba(168, 50, 50, 0.85)" : "var(--bg)",
        color: tone === "danger" ? "#fff" : "var(--fg)",
        border: "1px solid var(--border)",
        padding: "0.4rem 0.7rem",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function SquareBtn({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 28,
        height: 28,
        fontFamily: "var(--font-mono)",
        fontSize: "1rem",
        background: "var(--bg)",
        color: "var(--fg)",
        border: "1px solid var(--border)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        lineHeight: 1,
      }}
    >
      {children}
    </button>
  );
}

import { useCallback, useState } from "react";
import {
  ASPECT_RATIOS,
  EXPORT_SIZES,
  GAP_OPTIONS,
  getLayouts,
  type AspectRatio,
  type Block,
  type Mode,
  type Option,
} from "./layouts";

export type ImageState = {
  url: string;
  file: File;
  scale: number;
  offsetX: number;
  offsetY: number;
};

export type Transform = Partial<Pick<ImageState, "scale" | "offsetX" | "offsetY">>;

export function useImageCombiner() {
  const [mode, setModeRaw] = useState<Mode>("grid");
  const [imageCount, setImageCountRaw] = useState(2);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(ASPECT_RATIOS[0]);
  const [layoutIndex, setLayoutIndex] = useState(0);
  const [images, setImages] = useState<Record<number, ImageState>>({});
  const [gap, setGap] = useState<Option<number>>(GAP_OPTIONS[0]);
  const [exportSize, setExportSize] = useState<Option<number>>(EXPORT_SIZES[0]);
  const [bgColor, setBgColor] = useState("#0d0d0d");
  const [borderRadius, setBorderRadius] = useState(0);

  const layouts = getLayouts(imageCount);

  // For stack modes: the contiguous, ordered list of filled images (slots 0..n-1).
  const stackImages: ImageState[] = [];
  for (let i = 0; images[i]; i++) stackImages.push(images[i]);

  // Row/Column stack the images as equal divisions inside the fixed-aspect
  // container; an extra trailing cell is the "add" tile (infinite stacking).
  const currentLayout =
    mode === "grid"
      ? layouts[layoutIndex] || layouts[0]
      : { name: mode, blocks: stackBlocks(mode, stackImages.length + 1) };

  const clearImages = useCallback(() => {
    setImages((prev) => {
      Object.values(prev).forEach((img) => URL.revokeObjectURL(img.url));
      return {};
    });
  }, []);

  const setMode = useCallback(
    (m: Mode) => {
      setModeRaw(m);
      setLayoutIndex(0);
      clearImages();
    },
    [clearImages],
  );

  const setImageCount = useCallback(
    (count: number) => {
      setImageCountRaw(count);
      setLayoutIndex(0);
      clearImages();
    },
    [clearImages],
  );

  const handleImageUpload = useCallback((blockIndex: number, file: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setImages((prev) => {
      const next = { ...prev };
      if (next[blockIndex]) URL.revokeObjectURL(next[blockIndex].url);
      next[blockIndex] = { url, file, scale: 1, offsetX: 0, offsetY: 0 };
      return next;
    });
  }, []);

  const handleImageTransform = useCallback(
    (blockIndex: number, transform: Transform) => {
      setImages((prev) => {
        if (!prev[blockIndex]) return prev;
        return {
          ...prev,
          [blockIndex]: { ...prev[blockIndex], ...transform },
        };
      });
    },
    [],
  );

  const handleRemoveImage = useCallback((blockIndex: number) => {
    setImages((prev) => {
      const next = { ...prev };
      if (next[blockIndex]) {
        URL.revokeObjectURL(next[blockIndex].url);
        delete next[blockIndex];
      }
      return next;
    });
  }, []);

  // Stack modes keep slots dense, so removing one shifts later images down.
  const handleStackRemove = useCallback((blockIndex: number) => {
    setImages((prev) => {
      const keys = Object.keys(prev)
        .map(Number)
        .sort((a, b) => a - b);
      const next: Record<number, ImageState> = {};
      let j = 0;
      for (const k of keys) {
        if (k === blockIndex) {
          URL.revokeObjectURL(prev[k].url);
          continue;
        }
        next[j++] = prev[k];
      }
      return next;
    });
  }, []);

  const exportImage = useCallback(async () => {
    const baseSize = exportSize.value;

    // Stack modes divide the canvas into N equal cells (no trailing add-tile);
    // grid uses the selected preset. Both share the same fixed-aspect canvas.
    const blocks =
      mode === "grid"
        ? currentLayout.blocks
        : stackBlocks(mode, stackImages.length);
    if (mode !== "grid" && blocks.length === 0) return;

    const canvasWidth =
      aspectRatio.width >= aspectRatio.height
        ? baseSize
        : Math.round(baseSize * (aspectRatio.width / aspectRatio.height));
    const canvasHeight =
      aspectRatio.height >= aspectRatio.width
        ? baseSize
        : Math.round(baseSize * (aspectRatio.height / aspectRatio.width));

    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const gapPx = Math.round((gap.value / 600) * baseSize);
    const radiusPx = Math.round((borderRadius / 600) * baseSize);

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const bx = Math.round(block.x * canvasWidth + gapPx / 2);
      const by = Math.round(block.y * canvasHeight + gapPx / 2);
      const bw = Math.round(block.w * canvasWidth - gapPx);
      const bh = Math.round(block.h * canvasHeight - gapPx);

      if (images[i]) {
        const img = await loadImage(images[i].url);

        ctx.save();
        if (radiusPx > 0) {
          roundRect(ctx, bx, by, bw, bh, radiusPx);
          ctx.clip();
        }
        const imgData = images[i];
        drawCover(
          ctx,
          img,
          bx,
          by,
          bw,
          bh,
          imgData.scale || 1,
          imgData.offsetX || 0,
          imgData.offsetY || 0,
        );
        ctx.restore();
      } else {
        ctx.save();
        if (radiusPx > 0) {
          roundRect(ctx, bx, by, bw, bh, radiusPx);
          ctx.clip();
        }
        ctx.fillStyle = "#e8e5dd";
        ctx.fillRect(bx, by, bw, bh);
        ctx.restore();
      }
    }

    const link = document.createElement("a");
    link.download = `img-grid-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [
    mode,
    aspectRatio,
    currentLayout,
    stackImages,
    images,
    gap,
    exportSize,
    bgColor,
    borderRadius,
  ]);

  return {
    mode,
    setMode,
    stackImages,
    handleStackRemove,
    imageCount,
    setImageCount,
    aspectRatio,
    setAspectRatio,
    layoutIndex,
    setLayoutIndex,
    layouts,
    currentLayout,
    images,
    handleImageUpload,
    handleRemoveImage,
    handleImageTransform,
    gap,
    setGap,
    exportSize,
    setExportSize,
    bgColor,
    setBgColor,
    borderRadius,
    setBorderRadius,
    exportImage,
  };
}

// Equal divisions of the unit square: Row stacks horizontal rows top→bottom,
// Column places vertical columns left→right. `count` cells fill the container.
function stackBlocks(mode: Mode, count: number): Block[] {
  const blocks: Block[] = [];
  for (let i = 0; i < count; i++) {
    blocks.push(
      mode === "column"
        ? { x: i / count, y: 0, w: 1 / count, h: 1 }
        : { x: 0, y: i / count, w: 1, h: 1 / count },
    );
  }
  return blocks;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.src = src;
  });
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  scale = 1,
  offsetX = 0,
  offsetY = 0,
) {
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const boxRatio = w / h;

  let baseSw: number;
  let baseSh: number;
  if (imgRatio > boxRatio) {
    baseSh = img.naturalHeight;
    baseSw = baseSh * boxRatio;
  } else {
    baseSw = img.naturalWidth;
    baseSh = baseSw / boxRatio;
  }

  const sw = baseSw / scale;
  const sh = baseSh / scale;

  const maxPanX = img.naturalWidth - sw;
  const maxPanY = img.naturalHeight - sh;
  const sx = maxPanX / 2 - offsetX * (maxPanX / 2);
  const sy = maxPanY / 2 - offsetY * (maxPanY / 2);

  ctx.drawImage(
    img,
    Math.max(0, Math.min(sx, img.naturalWidth - sw)),
    Math.max(0, Math.min(sy, img.naturalHeight - sh)),
    sw,
    sh,
    x,
    y,
    w,
    h,
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

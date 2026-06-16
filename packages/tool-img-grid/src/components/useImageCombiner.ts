import { useCallback, useState } from "react";
import {
  ASPECT_RATIOS,
  EXPORT_SIZES,
  GAP_OPTIONS,
  getLayouts,
  type AspectRatio,
  type Mode,
  type Option,
} from "./layouts";

export type ImageState = {
  url: string;
  file: File;
  scale: number;
  offsetX: number;
  offsetY: number;
  /** natural width / height, used to size stack cells */
  ratio?: number;
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
  const currentLayout = layouts[layoutIndex] || layouts[0];

  // For stack modes: the contiguous, ordered list of filled images (slots 0..n-1).
  const stackImages: ImageState[] = [];
  for (let i = 0; images[i]; i++) stackImages.push(images[i]);

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
    // Resolve the natural aspect ratio so stack cells can be sized correctly.
    const probe = new Image();
    probe.onload = () => {
      const ratio = probe.naturalHeight
        ? probe.naturalWidth / probe.naturalHeight
        : 1;
      setImages((prev) =>
        prev[blockIndex]
          ? { ...prev, [blockIndex]: { ...prev[blockIndex], ratio } }
          : prev,
      );
    };
    probe.src = url;
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

    // Build the ordered list of filled stack images from the dense slot record.
    const ordered: ImageState[] = [];
    for (let i = 0; images[i]; i++) ordered.push(images[i]);

    const canvas = document.createElement("canvas");
    let ctx: CanvasRenderingContext2D | null;

    if (mode === "hstack" || mode === "vstack") {
      if (ordered.length === 0) return;

      const gapPx = Math.round((gap.value / 600) * baseSize);
      const radiusPx = Math.round((borderRadius / 600) * baseSize);
      const totalGap = gapPx * Math.max(0, ordered.length - 1);

      const loaded = await Promise.all(ordered.map((s) => loadImage(s.url)));
      const ratios = loaded.map((im) =>
        im.naturalHeight ? im.naturalWidth / im.naturalHeight : 1,
      );

      if (mode === "hstack") {
        const widths = ratios.map((r) => Math.max(1, Math.round(baseSize * r)));
        canvas.width = widths.reduce((a, b) => a + b, 0) + totalGap;
        canvas.height = baseSize;
        ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        let x = 0;
        for (let i = 0; i < loaded.length; i++) {
          ctx.save();
          if (radiusPx > 0) {
            roundRect(ctx, x, 0, widths[i], baseSize, radiusPx);
            ctx.clip();
          }
          ctx.drawImage(loaded[i], x, 0, widths[i], baseSize);
          ctx.restore();
          x += widths[i] + gapPx;
        }
      } else {
        const heights = ratios.map((r) =>
          Math.max(1, Math.round(baseSize / r)),
        );
        canvas.width = baseSize;
        canvas.height = heights.reduce((a, b) => a + b, 0) + totalGap;
        ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        let y = 0;
        for (let i = 0; i < loaded.length; i++) {
          ctx.save();
          if (radiusPx > 0) {
            roundRect(ctx, 0, y, baseSize, heights[i], radiusPx);
            ctx.clip();
          }
          ctx.drawImage(loaded[i], 0, y, baseSize, heights[i]);
          ctx.restore();
          y += heights[i] + gapPx;
        }
      }

      const link = document.createElement("a");
      link.download = `img-stack-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      return;
    }

    const canvasWidth =
      aspectRatio.width >= aspectRatio.height
        ? baseSize
        : Math.round(baseSize * (aspectRatio.width / aspectRatio.height));
    const canvasHeight =
      aspectRatio.height >= aspectRatio.width
        ? baseSize
        : Math.round(baseSize * (aspectRatio.height / aspectRatio.width));

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const gapPx = Math.round((gap.value / 600) * baseSize);
    const radiusPx = Math.round((borderRadius / 600) * baseSize);

    const blocks = currentLayout.blocks;
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

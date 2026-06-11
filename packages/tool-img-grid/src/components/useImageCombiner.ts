import { useCallback, useState } from "react";
import {
  ASPECT_RATIOS,
  EXPORT_SIZES,
  GAP_OPTIONS,
  getLayouts,
  type AspectRatio,
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

  const setImageCount = useCallback((count: number) => {
    setImageCountRaw(count);
    setLayoutIndex(0);
    setImages((prev) => {
      Object.values(prev).forEach((img) => URL.revokeObjectURL(img.url));
      return {};
    });
  }, []);

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

  const exportImage = useCallback(async () => {
    const baseSize = exportSize.value;
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

    const blocks = currentLayout.blocks;
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const bx = Math.round(block.x * canvasWidth + gapPx / 2);
      const by = Math.round(block.y * canvasHeight + gapPx / 2);
      const bw = Math.round(block.w * canvasWidth - gapPx);
      const bh = Math.round(block.h * canvasHeight - gapPx);

      if (images[i]) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.src = images[i].url;
        });

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
    aspectRatio,
    currentLayout,
    images,
    gap,
    exportSize,
    bgColor,
    borderRadius,
  ]);

  return {
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

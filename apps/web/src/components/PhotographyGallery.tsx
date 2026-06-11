"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
} from "react";
import { SlideTabs } from "@mtosity/design-system";
import type { GalleryImage } from "@mtosity/lib/gallery";

type Photo = GalleryImage;

// useLayoutEffect warns during SSR; on the server the effect never runs anyway.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Mirror of next.config deviceSizes — used to predict the lightbox variant URL
// so it can be preloaded on hover, before the user clicks.
const DEVICE_SIZES = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
const LIGHTBOX_CSS_WIDTH = 896; // 56rem modal cap
const LIGHTBOX_QUALITY = 85;

function lightboxVariantUrl(src: string) {
  const target = LIGHTBOX_CSS_WIDTH * Math.min(window.devicePixelRatio || 1, 4);
  const w = DEVICE_SIZES.find((s) => s >= target) ?? DEVICE_SIZES[DEVICE_SIZES.length - 1];
  return `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=${LIGHTBOX_QUALITY}`;
}

export default function PhotographyGallery({ photos }: { photos: Photo[] }) {
  const [selectedPhoto, setSelectedPhoto] = useState<{
    photo: Photo;
    thumbSrc: string | null;
  } | null>(null);
  const [lightboxLoaded, setLightboxLoaded] = useState(false);

  // Warm the full-size variant the moment a tile is hovered, so it is usually
  // in the HTTP cache by the time the modal opens.
  const preloadedLightbox = useRef(new Set<string>());
  const preloadLightbox = useCallback((photo: Photo) => {
    if (preloadedLightbox.current.has(photo.id)) return;
    preloadedLightbox.current.add(photo.id);
    const img = new window.Image();
    img.src = lightboxVariantUrl(photo.src);
  }, []);

  const openLightbox = useCallback((photo: Photo, tile: HTMLElement) => {
    const thumbSrc = tile.querySelector("img")?.currentSrc || null;
    setLightboxLoaded(false);
    setSelectedPhoto({ photo, thumbSrc });
  }, []);
  const [imageDimensions, setImageDimensions] = useState<
    Map<string, { width: number; height: number }>
  >(new Map());
  // Must be deterministic for hydration: the server renders the grid at
  // 1200px, and the first client render must match it exactly.
  const [windowWidth, setWindowWidth] = useState<number>(1200);

  // Measure before first paint so narrow screens never flash the 1200px layout.
  useIsomorphicLayoutEffect(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  // Debounce resize: re-laying out the whole grid on every pixel of a drag
  // is the opposite of snappy.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setWindowWidth(window.innerWidth), 100);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Fallback for photos missing from the dimensions manifest: measure on
  // load, but flush in batches so N images trigger a handful of re-layouts
  // instead of N.
  const pendingDims = useRef(new Map<string, { width: number; height: number }>());
  const flushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const queueDimension = useCallback((photoId: string, img: HTMLImageElement) => {
    if (!img.naturalWidth || !img.naturalHeight) return;
    pendingDims.current.set(photoId, {
      width: img.naturalWidth,
      height: img.naturalHeight,
    });
    if (flushTimer.current) return;
    flushTimer.current = setTimeout(() => {
      flushTimer.current = null;
      const batch = pendingDims.current;
      pendingDims.current = new Map();
      setImageDimensions((prev) => new Map([...prev, ...batch]));
    }, 150);
  }, []);

  const dimsFor = useCallback(
    (photo: Photo) => {
      const measured = imageDimensions.get(photo.id);
      const width = photo.width || measured?.width || 800;
      const height = photo.height || measured?.height || 600;
      return { width, height, aspectRatio: width / height };
    },
    [imageDimensions],
  );

  const createRows = useCallback(
    (photos: Photo[]) => {
      const rows: Photo[][] = [];
      let currentRow: Photo[] = [];
      let currentRowAspectSum = 0;

      const getResponsiveSettings = () => {
        if (windowWidth < 640)
          return {
            targetRowWidth: windowWidth - 32,
            maxImagesPerRow: 1,
            targetRowHeight: 400,
          };
        if (windowWidth < 768)
          return {
            targetRowWidth: windowWidth - 48,
            maxImagesPerRow: 2,
            targetRowHeight: 300,
          };
        if (windowWidth < 1024)
          return {
            targetRowWidth: windowWidth - 64,
            maxImagesPerRow: 3,
            targetRowHeight: 280,
          };
        if (windowWidth < 1280)
          return {
            targetRowWidth: windowWidth - 80,
            maxImagesPerRow: 4,
            targetRowHeight: 300,
          };
        return {
          targetRowWidth: 1200,
          maxImagesPerRow: 5,
          targetRowHeight: 300,
        };
      };

      const { targetRowWidth, maxImagesPerRow, targetRowHeight } =
        getResponsiveSettings();
      const gap = 4;

      photos.forEach((photo, index) => {
        const { aspectRatio } = dimsFor(photo);

        const tentativeAspectSum = currentRowAspectSum + aspectRatio;
        const tentativeWidth =
          tentativeAspectSum * targetRowHeight + currentRow.length * gap;

        if (
          (tentativeWidth <= targetRowWidth &&
            currentRow.length < maxImagesPerRow) ||
          currentRow.length === 0
        ) {
          currentRow.push(photo);
          currentRowAspectSum += aspectRatio;
        } else {
          rows.push([...currentRow]);
          currentRow = [photo];
          currentRowAspectSum = aspectRatio;
        }

        if (index === photos.length - 1) {
          rows.push(currentRow);
        }
      });

      return rows;
    },
    [windowWidth, dimsFor],
  );

  const photoRows = React.useMemo(
    () => createRows(photos),
    [photos, createRows],
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--fg)",
      }}
    >
      <SlideTabs />

      {/* Page header */}
      <div
        style={{
          marginTop: "56px",
          borderBottom: "1px solid var(--border)",
          padding: "3rem clamp(1.5rem, 5vw, 4rem) 2.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            marginBottom: "1.75rem",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--muted)",
            }}
          >
            05 —
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--fg)",
            }}
          >
            PHOTOGRAPHY
          </span>
        </div>

        <motion.p
          style={{
            fontFamily: "var(--font-crimson-text), Georgia, serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 400,
            fontStyle: "italic",
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
            color: "var(--fg)",
            maxWidth: "720px",
            textAlign: "center",
            margin: "0 auto",
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          "Shoot the adjective,
          <br />
          not the noun."
        </motion.p>
      </div>

      {/* Gallery grid */}
      <motion.div
        style={{ padding: "1rem clamp(1rem, 3vw, 2rem) 4rem" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {photoRows.map((row, rowIndex) => {
            const totalAspectRatio = row.reduce(
              (sum, photo) => sum + dimsFor(photo).aspectRatio,
              0,
            );

            const getContainerWidth = () => {
              if (windowWidth < 640) return windowWidth - 32;
              if (windowWidth < 768) return windowWidth - 48;
              if (windowWidth < 1024) return windowWidth - 64;
              if (windowWidth < 1280) return windowWidth - 80;
              return 1200;
            };

            const containerWidth = getContainerWidth();
            const gapTotal = (row.length - 1) * 4;
            const availableWidth = containerWidth - gapTotal;
            const rowHeight = availableWidth / totalAspectRatio;

            return (
              <div
                key={rowIndex}
                style={{
                  display: "flex",
                  gap: "4px",
                  marginBottom: "4px",
                  justifyContent: "center",
                }}
              >
                {row.map((photo) => {
                  const { aspectRatio } = dimsFor(photo);

                  const isSingleImage = row.length === 1;
                  let imageWidth, imageHeight;

                  if (isSingleImage) {
                    imageWidth = availableWidth;
                    imageHeight = imageWidth / aspectRatio;
                  } else {
                    imageHeight = rowHeight;
                    imageWidth = imageHeight * aspectRatio;
                  }

                  return (
                    <div
                      key={photo.id}
                      onClick={(e) => openLightbox(photo, e.currentTarget)}
                      onMouseEnter={() => preloadLightbox(photo)}
                      style={{
                        width: imageWidth,
                        height: imageHeight,
                        flexShrink: 0,
                        cursor: "pointer",
                        position: "relative",
                        overflow: "hidden",
                        background: "var(--bg-secondary)",
                      }}
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes={`${Math.ceil(imageWidth)}px`}
                        priority={rowIndex < 2}
                        style={{
                          objectFit: "cover",
                          objectPosition: "center",
                          transition: "transform 0.3s ease",
                        }}
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLElement).style.transform =
                            "scale(1.03)")
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLElement).style.transform =
                            "scale(1)")
                        }
                        onLoad={
                          photo.width
                            ? undefined
                            : (e) =>
                                queueDimension(
                                  photo.id,
                                  e.currentTarget as HTMLImageElement,
                                )
                        }
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Lightbox modal */}
      {selectedPhoto && (
        <motion.div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(242, 239, 232, 0.92)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            padding: "1rem",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedPhoto(null)}
        >
          <motion.div
            style={{
              position: "relative",
              maxWidth: "56rem",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ position: "relative", width: "100%" }}>
              {/* The grid thumbnail is already in cache — show it instantly
                  (slightly blurred) while the full-quality variant streams in. */}
              {selectedPhoto.thumbSrc && !lightboxLoaded && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedPhoto.thumbSrc}
                  alt=""
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    filter: "blur(6px)",
                    border: "1px solid var(--border-light)",
                  }}
                />
              )}
              <Image
                src={selectedPhoto.photo.src}
                alt={selectedPhoto.photo.alt}
                width={dimsFor(selectedPhoto.photo).width}
                height={dimsFor(selectedPhoto.photo).height}
                sizes="(max-width: 980px) 92vw, 896px"
                quality={LIGHTBOX_QUALITY}
                priority
                onLoad={() => setLightboxLoaded(true)}
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "85vh",
                  objectFit: "contain",
                  border: "1px solid var(--border-light)",
                  position: "relative",
                }}
              />
            </div>
            <button
              onClick={() => setSelectedPhoto(null)}
              style={{
                position: "absolute",
                top: "-2.5rem",
                right: 0,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--fg)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "0.25rem 0",
              }}
            >
              Close ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

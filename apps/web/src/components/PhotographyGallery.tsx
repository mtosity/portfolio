"use client";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
} from "react";
import { SiteNav, SiteFooter } from "@mtosity/design-system";
import type { GalleryImage } from "@mtosity/lib/gallery";

type Photo = GalleryImage;

// useLayoutEffect warns during SSR; on the server the effect never runs anyway.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Mirror of next.config deviceSizes — used to predict the lightbox variant URL
// so it can be preloaded on hover, before the user clicks.
const DEVICE_SIZES = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
const LIGHTBOX_CSS_WIDTH = 1400; // lightbox frame cap
const LIGHTBOX_QUALITY = 85;

function lightboxVariantUrl(src: string) {
  const target = LIGHTBOX_CSS_WIDTH * Math.min(window.devicePixelRatio || 1, 4);
  const w = DEVICE_SIZES.find((s) => s >= target) ?? DEVICE_SIZES[DEVICE_SIZES.length - 1];
  return `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=${LIGHTBOX_QUALITY}`;
}

const GAP = 6;
const PAGE_MAX = 1440;

/* Mirrors --gutter in tokens.css: clamp(1rem, 0.4rem + 2.6vw, 2.5rem). */
function gutterFor(width: number) {
  return Math.min(40, Math.max(16, 6.4 + width * 0.026));
}

function containerWidthFor(width: number) {
  return Math.min(width, PAGE_MAX) - 2 * gutterFor(width);
}

/* Camera filenames carry the capture time (IMG20260604172417 → 4 June
   2026). Used for captions and alt text when the upload has no title. */
function takenOn(photo: Photo): string | null {
  const m = photo.src.match(/IMG_?(\d{4})(\d{2})(\d{2})/);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (Number.isNaN(d.getTime()) || d.getFullYear() < 2000) return null;
  return d.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}

function altFor(photo: Photo) {
  const when = takenOn(photo);
  return when ? `Photograph taken ${when}` : "Photograph";
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

  // documentElement.clientWidth, not window.innerWidth: when the server-rendered
  // 1200px grid overflows a phone, mobile Chrome reports the overflowed width
  // through innerWidth — laying out against it keeps the page permanently wider
  // than the screen. clientWidth stays pinned to the real layout viewport.
  const viewportWidth = () => document.documentElement.clientWidth;

  // Measure before first paint so narrow screens never flash the 1200px layout.
  useIsomorphicLayoutEffect(() => {
    setWindowWidth(viewportWidth());
  }, []);

  // Debounce resize: re-laying out the whole grid on every pixel of a drag
  // is the opposite of snappy.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setWindowWidth(viewportWidth()), 100);
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
        const targetRowWidth = containerWidthFor(windowWidth);
        if (windowWidth < 640) return { targetRowWidth, maxImagesPerRow: 1, targetRowHeight: 420 };
        if (windowWidth < 1024) return { targetRowWidth, maxImagesPerRow: 2, targetRowHeight: 320 };
        if (windowWidth < 1280) return { targetRowWidth, maxImagesPerRow: 3, targetRowHeight: 340 };
        return { targetRowWidth, maxImagesPerRow: 4, targetRowHeight: 380 };
      };

      const { targetRowWidth, maxImagesPerRow, targetRowHeight } =
        getResponsiveSettings();
      const gap = GAP;

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

  const reduce = useReducedMotion();
  const hero = React.useMemo(
    () => photos.find((p) => p.width && p.height && p.width / p.height > 1.25) ?? photos[0],
    [photos],
  );
  const index = selectedPhoto ? photos.findIndex((p) => p.id === selectedPhoto.photo.id) : -1;

  const step = useCallback(
    (dir: 1 | -1) => {
      if (index < 0) return;
      const next = photos[(index + dir + photos.length) % photos.length];
      if (!next) return;
      setLightboxLoaded(false);
      setSelectedPhoto({ photo: next, thumbSrc: null });
    },
    [index, photos],
  );

  // Lightbox keys: Esc closes, arrows walk the roll. Scroll stays locked.
  useEffect(() => {
    if (!selectedPhoto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedPhoto(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [selectedPhoto, step]);

  const containerWidth = containerWidthFor(windowWidth);

  return (
    <>
      <SiteNav overlay />
      <main id="main" className="gallery">
        {/* First screen: one photograph, edge to edge, with the line. */}
        <section className="gallery-hero" aria-labelledby="gallery-title">
          {hero && (
            <Image
              src={hero.src}
              alt={altFor(hero)}
              fill
              priority
              sizes="100vw"
              quality={80}
              className="gallery-hero-img"
            />
          )}
          <div className="gallery-hero-scrim" aria-hidden />
          <div className="gallery-grain" aria-hidden />
          <div className="gallery-hero-copy frame">
            <h1 id="gallery-title" className="gallery-title display">
              Shoot the adjective,
              <br />
              not the noun.
            </h1>
            <p className="gallery-count">
              {photos.length} photos so far
            </p>
          </div>
        </section>

        <section className="gallery-roll frame" aria-label="All photographs">
          {photoRows.map((row, rowIndex) => {
            const totalAspectRatio = row.reduce(
              (sum, photo) => sum + dimsFor(photo).aspectRatio,
              0,
            );
            const gapTotal = (row.length - 1) * GAP;
            const availableWidth = containerWidth - gapTotal;
            const rowHeight = availableWidth / totalAspectRatio;

            return (
              <div key={rowIndex} className="gallery-row">
                {row.map((photo) => {
                  const { aspectRatio } = dimsFor(photo);
                  // Pixel width is only an estimate for the `sizes` hint; the
                  // rendered width is a share of the row so it always fits,
                  // including the pre-hydration paint at the server's width.
                  const imageWidth = row.length === 1 ? availableWidth : rowHeight * aspectRatio;

                  return (
                    <button
                      key={photo.id}
                      type="button"
                      className="gallery-tile"
                      onClick={(e) => openLightbox(photo, e.currentTarget)}
                      onMouseEnter={() => preloadLightbox(photo)}
                      onFocus={() => preloadLightbox(photo)}
                      aria-label={`Open ${altFor(photo).toLowerCase()}`}
                      style={{
                        width: `calc((100% - ${gapTotal}px) * ${aspectRatio / totalAspectRatio})`,
                        aspectRatio: `${aspectRatio}`,
                      }}
                    >
                      <Image
                        src={photo.src}
                        alt=""
                        fill
                        sizes={`${Math.ceil(imageWidth)}px`}
                        priority={rowIndex < 1}
                        onLoad={
                          photo.width
                            ? undefined
                            : (e) => queueDimension(photo.id, e.currentTarget as HTMLImageElement)
                        }
                      />
                    </button>
                  );
                })}
              </div>
            );
          })}
        </section>
      </main>
      <SiteFooter />

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            key="lightbox"
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={altFor(selectedPhoto.photo)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setSelectedPhoto(null)}
          >
            <div className="lightbox-bar" onClick={(e) => e.stopPropagation()}>
              <span className="lightbox-count">
                {index + 1} / {photos.length}
              </span>
              <span className="lightbox-date">{takenOn(selectedPhoto.photo) ?? ""}</span>
              <button className="lightbox-close" onClick={() => setSelectedPhoto(null)} autoFocus>
                Close
              </button>
            </div>

            <motion.div
              key={selectedPhoto.photo.id}
              className="lightbox-stage"
              initial={reduce ? false : { opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
            >
              <div
                className="lightbox-frame"
                style={{ aspectRatio: `${dimsFor(selectedPhoto.photo).aspectRatio}` }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* The grid thumbnail is already cached — show it at once,
                    softened, while the full-quality variant streams in. */}
                {selectedPhoto.thumbSrc && !lightboxLoaded && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={selectedPhoto.thumbSrc} alt="" aria-hidden className="lightbox-thumb" />
                )}
                <Image
                  src={selectedPhoto.photo.src}
                  alt={altFor(selectedPhoto.photo)}
                  fill
                  sizes="(max-width: 980px) 96vw, 1400px"
                  quality={LIGHTBOX_QUALITY}
                  priority
                  onLoad={() => setLightboxLoaded(true)}
                  style={{ objectFit: "contain" }}
                />
              </div>
            </motion.div>

            <button
              className="lightbox-step lightbox-prev"
              aria-label="Previous photograph"
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
            </button>
            <button
              className="lightbox-step lightbox-next"
              aria-label="Next photograph"
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { SlideTabs } from "@/components/SlideTabs";

interface Photo {
  id: string;
  src: string;
  alt: string;
  width?: number;
  height?: number;
  takenTime: number;
}

// Lazy loading hook
const useLazyLoading = (threshold = 0.1) => {
  const [visibleImages, setVisibleImages] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const imageId = entry.target.getAttribute("data-image-id");
            if (imageId) {
              setVisibleImages(
                (prev) => new Set([...Array.from(prev), imageId])
              );
              observerRef.current?.unobserve(entry.target);
            }
          }
        });
      },
      { threshold, rootMargin: "500px" }
    );

    return () => observerRef.current?.disconnect();
  }, [threshold]);

  const observeImage = (element: HTMLElement | null, imageId: string) => {
    if (element && observerRef.current) {
      element.setAttribute("data-image-id", imageId);
      observerRef.current.observe(element);
    }
  };

  return { visibleImages, observeImage };
};

export default function Photography() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(
    new Set()
  );
  const [imageDimensions, setImageDimensions] = useState<
    Map<string, { width: number; height: number }>
  >(new Map());
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const { visibleImages, observeImage } = useLazyLoading();

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const response = await fetch("/api/gallery");
        const data = await response.json();
        if (data.images) {
          setPhotos(data.images);
          const initialImages = data.images.slice(0, 12);
          const initialIds = new Set<string>(
            initialImages.map((img: Photo) => img.id)
          );
          setPreloadedImages(initialIds);
        }
      } catch (error) {
        console.error("Failed to fetch gallery images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const allVisibleImages = new Set([
    ...Array.from(preloadedImages),
    ...Array.from(visibleImages),
  ]);

  const handleImageLoad = (photoId: string, img: HTMLImageElement) => {
    setImageDimensions(
      (prev) =>
        new Map(
          prev.set(photoId, {
            width: img.naturalWidth,
            height: img.naturalHeight,
          })
        )
    );
  };

  const createRows = useCallback(
    (photos: Photo[]) => {
      const rows: Photo[][] = [];
      let currentRow: Photo[] = [];
      let currentRowAspectSum = 0;

      const getResponsiveSettings = () => {
        if (windowWidth < 640)
          return { targetRowWidth: windowWidth - 32, maxImagesPerRow: 1, targetRowHeight: 400 };
        if (windowWidth < 768)
          return { targetRowWidth: windowWidth - 48, maxImagesPerRow: 2, targetRowHeight: 300 };
        if (windowWidth < 1024)
          return { targetRowWidth: windowWidth - 64, maxImagesPerRow: 3, targetRowHeight: 280 };
        if (windowWidth < 1280)
          return { targetRowWidth: windowWidth - 80, maxImagesPerRow: 4, targetRowHeight: 300 };
        return { targetRowWidth: 1200, maxImagesPerRow: 5, targetRowHeight: 300 };
      };

      const { targetRowWidth, maxImagesPerRow, targetRowHeight } =
        getResponsiveSettings();
      const gap = 4;

      photos.forEach((photo, index) => {
        const dimensions = imageDimensions.get(photo.id);
        const width = dimensions?.width || photo.width || 800;
        const height = dimensions?.height || photo.height || 600;
        const aspectRatio = width / height;

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
    [windowWidth, imageDimensions]
  );

  const photoRows = React.useMemo(
    () => createRows(photos),
    [photos, createRows]
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--fg)" }}>
      <SlideTabs />

      {/* Page header */}
      <div
        style={{
          marginTop: "56px",
          borderBottom: "1px solid var(--border)",
          padding: "3rem clamp(1.5rem, 5vw, 4rem) 2.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "1.75rem" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)" }}>
            05 —
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--fg)" }}>
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

      {/* Loading state */}
      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "5rem 0",
          }}
        >
          <motion.div
            style={{
              width: "1.5rem",
              height: "1.5rem",
              border: "1px solid var(--border)",
              borderTopColor: "transparent",
              borderRadius: "50%",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}

      {/* Gallery grid */}
      {!loading && (
        <motion.div
          style={{ padding: "1rem clamp(1rem, 3vw, 2rem) 4rem" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            {photoRows.map((row, rowIndex) => {
              const totalAspectRatio = row.reduce((sum, photo) => {
                const dimensions = imageDimensions.get(photo.id);
                const width = dimensions?.width || photo.width || 800;
                const height = dimensions?.height || photo.height || 600;
                return sum + width / height;
              }, 0);

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
                    const dimensions = imageDimensions.get(photo.id);
                    const width = dimensions?.width || photo.width || 800;
                    const height = dimensions?.height || photo.height || 600;
                    const aspectRatio = width / height;

                    const isSingleImage = row.length === 1;
                    let imageWidth, imageHeight;

                    if (isSingleImage) {
                      imageWidth = availableWidth;
                      imageHeight = imageWidth / aspectRatio;
                    } else {
                      imageHeight = rowHeight;
                      imageWidth = imageHeight * aspectRatio;
                    }

                    const isVisible = allVisibleImages.has(photo.id);

                    return (
                      <div
                        key={photo.id}
                        ref={(el) => {
                          if (!isVisible) observeImage(el, photo.id);
                        }}
                        onClick={() => setSelectedPhoto(photo)}
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
                        {isVisible ? (
                          <Image
                            src={photo.src}
                            alt={photo.alt}
                            width={width}
                            height={height}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              objectPosition: "center",
                              transition: "transform 0.3s ease",
                              display: "block",
                            }}
                            onMouseEnter={(e) =>
                              ((e.currentTarget as HTMLElement).style.transform =
                                "scale(1.03)")
                            }
                            onMouseLeave={(e) =>
                              ((e.currentTarget as HTMLElement).style.transform =
                                "scale(1)")
                            }
                            onLoad={(e) => {
                              const img = e.target as HTMLImageElement;
                              handleImageLoad(photo.id, img);
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              background: "var(--bg-secondary)",
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

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
            <Image
              src={selectedPhoto.src}
              alt={selectedPhoto.alt}
              width={800}
              height={600}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "85vh",
                objectFit: "contain",
                border: "1px solid var(--border-light)",
              }}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 95vw, 80vw"
            />
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

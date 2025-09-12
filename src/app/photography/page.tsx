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
            const imageId = entry.target.getAttribute('data-image-id');
            if (imageId) {
              setVisibleImages((prev) => new Set([...Array.from(prev), imageId]));
              observerRef.current?.unobserve(entry.target);
            }
          }
        });
      },
      { threshold, rootMargin: '500px' } // Increased from 100px to 500px
    );

    return () => observerRef.current?.disconnect();
  }, [threshold]);

  const observeImage = (element: HTMLElement | null, imageId: string) => {
    if (element && observerRef.current) {
      element.setAttribute('data-image-id', imageId);
      observerRef.current.observe(element);
    }
  };

  return { visibleImages, observeImage };
};

export default function Photography() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());
  const [imageDimensions, setImageDimensions] = useState<Map<string, {width: number, height: number}>>(new Map());
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const { visibleImages, observeImage } = useLazyLoading();

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const response = await fetch('/api/gallery');
        const data = await response.json();
        if (data.images) {
          setPhotos(data.images);
          
          // Preload the first 12 images that are likely to be visible above the fold and first scroll
          const initialImages = data.images.slice(0, 12);
          const initialIds = new Set<string>(initialImages.map((img: Photo) => img.id));
          setPreloadedImages(initialIds);
        }
      } catch (error) {
        console.error('Failed to fetch gallery images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Combine preloaded and lazy-loaded images
  const allVisibleImages = new Set([...Array.from(preloadedImages), ...Array.from(visibleImages)]);

  // Function to handle image load and get dimensions
  const handleImageLoad = (photoId: string, img: HTMLImageElement) => {
    setImageDimensions(prev => new Map(prev.set(photoId, {
      width: img.naturalWidth,
      height: img.naturalHeight
    })));
  };

  // Function to create balanced rows with responsive width
  const createRows = useCallback((photos: Photo[]) => {
    const rows: Photo[][] = [];
    let currentRow: Photo[] = [];
    let currentRowAspectSum = 0;
    
    // Responsive container widths and settings
    const getResponsiveSettings = () => {
      if (windowWidth < 640) { // Mobile
        return { targetRowWidth: windowWidth - 32, maxImagesPerRow: 1, targetRowHeight: 400 }; // 1 image per row
      } else if (windowWidth < 768) { // Tablet portrait
        return { targetRowWidth: windowWidth - 48, maxImagesPerRow: 2, targetRowHeight: 300 };
      } else if (windowWidth < 1024) { // Tablet landscape
        return { targetRowWidth: windowWidth - 64, maxImagesPerRow: 3, targetRowHeight: 280 };
      } else if (windowWidth < 1280) { // Desktop small
        return { targetRowWidth: windowWidth - 80, maxImagesPerRow: 4, targetRowHeight: 300 };
      } else { // Desktop large
        return { targetRowWidth: 1200, maxImagesPerRow: 5, targetRowHeight: 300 };
      }
    };

    const { targetRowWidth, maxImagesPerRow, targetRowHeight } = getResponsiveSettings();
    const gap = 4; // Gap between images (1 * 4px)

    photos.forEach((photo, index) => {
      // Get dimensions from loaded images or use defaults
      const dimensions = imageDimensions.get(photo.id);
      const width = dimensions?.width || photo.width || 800;
      const height = dimensions?.height || photo.height || 600;
      const aspectRatio = width / height;

      // Check if adding this photo would make the row too wide or too crowded
      const tentativeAspectSum = currentRowAspectSum + aspectRatio;
      const tentativeWidth = tentativeAspectSum * targetRowHeight + currentRow.length * gap;

      if ((tentativeWidth <= targetRowWidth && currentRow.length < maxImagesPerRow) || currentRow.length === 0) {
        currentRow.push(photo);
        currentRowAspectSum += aspectRatio;
      } else {
        // Start new row
        rows.push([...currentRow]);
        currentRow = [photo];
        currentRowAspectSum = aspectRatio;
      }

      // Push the last row if we're at the end
      if (index === photos.length - 1) {
        rows.push(currentRow);
      }
    });

    return rows;
  }, [windowWidth, imageDimensions]);

  const photoRows = React.useMemo(() => createRows(photos), [photos, createRows]);


  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Navigation */}
      <div className="sticky top-4 bg-transparent z-20">
        <SlideTabs />
      </div>

      {/* Header */}
      <div className="pt-12 pb-12 text-center">
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-lime-300 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Photography
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Shoot the adjective, not the noun!
        </motion.p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <motion.div
            className="w-8 h-8 border-2 border-lime-300 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}

      {/* Gallery Grid */}
      {!loading && (
        <motion.div
          className="container mx-auto px-4 pb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
        <div className="max-w-6xl mx-auto">
          {photoRows.map((row, rowIndex) => {
            // Calculate the total aspect ratio sum for this row
            const totalAspectRatio = row.reduce((sum, photo) => {
              const dimensions = imageDimensions.get(photo.id);
              const width = dimensions?.width || photo.width || 800;
              const height = dimensions?.height || photo.height || 600;
              return sum + (width / height);
            }, 0);

            // Get responsive container width
            const getContainerWidth = () => {
              if (windowWidth < 640) return windowWidth - 32; // Mobile: full width with padding
              if (windowWidth < 768) return windowWidth - 48; // Tablet portrait
              if (windowWidth < 1024) return windowWidth - 64; // Tablet landscape
              if (windowWidth < 1280) return windowWidth - 80; // Desktop small
              return 1200; // Desktop large
            };

            const containerWidth = getContainerWidth();
            const gapTotal = (row.length - 1) * 4; // 4px gap between images
            const availableWidth = containerWidth - gapTotal;
            const rowHeight = availableWidth / totalAspectRatio;

            return (
              <motion.div
                key={rowIndex}
                className="flex gap-1 mb-4 w-full justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: rowIndex * 0.1 }}
              >
                {row.map((photo) => {
                  // Get dimensions from loaded images or use defaults
                  const dimensions = imageDimensions.get(photo.id);
                  const width = dimensions?.width || photo.width || 800;
                  const height = dimensions?.height || photo.height || 600;
                  const aspectRatio = width / height;

                  // For single image rows (mobile), use full width while maintaining aspect ratio
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
                    <motion.div
                      key={photo.id}
                      ref={(el) => {
                        if (!isVisible) {
                          observeImage(el, photo.id);
                        }
                      }}
                      className="cursor-pointer group relative overflow-hidden bg-zinc-800"
                      onClick={() => setSelectedPhoto(photo)}
                      style={{
                        width: imageWidth,
                        height: imageHeight,
                        flexShrink: 0,
                      }}
                    >
                      {isVisible ? (
                        <motion.div
                          className="w-full h-full"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Image
                            src={photo.src}
                            alt={photo.alt}
                            width={width}
                            height={height}
                            className="w-full h-full object-cover"
                            style={{ objectPosition: 'center' }}
                            onLoad={(e) => {
                              const img = e.target as HTMLImageElement;
                              handleImageLoad(photo.id, img);
                            }}
                          />
                        </motion.div>
                      ) : (
                        <div className="w-full h-full bg-zinc-700 flex items-center justify-center">
                          <div className="w-8 h-8 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin opacity-30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                    </motion.div>
                  );
                })}
              </motion.div>
            );
          })}
        </div>
        </motion.div>
      )}

      {/* Modal */}
      {selectedPhoto && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-2 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedPhoto(null)}
        >
          <motion.div
            className="relative w-full max-w-4xl max-h-full flex items-center justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedPhoto.src}
              alt={selectedPhoto.alt}
              width={800}
              height={600}
              className="w-full h-auto max-h-[90vh] sm:max-h-[80vh] object-contain"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 95vw, 80vw"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white hover:text-lime-300 transition-colors duration-200 bg-black bg-opacity-50 rounded-full p-1 sm:p-2"
            >
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

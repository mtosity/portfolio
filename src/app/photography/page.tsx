"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { SlideTabs } from "@/components/SlideTabs";

interface Photo {
  id: number;
  src: string;
  alt: string;
  title: string;
  category: string;
}

const mockPhotos: Photo[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800",
    alt: "Mountain landscape at sunset",
    title: "Golden Peak",
    category: "Landscape"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=1200",
    alt: "Urban street photography",
    title: "City Lights",
    category: "Street"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800",
    alt: "Forest path in autumn",
    title: "Autumn Path",
    category: "Nature"
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=800",
    alt: "Portrait photography",
    title: "Silent Thoughts",
    category: "Portrait"
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=800",
    alt: "Coastal seascape",
    title: "Ocean Dreams",
    category: "Landscape"
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1200&h=600",
    alt: "Architecture photography",
    title: "Modern Lines",
    category: "Architecture"
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=1200",
    alt: "Night sky photography",
    title: "Stargazer",
    category: "Astro"
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=1200&h=800",
    alt: "Wildlife photography",
    title: "Wild Spirit",
    category: "Wildlife"
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=1200",
    alt: "Vertical landscape",
    title: "Vertical Vista",
    category: "Landscape"
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=900",
    alt: "Another mountain view",
    title: "Mountain Majesty",
    category: "Landscape"
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=900&h=600",
    alt: "Street scene",
    title: "Urban Life",
    category: "Street"
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600",
    alt: "Nature close-up",
    title: "Natural Beauty",
    category: "Nature"
  }
];

export default function Photography() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  // Function to create balanced rows with consistent width
  const createRows = (photos: Photo[]) => {
    const rows: Photo[][] = [];
    let currentRow: Photo[] = [];
    let currentRowAspectSum = 0;
    const targetRowWidth = 1200; // Container width
    const baseHeight = 250; // Base height for calculating aspect ratios
    const gap = 8; // Gap between images (2 * 4px)

    photos.forEach((photo, index) => {
      // Extract dimensions from the URL
      const urlParams = new URLSearchParams(photo.src.split('?')[1]);
      const width = parseInt(urlParams.get('w') || '800');
      const height = parseInt(urlParams.get('h') || '600');
      const aspectRatio = width / height;
      
      // Check if adding this photo would make the row too wide
      const tentativeAspectSum = currentRowAspectSum + aspectRatio;
      const tentativeWidth = tentativeAspectSum * baseHeight + (currentRow.length * gap);
      
      if (tentativeWidth <= targetRowWidth || currentRow.length === 0) {
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
  };

  const photoRows = createRows(mockPhotos);

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Navigation */}
      <div className="sticky top-4 bg-transparent z-20">
        <SlideTabs />
      </div>
      
      {/* Header */}
      <div className="pt-8 pb-12 text-center">
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
          Welcome to my visual diary! 📸 Where I pretend to be a professional photographer but mostly just press buttons until something looks cool. These are the moments when my camera accidentally cooperated with my artistic vision (or when I got really lucky with the lighting). Enjoy this collection of "I meant to do that" masterpieces! ✨
        </motion.p>
      </div>

      {/* Gallery Grid */}
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
              const urlParams = new URLSearchParams(photo.src.split('?')[1]);
              const width = parseInt(urlParams.get('w') || '800');
              const height = parseInt(urlParams.get('h') || '600');
              return sum + (width / height);
            }, 0);
            
            // Calculate the row height to fit the container width
            const containerWidth = 1200; // Max container width
            const gapTotal = (row.length - 1) * 8; // 8px gap between images
            const availableWidth = containerWidth - gapTotal;
            const rowHeight = availableWidth / totalAspectRatio;
            
            return (
              <motion.div
                key={rowIndex}
                className="flex gap-2 mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: rowIndex * 0.1 }}
                style={{ width: containerWidth, margin: '0 auto' }}
              >
                {row.map((photo) => {
                  // Extract dimensions from URL
                  const urlParams = new URLSearchParams(photo.src.split('?')[1]);
                  const width = parseInt(urlParams.get('w') || '800');
                  const height = parseInt(urlParams.get('h') || '600');
                  const aspectRatio = width / height;
                  
                  // Calculate this image's width to fit the row height
                  const imageHeight = rowHeight;
                  const imageWidth = imageHeight * aspectRatio;
                  
                  return (
                    <motion.div
                      key={photo.id}
                      className="cursor-pointer group relative overflow-hidden rounded-lg bg-zinc-800"
                      onClick={() => setSelectedPhoto(photo)}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        width: imageWidth,
                        height: imageHeight,
                        flexShrink: 0
                      }}
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        width={width}
                        height={height}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                    </motion.div>
                  );
                })}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Modal */}
      {selectedPhoto && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedPhoto(null)}
        >
          <motion.div
            className="relative max-w-4xl max-h-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedPhoto.src}
              alt={selectedPhoto.alt}
              width={1200}
              height={800}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-white hover:text-lime-300 transition-colors duration-200"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import exifReader from 'exif-reader';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  takenTime: number;
}

export async function GET(request: NextRequest) {
  try {
    const galleryPath = path.join(process.cwd(), 'public', 'gallery');
    
    if (!fs.existsSync(galleryPath)) {
      return NextResponse.json({ error: 'Gallery folder not found' }, { status: 404 });
    }

    const files = fs.readdirSync(galleryPath);
    
    // Filter for image files only
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG', '.PNG', '.WEBP'];
    const imageFiles = files.filter(file => 
      imageExtensions.some(ext => file.toLowerCase().endsWith(ext.toLowerCase()))
    );

    const images: GalleryImage[] = [];

    for (const file of imageFiles) {
      try {
        const filePath = path.join(galleryPath, file);
        const stats = fs.statSync(filePath);
        
        // Get image dimensions using sharp
        const metadata = await sharp(filePath).metadata();
        const width = metadata.width || 800;
        const height = metadata.height || 600;
        
        // Use file modification time as fallback
        let takenTime = stats.mtime.getTime();
        
        // Try to get EXIF date taken if available
        try {
          if (metadata.exif) {
            const exifData = exifReader(metadata.exif);
            
            // Try different EXIF date fields
            const dateTime = exifData?.exif?.DateTimeOriginal || 
                           exifData?.exif?.DateTime || 
                           exifData?.exif?.DateTimeDigitized;
            
            if (dateTime) {
              // EXIF dates are in format "YYYY:MM:DD HH:MM:SS"
              const dateStr = dateTime.toString().replace(/:/g, '-', 2);
              const parsedDate = new Date(dateStr);
              if (!isNaN(parsedDate.getTime())) {
                takenTime = parsedDate.getTime();
              }
            }
          }
        } catch (exifError) {
          // Use file mtime as fallback
          console.warn(`EXIF read error for ${file}:`, exifError);
        }

        images.push({
          id: file,
          src: `/gallery/${file}`,
          alt: `Photo ${file}`,
          width,
          height,
          takenTime
        });
      } catch (error) {
        console.warn(`Error processing ${file}:`, error);
        // Skip this file and continue
        continue;
      }
    }

    // Sort by taken time (newest first)
    images.sort((a, b) => b.takenTime - a.takenTime);

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error reading gallery:', error);
    return NextResponse.json({ error: 'Failed to read gallery' }, { status: 500 });
  }
}
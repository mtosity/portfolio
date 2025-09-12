import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  takenTime: number;
}

export async function GET() {
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
        
        // Use file modification time - no Sharp processing to avoid large bundle size
        const takenTime = stats.mtime.getTime();

        images.push({
          id: file,
          src: `/gallery/${file}`,
          alt: `Photo ${file}`,
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
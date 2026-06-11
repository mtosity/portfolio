import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  takenTime: number;
}

export async function GET() {
  try {
    // List all blobs from Vercel Blob storage
    const { blobs } = await list({
      prefix: 'gallery/', // Only get files in the gallery folder
      limit: 1000, // Adjust as needed
    });

    // Filter for image files only
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const imageBlobs = blobs.filter(blob => 
      imageExtensions.some(ext => blob.pathname.toLowerCase().endsWith(ext.toLowerCase()))
    );

    const images: GalleryImage[] = imageBlobs.map(blob => {
      const filename = blob.pathname.split('/').pop() || blob.pathname;
      return {
        id: filename,
        src: blob.url,
        alt: `Photo ${filename}`,
        takenTime: new Date(blob.uploadedAt).getTime(),
      };
    });

    // Sort by upload time (newest first)
    images.sort((a, b) => b.takenTime - a.takenTime);

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error reading gallery from Blob storage:', error);
    return NextResponse.json({ error: 'Failed to read gallery' }, { status: 500 });
  }
}
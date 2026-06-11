const { put } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');

async function uploadGalleryToBlob() {
  const galleryPath = path.join(process.cwd(), 'gallery');
  
  if (!fs.existsSync(galleryPath)) {
    console.error('Gallery directory not found');
    process.exit(1);
  }

  const files = fs.readdirSync(galleryPath);
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG', '.PNG', '.WEBP'];
  const imageFiles = files.filter(file => 
    imageExtensions.some(ext => file.toLowerCase().endsWith(ext.toLowerCase()))
  );

  console.log(`Found ${imageFiles.length} images to upload`);

  for (const file of imageFiles) {
    try {
      const filePath = path.join(galleryPath, file);
      const fileBuffer = fs.readFileSync(filePath);
      
      console.log(`Uploading ${file}...`);
      
      const blob = await put(`gallery/${file}`, fileBuffer, {
        access: 'public',
      });
      
      console.log(`✓ Uploaded ${file} to ${blob.url}`);
    } catch (error) {
      console.error(`✗ Failed to upload ${file}:`, error.message);
    }
  }
  
  console.log('Upload complete!');
}

uploadGalleryToBlob().catch(console.error);
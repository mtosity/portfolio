import { listGalleryImages } from "@mtosity/lib/gallery";
import PhotographyGallery from "@/components/PhotographyGallery";

// ISR: the gallery only changes when photos are uploaded; serve a cached
// HTML shell with photo data inlined instead of a client-side fetch + spinner.
export const revalidate = 300;

export default async function Photography() {
  const photos = await listGalleryImages();
  return <PhotographyGallery photos={photos} />;
}

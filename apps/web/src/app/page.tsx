import { listGalleryImages } from "@mtosity/lib/gallery";
import { Home } from "@/components/home/Home";
import "@/components/home/home.css";

// ISR: the light table shows recent photographs from the gallery.
export const revalidate = 300;

export default async function HomePage() {
  let photos: { id: string; src: string }[] = [];
  try {
    photos = (await listGalleryImages()).slice(0, 12).map((p) => ({ id: p.id, src: p.src }));
  } catch {
    // No blob access (local without a token): the table shows only projects.
  }
  return <Home photos={photos} />;
}

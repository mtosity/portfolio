import { notFound } from "next/navigation";
import { blogPosts } from "@/data/blogPosts";

// Import all the individual blog post components
import DecodingHappinessPage from "../decoding-happiness/page";
import ReactCommonMistakesPage from "../react-common-mistakes/page";
import HoaKyVayTienPage from "../hoa-ky-vay-tien/page";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = blogPosts.find((post) => post.slug === params.slug);
  
  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  // Route to the appropriate component based on slug
  switch (params.slug) {
    case "decoding-happiness":
      return <DecodingHappinessPage />;
    case "react-common-mistakes":
      return <ReactCommonMistakesPage />;
    case "hoa-ky-vay-tien":
      return <HoaKyVayTienPage />;
    default:
      notFound();
  }
}
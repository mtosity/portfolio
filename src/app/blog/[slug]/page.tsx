import { notFound } from "next/navigation";
import { blogPosts } from "@/data/blogPosts";

// Import all the individual blog post components
import BuildingVideoCallAppPage from "../building-video-call-app/page";
import DecodingHappinessPage from "../decoding-happiness/page";
import ReactCommonMistakesPage from "../react-common-mistakes/page";
import HoaKyVayTienPage from "../hoa-ky-vay-tien/page";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = blogPosts.find((post) => post.slug === params.slug);
  
  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
    },
    twitter: {
      title: post.title,
      description: post.excerpt,
    }
  };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  // Route to the appropriate component based on slug
  switch (params.slug) {
    case "building-video-call-app":
      return <BuildingVideoCallAppPage />;
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
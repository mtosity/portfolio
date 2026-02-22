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
    return { title: "Post Not Found" };
  }

  const postUrl = `https://mtosity.com/blog/${post.slug}`;
  const publishedTime = new Date(post.date).toISOString();

  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: "Minh Tam Nguyen", url: "https://mtosity.com" }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: postUrl,
      type: "article",
      publishedTime,
      authors: ["Minh Tam Nguyen"],
      images: [
        {
          url: "/thumbnail.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      creator: "@mtosity",
      images: ["/thumbnail.png"],
    },
  };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post!.title,
    description: post!.excerpt,
    url: `https://mtosity.com/blog/${post!.slug}`,
    datePublished: new Date(post!.date).toISOString(),
    author: {
      "@type": "Person",
      name: "Minh Tam Nguyen",
      url: "https://mtosity.com",
    },
    publisher: {
      "@type": "Person",
      name: "Minh Tam Nguyen",
      url: "https://mtosity.com",
    },
    image: "https://mtosity.com/thumbnail.png",
  };

  // Route to the appropriate component based on slug
  switch (params.slug) {
    case "building-video-call-app":
      return (
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
          <BuildingVideoCallAppPage />
        </>
      );
    case "decoding-happiness":
      return (
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
          <DecodingHappinessPage />
        </>
      );
    case "react-common-mistakes":
      return (
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
          <ReactCommonMistakesPage />
        </>
      );
    case "hoa-ky-vay-tien":
      return (
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
          <HoaKyVayTienPage />
        </>
      );
    default:
      notFound();
  }
}
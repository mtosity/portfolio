import { SITE_URL } from "@mtosity/lib/constants";
import { safeJsonLd } from "@mtosity/lib/jsonld";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";

import DbPostArticle from "@/components/blog/DbPostArticle";
import {
  dbPostDate,
  formatBlogDate,
  getDbPostBySlug,
  listPublishedDbPosts,
  type DbBlogPost,
} from "@/components/blog/postSource";
import { blogPosts } from "@/data/blogPosts";

/**
 * ─── RESOLUTION ORDER ──────────────────────────────────────────────────────
 *
 *   1. LEGACY_POSTS — hand-written .tsx posts. Always win on a slug clash.
 *   2. blog_posts    — database rows, rendered from body_html.
 *   3. notFound()
 *
 * LEGACY_POSTS is EMPTY as of the 2026-08-07 migration: all 5 original posts
 * were converted to database rows and their .tsx components deleted. Every post
 * on the site now takes branch 2, which is also why they finally emit JSON-LD —
 * only this route generates it, and the folder routes used to shadow it.
 *
 * The branch is kept rather than deleted because it is the escape hatch: a post
 * needing bespoke JSX (an interactive widget the editor cannot express) can be
 * added back as a component here, and it will take precedence over any database
 * row sharing its slug.
 *
 * If you do add one, note the two route shapes do NOT resolve in the obvious
 * order:
 *
 *   apps/web/src/app/blog/<slug>/page.tsx   ← a *static* segment
 *   apps/web/src/app/blog/[slug]/page.tsx   ← this file, a *dynamic* segment
 *
 * Next.js always prefers the static segment, so a folder route silently wins
 * over everything below — including the JSON-LD this file emits. Prefer
 * registering the component in LEGACY_POSTS over creating a folder route.
 */
const LEGACY_POSTS: Record<string, ComponentType> = {};

// ISR, so a newly published database post becomes reachable without a redeploy.
export const revalidate = 300;

export async function generateStaticParams() {
  // Published only: a draft must never be pre-rendered or discoverable. It
  // stays reachable at its URL because `dynamicParams` defaults to true.
  const dbPosts = await listPublishedDbPosts();
  const legacySlugs = new Set(blogPosts.map((post) => post.slug));

  return [
    ...blogPosts.map((post) => ({ slug: post.slug })),
    ...dbPosts
      .filter((post) => !legacySlugs.has(post.slug))
      .map((post) => ({ slug: post.slug })),
  ];
}

function buildJsonLd(input: {
  title: string;
  excerpt: string;
  slug: string;
  date: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.excerpt,
    url: `${SITE_URL}/blog/${input.slug}`,
    datePublished: new Date(input.date).toISOString(),
    author: {
      "@type": "Person",
      name: "Minh Tam Nguyen",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: "Minh Tam Nguyen",
      url: SITE_URL,
    },
    image: `${SITE_URL}/thumbnail.png`,
  };
}

function socialMetadata(input: {
  title: string;
  excerpt: string;
  slug: string;
  publishedTime: string;
}): Metadata {
  const postUrl = `${SITE_URL}/blog/${input.slug}`;
  return {
    title: input.title,
    description: input.excerpt,
    authors: [{ name: "Minh Tam Nguyen", url: SITE_URL }],
    openGraph: {
      title: input.title,
      description: input.excerpt,
      url: postUrl,
      type: "article",
      publishedTime: input.publishedTime,
      authors: ["Minh Tam Nguyen"],
      images: [
        {
          url: "/thumbnail.png",
          width: 1200,
          height: 630,
          alt: input.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.excerpt,
      creator: "@mtosity",
      images: ["/thumbnail.png"],
    },
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const post = blogPosts.find((post) => post.slug === slug);
  if (post) {
    return socialMetadata({
      title: post.title,
      excerpt: post.excerpt,
      slug: post.slug,
      publishedTime: new Date(post.date).toISOString(),
    });
  }

  const dbPost = await getDbPostBySlug(slug);
  if (!dbPost) {
    return { title: "Post Not Found" };
  }

  const metadata = socialMetadata({
    title: dbPost.title,
    excerpt: dbPost.excerpt,
    slug: dbPost.slug,
    publishedTime: dbPostDate(dbPost),
  });

  if (!dbPost.published) {
    // Contract §3: an accidentally shared draft link must not be indexed. A
    // literal string keeps the emitted meta exactly `content="noindex,nofollow"`.
    metadata.robots = "noindex,nofollow";
    metadata.title = `[Draft] ${dbPost.title}`;
    // Nothing to preview socially either.
    metadata.openGraph = undefined;
    metadata.twitter = undefined;
  }

  return metadata;
}

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 1. Legacy hand-written post — wins on collision.
  const LegacyPost = LEGACY_POSTS[slug];
  if (LegacyPost) {
    const post = blogPosts.find((post) => post.slug === slug);
    return (
      <>
        {post && (
          <JsonLd
            data={buildJsonLd({
              title: post.title,
              excerpt: post.excerpt,
              slug: post.slug,
              date: post.date,
            })}
          />
        )}
        <LegacyPost />
      </>
    );
  }

  // 2. Editor-authored post. Drafts resolve too — they are reachable by URL and
  //    render a Draft badge — but they get no structured data.
  const dbPost: DbBlogPost | null = await getDbPostBySlug(slug);
  if (dbPost) {
    return (
      <>
        {dbPost.published && (
          <JsonLd
            data={buildJsonLd({
              title: dbPost.title,
              excerpt: dbPost.excerpt,
              slug: dbPost.slug,
              date: formatBlogDate(dbPostDate(dbPost)) || dbPostDate(dbPost),
            })}
          />
        )}
        <DbPostArticle post={dbPost} />
      </>
    );
  }

  // 3. Nothing matched.
  notFound();
}

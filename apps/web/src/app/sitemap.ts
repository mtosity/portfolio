import { SITE_URL } from "@mtosity/lib/constants";
import { MetadataRoute } from "next";
import { blogPosts } from "@/data/blogPosts";
import { listPublishedPosts } from "@mtosity/lib/blog";

// Posts now come from two places: the legacy hand-written .tsx posts listed in
// blogPosts.ts, and editor-authored rows in the database. Both belong in the
// sitemap. Drafts must never appear — listPublishedPosts() already excludes
// them, which is why this uses it rather than listAllPosts().
export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const legacyUrls: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // A database hiccup must not take the whole sitemap down — degrade to the
  // legacy list rather than serving a crawler a 500.
  let dbUrls: MetadataRoute.Sitemap = [];
  try {
    const posts = await listPublishedPosts();
    const legacySlugs = new Set(blogPosts.map((p) => p.slug));
    dbUrls = posts
      // Legacy wins on slug collision everywhere else (see blog/[slug]), so a
      // shadowed row must not emit a duplicate URL here either.
      .filter((post) => !legacySlugs.has(post.slug))
      .map((post) => ({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
  } catch {
    dbUrls = [];
  }

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/photography`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/notes`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    ...legacyUrls,
    ...dbUrls,
  ];
}

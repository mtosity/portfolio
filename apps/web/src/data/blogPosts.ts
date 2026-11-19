/**
 * Registry of the hand-written (.tsx) blog posts.
 *
 * These are the ONLY posts that live in source. Editor-authored posts live in
 * Postgres and are merged into the /blog index at request time — see
 * `components/blog/postSource.ts`. Adding a post here means: register it in
 * LEGACY_POSTS in `app/blog/[slug]/page.tsx` (the component), and add its
 * metadata below. Do NOT create `app/blog/<slug>/page.tsx` — Next prefers
 * the static segment and it silently shadows the dynamic route, losing the
 * JSON-LD only `[slug]` emits.
 */
export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: "Building" | "Living" | "Money" | "Tiếng Việt";
  /**
   * Optional chart data for the OG image (app/blog/[slug]/opengraph-image.tsx).
   * Present → the social card renders a labeled bar chart (values are the
   * bar magnitudes). Absent → the card is title-only. Database posts always
   * render title-only for now.
   */
  ogStack?: {
    label: string;
    detail: string;
    value: number;
  }[];
}

/**
 * One row of the /blog index, whichever source it came from. `sortTime` is the
 * post date as an epoch millisecond value so hand-written posts (human-readable
 * date strings) and DB posts (ISO timestamps) can be merged into one ordering.
 */
export interface BlogListItem {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: BlogPost["category"];
  sortTime: number;
}

/** Parses the human-readable `date` strings used above ("January 3, 2026").
 * Unparseable dates sort to the bottom rather than throwing. */
export function parseBlogDate(date: string): number {
  const t = new Date(date).getTime();
  return Number.isNaN(t) ? 0 : t;
}

/**
 * Legacy hand-written posts.
 *
 * EMPTY as of the 2026-08-07 migration — all 5 original posts now live in the
 * `blog_posts` table and render through the same path as editor-authored ones.
 * Their .tsx page components and the LEGACY_POSTS entries went with them, so
 * nothing here shadows a database row any more.
 *
 * The export is kept (rather than deleted) because the two-source merge in
 * postSource.ts and sitemap.ts is still the right shape: if a post ever needs
 * bespoke JSX again — an interactive widget the editor cannot express — adding
 * it back here plus an entry in LEGACY_POSTS restores the legacy path, and it
 * will take precedence over any database row with the same slug.
 */
export const blogPosts: BlogPost[] = [
  {
    slug: "memory-and-brain-fog",
    title: "Memory and Brain Fog: What the Evidence Says",
    date: "November 1, 2026",
    excerpt:
      "I dug through forty-plus meta-analyses on memory and brain fog. Exercise, sleep, omega-3, creatine, and the interventions that do not work, with the effect sizes attached.",
    category: "Living",
    ogStack: [
      { label: "Aerobic exercise", detail: "global cognition", value: 1.11 },
      { label: "Omega-3", detail: "attention", value: 0.98 },
      { label: "HIIT", detail: "memory", value: 0.58 },
      { label: "Creatine", detail: "memory", value: 0.31 },
      { label: "Brain apps", detail: "far transfer", value: 0.18 },
    ],
  },
];

export const categories = [
  "Building",
  "Living",
  "Money",
  "Tiếng Việt",
] as const;
export type CategoryType = (typeof categories)[number];

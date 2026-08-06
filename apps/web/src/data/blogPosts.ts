/**
 * Registry of the hand-written (.tsx) blog posts.
 *
 * These are the ONLY posts that live in source. Editor-authored posts live in
 * Postgres and are merged into the /blog index at request time — see
 * `components/blog/postSource.ts`. Adding a post here still means: create
 * `app/blog/<slug>/page.tsx`, register it below, AND add a `case` to the switch
 * in `app/blog/[slug]/page.tsx` (that switch is the documented fallback; the
 * folder route is what Next actually serves).
 */
export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: "Building" | "Living" | "Money" | "Tiếng Việt";
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

export const blogPosts: BlogPost[] = [
  {
    slug: "react-performance",
    title:
      "React Performance: From Audit to Optimization",
    date: "January 3, 2026",
    excerpt:
      "Master React performance with a systematic approach. Learn to identify wasted renders, use the React Profiler effectively, and apply optimization techniques like memoization, code splitting, and state normalization.",
    category: "Building",
  },
  {
    slug: "building-video-call-app",
    title:
      "Building a Modern Video Call Application: React, Go, WebRTC, and Redis",
    date: "September 17, 2025",
    excerpt:
      "Learn how to build a full-featured video calling application similar to Google Meet using React, Go, WebRTC, and Redis. Complete with real-time signaling, peer-to-peer communication, and modern UI.",
    category: "Building",
  },
  {
    slug: "decoding-happiness",
    title:
      "Decoding Happiness: Strategies to Cultivate Joy and Fulfillment in Everyday Life",
    date: "June 17, 2024",
    excerpt:
      "Discover evidence-based strategies to find lasting happiness beyond material pursuits. Learn how to overcome your brain&apos;s misconceptions and cultivate genuine joy through meaningful connections, gratitude, and mindful living...",
    category: "Living",
  },
  {
    slug: "react-common-mistakes",
    title: "React Common Mistakes: How to Avoid and Fix Them",
    date: "January 15, 2024",
    excerpt:
      "A comprehensive guide to the most frequent React mistakes and practical solutions with code examples to help you write better, more maintainable React applications...",
    category: "Building",
  },
  {
    slug: "hoa-ky-vay-tien",
    title: "Hoa Kỳ Vay Tiền Như Thế Nào? Vai Trò của Trái Phiếu Kho Bạc",
    date: "July 14, 2025",
    excerpt:
      "Tìm hiểu cách chính phủ Hoa Kỳ huy động vốn qua trái phiếu kho bạc, vai trò của đồng đô la như tiền dự trữ toàn cầu, và tác động của Nhật Bản trong việc nắm giữ nợ công Mỹ...",
    category: "Tiếng Việt",
  },
];

export const categories = [
  "Building",
  "Living",
  "Money",
  "Tiếng Việt",
] as const;
export type CategoryType = (typeof categories)[number];

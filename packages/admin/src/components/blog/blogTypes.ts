/**
 * Blog admin types — deliberately free of any "use client" directive and of
 * any Tiptap import, so both server and client code (and the API workstream)
 * can share them. Field names are camelCase on the wire, mirroring
 * packages/lib/src/notes.ts.
 */

export const BLOG_CATEGORIES = [
  "Building",
  "Living",
  "Money",
  "Tiếng Việt",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export function isBlogCategory(value: string): value is BlogCategory {
  return (BLOG_CATEGORIES as readonly string[]).includes(value);
}

/** data-anchor-key / definition key / code-example key. */
export const ANCHOR_KEY_PATTERN = /^[a-zA-Z0-9_-]+$/;

export interface BlogPostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  coverImage: string | null;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostRecord extends BlogPostSummary {
  bodyHtml: string;
  bodyJson: unknown | null;
}

export interface BlogPostInput {
  title: string;
  /**
   * Optional slug override. Omit to let the server derive it from the title.
   * The editor sends the existing slug when editing so that renaming a
   * published post's title doesn't silently move its URL.
   */
  slug?: string;
  excerpt: string;
  category: BlogCategory;
  coverImage: string | null;
  bodyHtml: string;
  bodyJson: unknown;
  published: boolean;
}

export interface BlogDefinition {
  key: string;
  title: string;
  contentHtml: string;
}

export interface CodeSnippet {
  code: string;
  language: string;
  explanation: string;
}

export interface BlogCodeExample {
  key: string;
  title: string;
  description: string;
  wrongCode: CodeSnippet | null;
  correctCode: CodeSnippet | null;
  alternativeCode: CodeSnippet | null;
}

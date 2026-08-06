"use client";

/**
 * The single place the blog admin UI talks to the server.
 *
 * The API handlers (packages/admin/src/api/blog*.ts) are built by another
 * workstream; everything URL- or envelope-shaped is isolated here so
 * repointing is a one-file change. Response unwrapping is deliberately
 * tolerant: `{ posts: [...] }`, `{ data: [...] }` and a bare array all work,
 * as do object maps keyed by `key` for definitions / code examples.
 */

export const BLOG_ENDPOINTS = {
  /** GET (list) + POST (create) — src/api/blog.ts */
  posts: "/api/admin/blog",
  /** GET + PUT + DELETE — src/api/blog-post.ts */
  post: (id: string) => `/api/admin/blog/${encodeURIComponent(id)}`,
  /**
   * Definitions AND code examples share one handler (src/api/blog-definitions.ts),
   * discriminated by a `kind` field: GET returns both lists, POST/PUT upserts,
   * DELETE takes ?kind=&key=.
   */
  anchorSources: "/api/admin/blog-definitions",
  anchorSource: (kind: "definition" | "code", key: string) =>
    `/api/admin/blog-definitions?kind=${kind}&key=${encodeURIComponent(key)}`,
};

/* Types live in blogTypes.ts (no "use client", no Tiptap) and are re-exported
   here so callers only need one import. */
export * from "./blogTypes";

import type {
  BlogCodeExample,
  BlogDefinition,
  BlogPostInput,
  BlogPostRecord,
  BlogPostSummary,
} from "./blogTypes";

/* ------------------------------------------------------------------ */
/* Fetch plumbing                                                      */
/* ------------------------------------------------------------------ */

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers:
      init?.body && !(init.body instanceof FormData)
        ? { "Content-Type": "application/json", ...(init?.headers ?? {}) }
        : init?.headers,
  });
  const text = await res.text();
  let json: unknown = null;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }
  }
  if (!res.ok) {
    const message =
      (json as { error?: string } | null)?.error ??
      (res.status === 404 ? "Not found" : `Request failed (${res.status})`);
    throw new Error(message);
  }
  return json as T;
}

function unwrapList<T>(payload: unknown, ...keys: string[]): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    for (const key of [...keys, "data", "items"]) {
      const value = record[key];
      if (Array.isArray(value)) return value as T[];
      // Tolerate an object map: { someKey: { title, ... } }
      if (value && typeof value === "object") {
        return Object.entries(value as Record<string, object>).map(
          ([k, v]) => ({ key: k, ...v }) as T
        );
      }
    }
  }
  return [];
}

function unwrapOne<T>(payload: unknown, ...keys: string[]): T {
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    for (const key of [...keys, "data"]) {
      const value = record[key];
      if (value && typeof value === "object") return value as T;
    }
  }
  return payload as T;
}

/* ------------------------------------------------------------------ */
/* Posts                                                               */
/* ------------------------------------------------------------------ */

export async function listBlogPosts(): Promise<BlogPostSummary[]> {
  return unwrapList<BlogPostSummary>(
    await request<unknown>(BLOG_ENDPOINTS.posts),
    "posts"
  );
}

export async function getBlogPost(id: string): Promise<BlogPostRecord> {
  return unwrapOne<BlogPostRecord>(
    await request<unknown>(BLOG_ENDPOINTS.post(id)),
    "post"
  );
}

export async function createBlogPost(
  input: BlogPostInput
): Promise<BlogPostRecord> {
  return unwrapOne<BlogPostRecord>(
    await request<unknown>(BLOG_ENDPOINTS.posts, {
      method: "POST",
      body: JSON.stringify(input),
    }),
    "post"
  );
}

export async function updateBlogPost(
  id: string,
  input: BlogPostInput
): Promise<BlogPostRecord> {
  return unwrapOne<BlogPostRecord>(
    await request<unknown>(BLOG_ENDPOINTS.post(id), {
      method: "PUT",
      body: JSON.stringify(input),
    }),
    "post"
  );
}

export async function deleteBlogPost(id: string): Promise<void> {
  await request<unknown>(BLOG_ENDPOINTS.post(id), { method: "DELETE" });
}

/* ------------------------------------------------------------------ */
/* Anchor sources — definitions + code examples share one endpoint     */
/* ------------------------------------------------------------------ */

export interface AnchorSourcePayload {
  definitions: BlogDefinition[];
  codeExamples: BlogCodeExample[];
}

/** One round trip for both lists — what the anchor picker needs. */
export async function listAnchorSources(): Promise<AnchorSourcePayload> {
  const payload = await request<unknown>(BLOG_ENDPOINTS.anchorSources);
  return {
    definitions: unwrapList<BlogDefinition>(payload, "definitions"),
    codeExamples: unwrapList<BlogCodeExample>(payload, "codeExamples"),
  };
}

export async function listDefinitions(): Promise<BlogDefinition[]> {
  return (await listAnchorSources()).definitions;
}

export async function listCodeExamples(): Promise<BlogCodeExample[]> {
  return (await listAnchorSources()).codeExamples;
}

/** Create and update are the same upsert-on-key call server-side. */
export async function saveDefinition(
  input: BlogDefinition
): Promise<BlogDefinition> {
  return unwrapOne<BlogDefinition>(
    await request<unknown>(BLOG_ENDPOINTS.anchorSources, {
      method: "POST",
      body: JSON.stringify({ kind: "definition", ...input }),
    }),
    "definition"
  );
}

export async function deleteDefinition(key: string): Promise<void> {
  await request<unknown>(BLOG_ENDPOINTS.anchorSource("definition", key), {
    method: "DELETE",
  });
}

export async function saveCodeExample(
  input: BlogCodeExample
): Promise<BlogCodeExample> {
  return unwrapOne<BlogCodeExample>(
    await request<unknown>(BLOG_ENDPOINTS.anchorSources, {
      method: "POST",
      body: JSON.stringify({ kind: "code", ...input }),
    }),
    "codeExample"
  );
}

export async function deleteCodeExample(key: string): Promise<void> {
  await request<unknown>(BLOG_ENDPOINTS.anchorSource("code", key), {
    method: "DELETE",
  });
}

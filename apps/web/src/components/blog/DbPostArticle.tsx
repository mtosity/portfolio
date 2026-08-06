/**
 * Renders an editor-authored (DB) post inside the same <BlogLayout /> the
 * hand-written posts use, so it inherits the sidebar, the TOC and the
 * .blog-article typography for free.
 *
 * Server component on purpose: `renderBlogHtml` needs no DOM, so the body is
 * parsed once during SSR/SSG rather than on every client hydration.
 */

import BlogLayout from "./BlogLayout";
import DraftBadge from "./DraftBadge";
import { renderBlogHtml } from "./htmlToReact";
import {
  dbPostDate,
  formatBlogDate,
  loadDbAnchors,
  type DbBlogPost,
} from "./postSource";

export default async function DbPostArticle({ post }: { post: DbBlogPost }) {
  // DB-authored anchor targets. BlogLayout spreads definitions.tsx on top of
  // these, so a key defined in both resolves to the hand-written one (§4).
  const anchors = await loadDbAnchors();

  return (
    <BlogLayout
      extraDefinitions={anchors.definitions}
      extraCodeExamples={anchors.codeExamples}
      title={post.title}
      // A never-published draft has no publishedAt; fall back to its created
      // date so the header is not blank while previewing.
      date={formatBlogDate(dbPostDate(post))}
      category={post.category}
    >
      {/* Rendered inside <article class="blog-article">, which is what
          BlogLayout scans for headings — the TOC therefore picks up the
          h2/h3s in body_html with no extra plumbing. */}
      {!post.published && <DraftBadge />}
      {renderBlogHtml(post.bodyHtml)}
    </BlogLayout>
  );
}

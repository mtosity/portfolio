/**
 * Unmissable "this is not live" marker for unpublished posts (contract §3).
 *
 * A draft is reachable at its real URL so it can be shared for review, which
 * means a shared link is indistinguishable from a published one unless the page
 * says so. Paired with `robots: "noindex,nofollow"` in the route's metadata.
 *
 * Deliberately not a heading element — BlogLayout builds the TOC by scanning
 * the article for h1–h6, and this must not appear in it.
 */
export default function DraftBadge() {
  return (
    <div
      role="status"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        border: "1px dashed var(--border)",
        background: "var(--bg-secondary)",
        padding: "0.75rem 1rem",
        marginBottom: "2rem",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.62rem",
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--bg)",
          background: "var(--fg)",
          padding: "0.2rem 0.5rem",
          flexShrink: 0,
        }}
      >
        Draft
      </span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.72rem",
          lineHeight: 1.5,
          color: "var(--muted)",
        }}
      >
        Unpublished — not listed on /blog and not indexed by search engines.
      </span>
    </div>
  );
}

import { ImageResponse } from "next/og";

import {
  dbPostDate,
  formatBlogDate,
  getDbPostBySlug,
} from "@/components/blog/postSource";
import { blogPosts } from "@/data/blogPosts";

/**
 * OG card for blog posts, drawn as an HTML/SVG diagram card via satori
 * (flat CSS subset: flexbox, no grid/shadows). Palette mirrors the design
 * system tokens: #f5f5f7 surface, #1d1d1f ink, #0071e3 accent.
 *
 * This IS the generation pipeline: every post gets a card automatically,
 * rendered from its registry data at request time. A source post with an
 * `ogStack` in data/blogPosts.ts gets the labeled bar-chart card; every
 * other post (including database posts) gets the same frame with the
 * title full-width. Next wires the result into og:image automatically.
 */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "MTosity blog post card";

const MAX_BAR = 1.2;

const muted = "#6e6e73";
const ink = "#1d1d1f";
const hairline = "#e8e8ed";
const accent = "#0071e3";

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let title = "";
  let date = "";
  let category = "Building";

  const legacy = blogPosts.find((post) => post.slug === slug);
  if (legacy) {
    title = legacy.title;
    date = legacy.date;
    category = legacy.category;
  } else {
    try {
      const dbPost = await getDbPostBySlug(slug);
      if (dbPost) {
        title = dbPost.title;
        date = formatBlogDate(dbPostDate(dbPost)) || dbPostDate(dbPost);
        category = dbPost.category;
      }
    } catch {
      // Database unreachable at image-generation time: fall through.
    }
  }

  if (!title) {
    title = slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const isDiagramCard = Boolean(legacy?.ogStack && legacy.ogStack.length > 0);
  const stack = legacy?.ogStack ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#f5f5f7",
          padding: 56,
          fontFamily: "sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                background: accent,
                color: "#ffffff",
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: 2,
                padding: "10px 24px",
                borderRadius: 999,
                display: "flex",
              }}
            >
              MTOSITY
            </div>
            <div
              style={{
                marginLeft: 16,
                color: muted,
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: 3,
                display: "flex",
              }}
            >
              {category.toUpperCase()}
            </div>
          </div>
          <div style={{ color: muted, fontSize: 24, display: "flex" }}>
            {date}
          </div>
        </div>

        {/* Body */}
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            gap: 48,
            marginTop: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: isDiagramCard ? 1 : 2,
            }}
          >
            <div
              style={{
                color: ink,
                fontSize: isDiagramCard ? 62 : 72,
                fontWeight: 700,
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                display: "flex",
              }}
            >
              {title}
            </div>
            <div
              style={{
                marginTop: 28,
                color: muted,
                fontSize: 26,
                display: "flex",
              }}
            >
              mtosity.com/blog/{slug}
            </div>
          </div>

          {isDiagramCard && (
            <div
              style={{
                width: 520,
                background: "#ffffff",
                border: `1px solid ${hairline}`,
                borderRadius: 28,
                padding: 36,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  color: muted,
                  fontSize: 20,
                  fontWeight: 700,
                  letterSpacing: 3,
                  marginBottom: 28,
                  display: "flex",
                }}
              >
                THE EVIDENCE STACK
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 26,
                }}
              >
                {stack.map((row) => (
                  <div
                    key={row.label}
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          gap: 10,
                        }}
                      >
                        <span style={{ fontSize: 25, fontWeight: 600, color: ink }}>
                          {row.label}
                        </span>
                        <span style={{ fontSize: 19, color: muted }}>
                          {row.detail}
                        </span>
                      </div>
                      <span style={{ fontSize: 25, fontWeight: 700, color: accent }}>
                        {row.value.toFixed(2)}
                      </span>
                    </div>
                    <div
                      style={{
                        height: 13,
                        background: hairline,
                        borderRadius: 999,
                        display: "flex",
                      }}
                    >
                      <div
                        style={{
                          width: `${(row.value / MAX_BAR) * 100}%`,
                          background: accent,
                          borderRadius: 999,
                          display: "flex",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: 28,
                  color: muted,
                  fontSize: 17,
                  display: "flex",
                }}
              >
                Pooled effect sizes (SMD), meta-analyses cited in the post
              </div>
            </div>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
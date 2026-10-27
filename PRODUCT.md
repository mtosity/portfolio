# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## What it is

mtosity.com — the personal site of Minh Tam Nguyen ("MTosity"), a software engineer in the United States (Software Engineer II at SAS Institute since Apr 2026; previously Coalition, Pixie, Vinbrain). Self-described "Baymax Engineer": the drawn self-portrait with Baymax sitting on his head is the site's emblem and stays, in spirit, through any redesign.

## Audiences and jobs

- **Recruiters / hiring managers / engineers** skimming in under a minute: who is this, what has he shipped, how to reach him (email, LinkedIn, GitHub).
- **Readers** of the blog (`/blog`): long-form posts in four categories (Building, Living, Money, Tiếng Việt), with interactive definition and code anchors in a sidebar. Bilingual content (Vietnamese diacritics must render well).
- **Visitors to the photography** (`/photography`): personal photos from walks, travel, restaurants, parks — justified gallery + lightbox.
- **Tool users** (`/tools/*`): in-browser utilities — Speech to Text (on-device Whisper), Image Grid (canvas compositor), Video Extractor (yt-dlp + Whisper).
- **The owner** at `/admin/*` (notes, blog editor, photo uploads) — Operate surface, owner-only.
- **Other projects** (thestockie, alpaca dashboard) consume `@mtosity/design-system`.

## Surfaces and modes

- `/` home — Experience/Persuade: who he is, work, projects, contact.
- `/blog`, `/blog/[slug]`, `/notes` — Read.
- `/photography` — Experience (gallery).
- `/tools`, `/tools/*` — Operate.
- `/design-system` — Read (living reference of the package).
- `/admin/*` — Operate.

## Constraints

- All existing copy is kept verbatim (hero, about, experience bullets, project descriptions, tool copy, blog content). Images may be replaced if they keep the same purpose.
- Content lives in Postgres (blog), Vercel Blob (photos), Leaflet feed (notes); the blog anchor HTML contract (`data-anchor`) must not change.
- Next.js 16 App Router, React 19, Tailwind v4 CSS-first, Framer Motion, Sass modules. pnpm monorepo, single Vercel deploy.
- Light theme is the default; dark is opt-in via toggle (`data-theme`).
- Accessibility: keyboard reachable, reduced-motion respected, readable on phones.

## Brand commitments

- Owner-pinned references (2026-10-27): nytimes.com for reading surfaces; bruno-simon.com for interactive 3D; mesh3d.gallery/websites; cofounder.co for the home page; bradandjen.com for the gallery.
- "Make it feel like a human built it with care and details."
- Home hero carries an interactive 3D scene (owner decision 2026-10-27).
- `@mtosity/design-system` may break its API in the redesign; consumers stay pinned to 0.6.x until migrated.

## Evidence

Real only: job history and bullets on the home page, project list with links, tool list, published blog posts, real photographs. No invented testimonials, metrics, or clients.

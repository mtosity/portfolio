# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm dev` - Start the development server
- `pnpm build` - Build the production application
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint
- `pnpm upload-gallery` - Upload images to Vercel Blob storage for the photography page

**Package manager: pnpm** (not npm or yarn)

## Architecture Overview

Next.js 16 portfolio site using the App Router. TypeScript strict mode, Tailwind CSS, Sass modules, and Framer Motion for animations.

### Pages & Routing

- `/` — Home page with animated logo + sections (About, Experience, Projects, Contact)
- `/blog` — Blog index, filterable by category
- `/blog/[slug]` — Dynamic route that renders individual blog post components
- `/photography` — Photo gallery backed by Vercel Blob
- `/notes` — Notes page

### Blog System

Blog posts are written as standalone Next.js page components under `src/app/blog/<slug>/page.tsx` and wrapped with `BlogLayout`. To add a new post:

1. Create `src/app/blog/<slug>/page.tsx` using `BlogLayout` as the wrapper
2. Register the post in `src/data/blogPosts.ts` (slug, title, date, excerpt, category)
3. Add a `case` to the switch in `src/app/blog/[slug]/page.tsx` that imports and returns the new component

`BlogLayout` provides a dynamic sidebar with three modes: table of contents (auto-extracted from headings), inline definitions (`InteractiveAnchor`), and code examples (`CodeAnchor`). State flows through `BlogContext`. Definitions and code examples are stored in `src/components/blog/definitions.tsx`.

### Photography Gallery

Images are served from Vercel Blob storage (requires `BLOB_READ_WRITE_TOKEN`). The API route `src/app/api/gallery/route.ts` lists blobs under the `gallery/` prefix. Upload new photos with `pnpm upload-gallery` (see `scripts/upload-to-blob.js`). The page uses a custom justified-grid layout that computes row heights from actual image aspect ratios.

### MTosity Component

`src/components/mtosity.tsx` is the animated logo/hero on the home page. It uses browser-only APIs (scroll, window) so it is dynamically imported with `ssr: false` in `src/app/page.tsx`.

### Styling

- Global styles: `src/app/globals.css`
- Component-level: Sass modules (`.module.scss`) co-located with each component, named in kebab-case
- Utilities: Tailwind CSS
- Fonts loaded via `next/font/google`: Inter (`--font-inter`), Crimson Text (`--font-crimson-text`), Lora (`--font-lora`)

### Path Alias

`@/*` → `./src/*`

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo Layout

Turborepo + pnpm workspace. **Package manager: pnpm** (not npm or yarn).

- `apps/web` — the Next.js 16 app (App Router, React 19, TypeScript strict, Tailwind CSS v4, Sass modules, Framer Motion). The only deployable; routes under `src/app` are thin where the implementation lives in a package.
- `packages/design-system` (`@mtosity/design-system`) — design tokens (`src/tokens.css`, Tailwind v4 `@theme static` + `:root` vars), reusable UI (SlideTabs, ThemeToggle, AccentButton, ConfirmDialog, Reveal, SectionHeader, buttons), hooks (`useIsMobile`/`useMediaQuery`), and utility classes (`.chip`, `.link-hover`, `.theme-light-scope`). Dark theme = `[data-theme="dark"]` on `<html>` (toggle + no-flash script in the web app's root layout); Tailwind's `dark:` variant is remapped to that attribute via `@custom-variant` in tokens.css. See DESIGN.md → "Dark Theme". Gotcha: the next/font variable classes must stay on `<html>` (not `<body>`) so `:root` aliases like `--font-heading` can resolve them.
- `packages/lib` (`@mtosity/lib`) — shared utils/constants via subpath exports: `constants` (SITE_URL etc.), `db` (Neon), `notes`, `blog`, `blog-definitions`, `rate-limit` (Upstash), `jsonld`.
- `packages/admin` (`@mtosity/admin`) — NextAuth (GitHub, owner-only) config at `./auth`, admin pages (barrel export), admin API handlers at `./api/*`.
- `packages/tool-*` — one package per tool on the `/tools` page (`tool-speech-to-text`, `tool-img-grid`, `tool-instagram`). Each exports its page component; instagram also exports API handlers at `./api/*`.
- `packages/whisper` (`@mtosity/whisper`) — shared WASM Whisper worker. Tools ship a one-line `src/whisper-worker.ts` entry importing `@mtosity/whisper/worker` because webpack workers need a package-relative `new URL(...)`.
- `packages/typescript-config` — shared tsconfig bases (`base`, `nextjs`, `react-library`) and ambient types (`css-modules.d.ts`, `styled-jsx.d.ts`) referenced via each package's tsconfig `files`.

All packages are source-only (no build step) and listed in `transpilePackages` in `apps/web/next.config.mjs`. Shared dependency versions live in the pnpm `catalog:` in `pnpm-workspace.yaml`.

## Commands (run from repo root)

- `pnpm dev` — start the dev server (via turbo)
- `pnpm build` — production build
- `pnpm lint` — ESLint (flat config, `eslint .` in apps/web — `next lint` was removed in Next 16)
- `pnpm typecheck` — `tsc --noEmit` across all packages
- `pnpm upload-gallery` — upload images to Vercel Blob for the photography page

## Conventions & Gotchas

- **Route files stay thin but segment configs stay literal**: `export const dynamic` / `runtime` / `maxDuration` and `metadata` must be written literally in `apps/web/src/app/**/route.ts|page.tsx|layout.tsx` (Next statically analyzes them); the handler/component itself is re-exported from a package.
- **Tailwind v4 is CSS-first**: no `tailwind.config.ts`. Entry is `@import "tailwindcss"` in `apps/web/src/app/globals.css`, tokens via `@theme static` in the design-system package, and `@source` directives point the scanner at `packages/*/src`. When adding a new package whose components use Tailwind classes, add an `@source` line.
- The whisper worker URL must remain `new URL("./whisper-worker.ts", import.meta.url)` relative to the importing package file.
- `@huggingface/transformers` must remain a direct dependency of `apps/web` (in addition to `@mtosity/whisper`) so `serverExternalPackages` can externalize it.
- yt-dlp binaries download to `apps/web/bin/` via the `postinstall` script and are traced into the instagram API functions via `outputFileTracingIncludes`.

## Pages

- `/` home, `/blog` + `/blog/[slug]`, `/photography` (Vercel Blob), `/notes`, `/tools/*`, `/admin/*` (GitHub-auth gated via middleware) — admin covers notes, photography, and blog (`/admin/blog`, `/admin/blog/definitions`).

### Blog System

Posts come from **two sources**, and the split is deliberate.

**1. Legacy hand-written posts** (the original 5) — standalone page components at `apps/web/src/app/blog/<slug>/page.tsx` wrapped with `BlogLayout`, registered in `apps/web/src/data/blogPosts.ts`. They use JSX-only interactive components (`InteractiveAnchor`, `CodeAnchor`, `CodeBlock`, `LottieAnimation`) that an editor cannot express, so they are **not** migrated. Leave them alone.

**2. Editor-authored posts** — rows in the Neon `blog_posts` table, written through `/admin/blog` and rendered dynamically. No deploy needed to publish.

**Route resolution** in `apps/web/src/app/blog/[slug]/page.tsx`: legacy `switch` first, then DB lookup, then `notFound()`. Legacy always wins on a slug collision. Note Next prefers a static `blog/<slug>/page.tsx` folder route over the dynamic `[slug]` route, so for the 5 legacy posts the switch never actually executes — it is kept complete so a DB row can never shadow a legacy slug. (Consequence: legacy posts currently emit no JSON-LD, since only `[slug]` generates it.)

**Drafts**: `published = false` is reachable at `/blog/<slug>` but excluded from the index, from `generateStaticParams` and from the sitemap, and renders `robots: noindex,nofollow` plus a visible badge. Publishing stamps `published_at`; unpublishing preserves it, so re-publishing keeps the original date.

**Anchors** are stored in `body_html` as `<span data-anchor="definition|code" data-anchor-key="KEY">label</span>` — produced by the Tiptap nodes in `packages/admin/src/components/blog/anchorNodes.ts` and converted back into the real `InteractiveAnchor`/`CodeAnchor` components by `apps/web/src/components/blog/htmlToReact.tsx`. **That HTML shape is a contract between the editor and the renderer; changing one side silently breaks every anchor at runtime.** `htmlToReact` builds React elements directly (no `dangerouslySetInnerHTML`) and sanitises structurally via tag/attribute allowlists.

**Definitions and code examples** resolve **static file first, then DB**: `apps/web/src/components/blog/definitions.tsx` keeps serving the legacy posts, and rows in `blog_definitions` / `blog_code_examples` (managed at `/admin/blog/definitions`) are merged on top. A key in both → static wins, so an editor-authored key can never break an existing post.

**Blog slugs fold diacritics** (`slugify` in `packages/lib/src/blog.ts`) so "Hoa Kỳ Vay Tiền" → `hoa-ky-vay-tien`. The notes slugifier deliberately still strips non-ASCII — the notes page derives slugs from titles at read time for deep links, so changing it would break already-shared note URLs.

## Deployment

Single Vercel project. Root `vercel.json` builds the workspace (`turbo run build`) with output at `apps/web/.next`. Requires `BLOB_READ_WRITE_TOKEN`, Neon Postgres (`DATABASE_URL`), `AUTH_*` (NextAuth GitHub), and optionally Upstash KV env vars.

## Design Documentation

`DESIGN.md` is the canonical design reference. **Always keep it up to date** when making visual changes — colors, typography, spacing, layout, animations, components, or page structure. Token changes belong in `packages/design-system/src/tokens.css` and the DESIGN.md palette table together.

The rendered showcase lives at `/design-system` (`apps/web/src/app/design-system/`). When you change `@mtosity/design-system` tokens, components, or version, follow `packages/design-system/AGENTS.md` to keep that page in sync.

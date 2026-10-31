# DESIGN.md — mtosity.com Portfolio

Comprehensive design reference for the portfolio site. Every visual decision — colors, type, spacing, animation, layout — documented in one place.

---

## Design Philosophy

**Apple HIG, with the site's own voice.** The interface follows Apple's Human
Interface Guidelines (via the `apple-design` skill): the system palette —
white and `#f5f5f7` grouped surfaces in light, true black and `#1c1c1e` in
dark — SF Pro for UI and body text, capsule controls, inset-grouped lists,
rounded cards, soft ambient shadows, a glass navigation bar, springs for
motion, and an appearance that follows the OS.

What stays from the earlier site, on purpose (HIG › Branding: brand lives in
colour, type, tone and a few defining moments, while familiar components carry
navigation):

- **The purple tint** — Apple's system purple, a step deeper (`#9a3fd1`) so
  white text on it holds 5.2:1. It replaces the earlier `#7b46f2` violet and
  is used for what is tappable and for selection, never for decoration.
- **Bricolage Grotesque** as the display face — hero name, page and section
  titles, set squeezed (`font-stretch: 88%`). Apple's own advice is a custom
  face for headlines and the system font for body copy and captions.
- **Literata italic asides** inside headlines ("Small tools. *Built to be
  useful.*", "Let's work *together.*").
- **The purple hover fill** on list rows (projects, tools, contact) — now a
  rounded selection inside an inset-grouped list, like a macOS sidebar row.
- **Index numerals** (`01`–`07`) in purple SF Mono.
- The motion set pieces: the clip-reveal parallax name, the skills ticker,
  clip-path row wipes, and the confetti logo.

Accessibility floor: body text 17px, nothing below 11px; text contrast at
least 4.5:1 in both appearances (numbers in the palette tables);
`prefers-contrast: more`, `prefers-reduced-transparency` and
`prefers-reduced-motion` all have answers; 44px hit targets on touch.

---

## Color Palette

Tokens are defined once in `packages/design-system/src/tokens.css` — as a Tailwind v4
`@theme static` block (exposing utilities like `bg-accent`, `text-muted`) plus plain
`:root` CSS variables consumed by SCSS modules and inline styles. Values are
Apple's system colours as used on apple.com / iOS. Chart 5 is the exact system purple (`#af52de` / `#bf5af2`).

| Token               | Light                        | Role (HIG name)                        | Contrast on `--bg` |
|---------------------|------------------------------|----------------------------------------|---------|
| `--bg`              | `#ffffff`                    | systemBackground — page                 | — |
| `--bg-secondary`    | `#f5f5f7`                    | grouped background — cards, lists, sidebar, code | — |
| `--bg-tertiary`     | `#e8e8ed`                    | raised surface                          | — |
| `--fg`              | `#1d1d1f`                    | label                                   | 16.8:1 |
| `--muted`           | `#6e6e73`                    | secondaryLabel — dates, captions, ledes | 5.1:1 (4.7:1 on `#f5f5f7`) |
| `--accent`          | `#9a3fd1` (system purple, deepened) | tint as a fill — buttons, selection, hover rows | white on it 5.2:1 |
| `--accent-text`     | `#8944ab` (Apple accessible purple) | tint as text — links, numerals, current item | 6.0:1 (5.5:1 on `#f5f5f7`) |
| `--accent-soft`     | purple 12%                   | tinted fill — selected TOC row, tinted buttons, focus halo | — |
| `--accent-fg`       | `#ffffff`                    | ink on purple (same in dark)            | — |
| `--accent-fg-muted` | `#f7eefc`                    | secondary ink on purple (same in dark)  | 4.6:1 on the fill |
| `--fill`            | `rgba(120,120,128,.12)`      | systemFill — chips, segmented track, secondary buttons | — |
| `--fill-strong`     | `rgba(120,120,128,.20)`      | stronger fill — switch track, disabled button | — |
| `--border`          | `#d2d2d7`                    | separator — field outlines, strong rules | — |
| `--border-light`    | `#e8e8ed`                    | separator · light — section and list rules | — |
| `--danger`          | `#d70015`                    | accessible red — destructive            | 5.4:1 |
| `--material-bar`    | white 72% + `saturate(180%) blur(20px)` | glass nav bar (the only translucent surface) | — |
| `--material-thick`  | `rgba(250,250,252,.86)`      | menus, alerts, floating buttons         | — |
| `--shadow-sm/md/lg` | soft ambient shadows         | elevation (legacy `--shadow-brutal*` alias md/lg) | — |
| `--radius-xs…xl`    | 6 / 8 / 12 / 18 / 28px, `--radius-full` | controls 8, rows 12, cards 18, sheets 28, capsules | — |
| `--hit`             | 28px, 44px on `pointer: coarse` | minimum control height             | — |
| `--ease-out`        | `cubic-bezier(.32,.72,0,1)`  | iOS sheet curve; `--duration-fast` 160ms, `--duration` 320ms | — |

### Dark Theme

Activated by `data-theme="dark"` on `<html>`. True black base with elevated
`#1c1c1e` surfaces, like iOS. The purple fill is shared; its text form
lightens to hold contrast.

| Token            | Dark value             | Contrast |
|------------------|------------------------|----------|
| `--bg`           | `#000000`              | — |
| `--bg-secondary` | `#1c1c1e`              | — |
| `--bg-tertiary`  | `#2c2c2e`              | — |
| `--fg`           | `#f5f5f7`              | 19.3:1 |
| `--muted`        | `#98989d`              | 7.3:1 (5.9:1 on `#1c1c1e`) |
| `--accent`       | `#9a3fd1` (unchanged)  | white on it 5.2:1 |
| `--accent-text`  | `#bf5af2` (Apple dark purple) | 6.0:1 (4.8:1 on `#1c1c1e`) |
| `--border`       | `#38383a`              | — |
| `--border-light` | `#2c2c2e`              | — |
| `--danger`       | `#ff453a`              | 6.2:1 |

**Increased contrast** (`@media (prefers-contrast: more)`) darkens/lightens
`--muted`, the separators and `--accent-text` in both appearances.
**Reduced transparency** makes the materials opaque.

Mechanics (all in `tokens.css` unless noted):

- `[data-theme="dark"]` overrides the `:root` vars, the Tailwind `--color-*`
  vars, and the legacy aliases; it also flips `color-scheme`.
- `@custom-variant dark` remaps Tailwind's `dark:` variant from
  `prefers-color-scheme` to `[data-theme="dark"]`.
- An inline no-flash script in `apps/web/src/app/layout.tsx` applies the theme
  before first paint. **It follows the OS appearance** (and keeps following it
  live) until the visitor presses the toggle; that choice is saved in
  `localStorage.theme` and wins from then on. `<html>` has
  `suppressHydrationWarning`. `themeColor` is white / black per scheme.
- `ThemeToggle` (design system) sits in the `SlideTabs` nav as a round 36px
  button; the sun/moon icons swap via pure CSS (`.theme-toggle-*` rules), so the
  button is hydration-safe. (HIG prefers no in-app appearance switch; on a
  website it stays as an override, with the OS as the default.)
- `.theme-light-scope` re-establishes the light palette inside a subtree.
- Anything sitting on a purple surface uses `--accent-fg` / `--accent-fg-muted`
  ("ink on purple", white in both themes), never `--fg`. Hover rows
  (`.ds-group-row`, projects, tools, contact, admin dashboard actions) re-point
  `--fg`/`--muted`/`--accent-text`/`--border-light` inside the `:hover` rule so
  children pop without per-element overrides.

### Notes Page — Sticky Note Colors

8-color pastel palette cycling per card:

| Name     | Background | Border    |
|----------|-----------|-----------|
| Yellow   | `#fff9c4` | `#f9e44c` |
| Pink     | `#f8bbd0` | `#e57fa2` |
| Blue     | `#bbdefb` | `#7eb8e4` |
| Green    | `#c8e6c9` | `#81c784` |
| Lavender | `#e1bee7` | `#ba8ec4` |
| Peach    | `#ffe0b2` | `#e6a95c` |
| Cyan     | `#b2ebf2` | `#6cc9d6` |
| Purple   | `#d1c4e9` | `#9e8ec4` |

### Blog Definition Callouts — `--def-*`

The definition sidebar renders pastel callout cards inside each definition.
Twelve hues, each a `{bg, border, text}` triad, themed via `--def-<hue>-<role>`.

| Hue     | Light bg / border / text          | Dark bg / border / text           |
|---------|-----------------------------------|-----------------------------------|
| green   | `#f0fdf4` `#86efac` `#2d7a4f`     | `#0a2216` `#2d7a4f` `#86efac`     |
| blue    | `#eff6ff` `#93c5fd` `#2563eb`     | `#0c1a2e` `#2563eb` `#93c5fd`     |
| purple  | `#faf5ff` `#d8b4fe` `#7c3aed`     | `#1a0f2e` `#7c3aed` `#d8b4fe`     |
| red     | `#fef2f2` `#fca5a5` `#c0392b`     | `#2a0f0f` `#c0392b` `#fca5a5`     |
| gray    | `#f9fafb` `#d1d5db` `#374151`     | `#1a1916` `#4a4740` `#d1d5db`     |
| amber   | `#fefce8` `#fde68a` `#b45309`     | `#2a1f08` `#b45309` `#fde68a`     |
| teal    | `#f0fdfa` `#5eead4` `#0f766e`     | `#062420` `#0f766e` `#5eead4`     |
| orange  | `#fff7ed` `#fdba74` `#c2410c`     | `#2a1608` `#c2410c` `#fdba74`     |
| indigo  | `#eef2ff` `#a5b4fc` `#4f46e5`     | `#12142e` `#4f46e5` `#a5b4fc`     |
| pink    | `#fdf2f8` `#f9a8d4` `#be185d`     | `#2a0f1c` `#be185d` `#f9a8d4`     |
| yellow  | `#fffbeb` `#fcd34d` `#a16207`     | `#2a2208` `#a16207` `#fcd34d`     |
| emerald | `#ecfdf5` `#6ee7b7` `#047857`     | `#06231a` `#047857` `#6ee7b7`     |

In dark mode the background drops to a deep hue-tinted tone that sits on
`--bg-secondary`, the border takes the light-mode *text* colour and the text
takes the light-mode *border* colour — so each card keeps its hue identity
while meeting contrast on a dark panel.

**Why these are tokens.** They used to be hardcoded hex inside
`components/blog/definitions.tsx` (225 literals), which could not follow the
theme — so `BlogLayout` pinned the whole sidebar to `.theme-light-scope`
whenever a definition was open and a dark-mode reader got a bright white panel
beside a dark article. Never reintroduce a raw hex there; add a `--def-*` token.

---

## Typography

Three faces plus a mono, loaded via `next/font/google` (CSS variables on
`<html>` so the `:root` aliases resolve):

| Token            | Face                     | Role |
|------------------|--------------------------|------|
| `--font-sans`    | **SF Pro** (`-apple-system`, `BlinkMacSystemFont`), then **Inter** (`--font-inter`, `preload: false` so Apple devices never fetch it), then `system-ui` | All UI and body text, labels, captions, h3–h6 |
| `--font-heading` | **Bricolage Grotesque** (`wdth` + `opsz` axes) at `font-stretch: 88%` (`--heading-stretch`) | Display only: hero name, h1/h2, page and section titles, tool and post titles |
| `--font-serif`   | **Literata** (then New York / `ui-serif`) | Italic asides inside headlines (Bricolage has no italic — rule in `globals.css`), experience job titles, blog post reading column |
| `--font-mono`    | **SF Mono** / `ui-monospace` | Code, and index numerals (`01`, `07.02 — Tool`) only |

No uppercase tracked labels: labels are sentence case in the system face.

### Type Scale

Apple's text styles (iOS default "Large" size), also exposed as Tailwind
utilities `text-large-title … text-caption-2`:

| Style        | Size | Weight | Utility |
|--------------|------|--------|---------|
| Large Title  | 34px | 700 | `text-large-title` |
| Title 1      | 28px | 700 | `text-title-1` |
| Title 2      | 22px | 700 | `text-title-2` |
| Title 3      | 20px | 600 | `text-title-3` |
| Headline     | 17px | 600 | — |
| Body         | 17px | 400 | `text-body` |
| Callout      | 16px | 400 | `text-callout` |
| Subhead      | 15px | 400 | `text-subhead` |
| Footnote     | 13px | 400 | `text-footnote` |
| Caption 1    | 12px | 400 | `text-caption` |
| Caption 2    | 11px | 400 | `text-caption-2` |

Display sizes on the site:

| Element                | Face        | Size | Tracking |
|------------------------|-------------|------|----------|
| Hero name              | Bricolage   | `clamp(3.5rem, 9vw, 11rem)`, lh 0.92 | `-0.045em` |
| Contact CTA            | Bricolage + Literata italic | `clamp(3rem, 7vw, 6rem)` | `-0.045em` |
| Section title (`SectionHeader`) | Bricolage | `clamp(2.25rem, 5vw, 3.5rem)` | `-0.035em` |
| Page h1 (tools, blog index) | Bricolage | `clamp(2.25rem, 6vw, 4.75rem)` | `-0.04em` |
| Blog post headline     | Literata 700 | `clamp(2.1rem, 1.5rem + 2.6vw, 3.4rem)` | — |
| Blog body              | Literata | `--read-size` / `--read-leading` (1.6) | — |
| Hero lede              | SF 500 | `clamp(1.1875rem, 1rem + 0.6vw, 1.5rem)` | `-0.015em` |
| Body                   | SF | 17px / 1.47 | `-0.01em` |

### Global Heading Rules

- **h1, h2**: `--font-heading`, 700, `font-stretch: 88%`, line-height 1.12;
  h1 `2.5rem` / `-0.035em`, h2 `2rem` / `-0.03em`.
- **h3–h6**: `--font-sans`, 600, line-height 1.3, `-0.01em`; h3 `1.375rem`.
- Italic inside h1–h4 switches to Literata 400.

---

## Spacing & Layout

### Global Rhythm

- **Nav height**: `56px` (fixed top, glass)
- **Section padding**: `clamp(4.5rem, 9vw, 7.5rem)` vertical, `clamp(1.25rem, 5vw, 4rem)` horizontal
- **Max content width**: `1400px` (home), `1280px` (blog post), `1200px` (photography), `1152px` (blog list)
- **Section separator**: `1px solid var(--border-light)` top hairline via `.section-wrapper`

### Section Numbering

Each home section opens with `SectionHeader`: a purple SF Mono numeral above a
large Bricolage title (no rule line). Page headers on other routes keep the
`{num} — {Title}` row with the numeral in purple mono.

| Section       | Number |
|---------------|--------|
| About         | 01     |
| Experience    | 02     |
| Projects      | 03     |
| Contact       | 04     |
| Photography   | 05     |
| Notes / Blog  | 06     |
| Tools         | 07     |

---

## Component Design Details

### Navigation (`SlideTabs`)

- **Fixed** glass bar, `56px`: `--material-bar` + `backdrop-filter: saturate(180%) blur(20px)`, hairline bottom border. The only translucent surface on the site (HIG › Materials: glass on the floating functional layer, never in content).
- **Logo**: "MTosity" in Bricolage 700, `1.125rem`. Clicking fires purple-tinted confetti and navigates home.
- **Desktop links**: About, Photos, Writing, Tools, Design System — SF `0.875rem`, muted; the current page is `--fg` semibold with `aria-current="page"`.
- **Sliding capsule**: a `--fill` capsule (`layoutId`, spring 520/42) follows the pointer across links and settles back on the current page — the "slide tabs".
- **Mobile**: 44px round menu button; the menu drops as a glass sheet (`--material-thick`, 18px radius, `--shadow-lg`) with 48px rows and a check on the current page.
- CSS lives in `tokens.css` (`.ds-nav*`), not an inline `<style>` (that caused a hydration mismatch).

### Hero Section

- **Full viewport** height, no rules or texture — a soft purple radial light sits behind the portrait.
- **Meta captions**: "Software Engineer" / "United States" and "mtosity.com · 2026" / "Scroll ↓" — SF footnote, muted.
- **Name**: "Minh Tam" / "Nguyen", Bricolage 700, clip-reveal from below (1.1s), parallax drift left/right on scroll via `useSpring`.
- **Ticker**: skills in title case, SF `0.9375rem` 500 muted, 28s loop, edges faded with a mask gradient, between two hairlines that draw in.
- **Lede**: SF 500, `clamp(1.1875rem, …, 1.5rem)`, word-by-word stagger.
- **Portrait** (≥ md): `--radius-xl` corners, `--shadow-lg`, parallax rise; centered caption below.

### About Section

- **Two-column grid**: `1fr 280px`, collapses at 900px.
- **Text**: SF `clamp(1.0625rem, …, 1.1875rem)` / 1.6, max 38rem.
- **Links**: "Links" label + 44px round icon buttons (LinkedIn, GitHub, labelled), purple-tinted on hover.
- **Stats card**: grouped surface (`--bg-secondary`, 18px radius); "Use at work" / "Use for fun" footnote labels; chips on the base surface.

### Experience Section

- **One card per role** on the grouped surface (18px radius, no border).
- **Heading row**: company in SF 700 `clamp(1.25rem, …, 1.5rem)` (linked ones get a muted ↗ and turn purple on hover) | dates, footnote tabular, muted.
- **Position**: Literata italic, muted.
- **Description**: SF 1rem / 1.6, max 46rem; tech chips as capsules on the base surface.

### Projects Section

- **Inset-grouped list**: one `--bg-secondary` surface (18px radius, 6px padding), rows 12px radius separated by inset hairlines.
- **Row**: numeral (SF Mono, muted) | title (SF 17px 600) · tech (footnote) · year (right) / description (subhead muted) / "GitHub ↗" "Live ↗" as purple text links.
- **Hover**: the row fills purple (kept from the brutalist site), text re-points to ink-on-purple, neighbouring separators hide.
- **Entrance**: alternating clip-path wipe + staggered inner fades (unchanged).
- **Sheet** (`ProjectModal`): dim `rgba(0,0,0,.4)` backdrop, 720px card with `--radius-xl` and `--shadow-lg`, spring entrance; title in Bricolage; links are capsules — "Source Code" tinted, "Live Project" filled; a 44px glass close button.

### Contact Section

- **CTA**: "Let's work *together.*" — Bricolage with a purple Literata italic.
- **Links**: an inset-grouped list (email, LinkedIn, GitHub), 52px rows with ↗, purple fill on hover.

---

## Page-Level Design

### Home Page (`/`)

`SlideTabs` → `Hero` → `About` (01) → `Experience` (02) → `Projects` (03) → `Contact` (04)

All content sections sit inside a max-width `1400px` container.

### Blog Index (`/blog`)

- **Two-column layout**: `2fr 3fr` grid above `1024px`, stacked on mobile
- **Left column**: Section header, "Personal notes →" link, Lottie animation (hidden on mobile)
- **Right column**: Category filter tabs + post list
- **Header**: `06 — Writing` row, then "Leave some notes for the world." as a Bricolage h1; "Personal notes →" as a purple text link
- **Category filter**: `SegmentedControl` (design system) — capsule track with a sliding white thumb
- **Post cards**: Staggered fade-up (0.06s per card), category swap uses AnimatePresence exit/enter
- **Post card structure**: Category capsule (`.tag-neutral`) | Date (footnote) → Title (Bricolage `clamp(1.375rem, …, 1.625rem)`, purple on hover) → Excerpt (0.9375rem muted)
- **Categories**: Building, Living, Money, Tiếng Việt

### Blog Post (`/blog/[slug]`)

- **Two-column layout**: `1fr 1fr` grid above 1024px (panel and article share the width 1:1, gap `4rem`). Below 1024px the article centres at `--measure` (`40rem`)
- **Sidebar** (left, sticky at `56px + 2.5rem`):
  - Background: `var(--bg-secondary)`, `--radius-lg`, no border
  - Three modes: **TOC** (auto-extracted headings with active indicator), **Definition** (inline definition panel), **Code** (code example viewer)
  - Type (ported from #111's reading rail), all in the sans (`--font-sans`): "Contents" / panel titles 700 at `0.95rem` / `1.15rem`; TOC entries `0.92rem`, line-height `1.35`, `0.38rem` vertical padding, sub-headings indented `1.8rem`; definition and code-example body `0.92rem` / `1.55`; code labels ("✗ Wrong approach") `0.85rem` 700 in the def red/green; notes `0.86rem` muted. Code itself stays mono. The inline mono label styles in `definitions.tsx` are normalised by `.def-content` overrides in `BlogLayout.tsx`
  - Active heading: tinted selection (`--accent-soft` fill, `--accent-text`, 600) like a sidebar row; hover gets `--fill`
  - Mode transitions: fade/blur/slide animations
  - "← Back to blog" link at top (sans `0.92rem`, muted → fg on hover)
- **Mobile sidebar**: Fixed right sheet with a 28px top-left corner and `--shadow-lg`, slides in on the iOS curve, with a dim backdrop
- **Mobile TOC button**: floating glass capsule (`--material-thick`), 44px, SF 0.9375rem 600, above the safe-area inset
- **Article typography** (ported from #111's reading page): headline, h2 and h3 in Literata 700; body in Literata at `--read-size` / `--read-leading`, full-strength `--fg` (not muted); paragraph and list spacing `1.1em`; h2 `2.2em 0 0.6em`, h3 `1.9em 0 0.45em`; date in the sans at `0.95rem` muted. Links underline in a 70% accent tint and thicken on hover. Inline code gets a `--fill` capsule (6px radius). Pre blocks: `bg-secondary`, 12px radius, `0.85rem` / `1.65`. Blockquotes: `1.2em` italic with a short 3px accent bar above. `<hr>` renders as a centred `· · ·`. Images: 12px radius.
- **Max prose width**: the article column (half the 1280px container, ≤ `--measure`)

### Photography (`/photography`)

- **Header**: Centered section label + italic serif quote ("Shoot the adjective, not the noun.")
- **Justified grid**: Custom row-based layout algorithm
  - Aspect ratios come from a precomputed dimensions manifest (`gallery-meta/manifest.json` in Blob, built by `pnpm --filter @mtosity/web build-gallery-manifest`) so rows are stable from first paint — no reflow as images load
  - Fills rows to target width with 4px gaps
  - Responsive images per row: 1 (mobile) → 5 (desktop)
- **Data**: server component with ISR (`revalidate = 300`) passes photos to the client grid — no fetch spinner
- **Images**: `next/image` with per-tile `sizes` (Vercel image optimization — tiles are ~50 KB AVIF/WebP instead of 6–21 MB originals); native lazy loading, first two rows `priority`
- **Image hover**: `scale(1.03)` with 0.3s ease transition; hover also preloads the lightbox-size variant
- **Lightbox modal**: Photos-style black backdrop (`rgba(0,0,0,.88)`, `blur(8px)`) in both appearances, image (12px radius) scales up from 0.92, "Close ✕" as a white-on-glass capsule. Opens instantly with the cached grid thumbnail (blurred 6px) as an underlay while the full-quality variant (q85, ~896px CSS width) streams in
- **Manifest upkeep**: admin uploads measure dimensions client-side (EXIF-aware `createImageBitmap`) and merge them via `POST /api/admin/gallery/manifest`; deletes prune the entry. Bulk backfill: `pnpm --filter @mtosity/web build-gallery-manifest`

### Tools (`/tools`)

- **Header**: `07 — Tools` row (purple mono numeral) with an `03 tools` count on the right
- **Headline**: Bricolage `clamp(2.5rem, 6vw, 4.75rem)` with a Literata italic muted "Built to be useful."; SF 1.0625rem muted lede (max 52ch)
- **Tool list**: an inset-grouped list (`.ds-group` / `.ds-group-row`), each row a `Link` to `/tools/<slug>`
- **Row layout**: `auto 1fr auto` → app-icon tile | content | chevron
- **App-icon tile**: `clamp(52px, 7vw, 64px)` squircle (22.5% radius), purple gradient, white 2px-stroke glyph
- **Row content**: title (Bricolage `clamp(1.35rem, 3vw, 1.75rem)`) + status `Tag` (Live = positive, Beta = warning, In progress = neutral) + year; description (subhead muted, 62ch); `.chip` capsules
- **Row entrance**: clip-path wipe from left, 0.8s, staggered 0.08s per row
- **Row hover**: purple fill; the icon tile flips to white with a purple glyph; chevron nudges 3px; the status capsule goes white with purple text

### Tool — Image Grid (`/tools/img-grid`)

- **Layout**: Full-bleed two-column workspace (288px sidebar + flex canvas), with a thin top header strip carrying the crumbs (`← All tools`, `07.03 — Tool` in purple mono, `Canvas · 100% client-side`) and the title row
- **Title row**: "Image *grid.*" (Bricolage Grotesque `clamp(1.85rem, 4.5vw, 2.75rem)` 700, Literata italic muted accent) + an SF tagline on the right ("Drop images → choose a layout → pan / zoom each tile → export PNG.")
- **Sidebar (`288px`)**: Each control wrapped in a `Section` with an SF footnote 600 label
  - **Layout (mode)**: Segmented control — `Grid` / `Row` / `Column`. `Row` stacks images as equal horizontal rows (top→bottom), `Column` places them as equal vertical columns (left→right); both divide the fixed-aspect canvas among an unbounded number of images. `Grid` is the original fixed preset layouts. Switching modes clears loaded images.
  - **Image count / Aspect ratio / Gap / Export size**: Segmented control: capsule track on `--fill`, the active segment on a raised white capsule with a soft shadow. Image count and the Grid presets are hidden in stack modes
  - **Aspect ratio**: The same 5 fixed ratios in every mode (shared `aspectRatio` state) — it bounds the whole canvas/container, and grid presets or stack divisions lay images out inside it
  - **Grid presets**: Wrap-grid of mini layout previews — 52px wide thumbnails with the layout's blocks rendered as muted/purple rectangles inside; active card border + bg flip to purple (grid mode only)
  - **Radius**: Native range slider, accent `var(--accent)`, label shows live px
  - **Background**: Inline color picker chip + hex readout on a `--fill` strip (8px radius)
  - **Export button** (sticks to bottom via `margin-top: auto`): `AccentButton` capsule with `shadow` — purple with `--shadow-md` when ready, gray fill when blocked. Disabled label shows remaining count: `Fill 2 more`
- **Canvas pane**: `var(--bg-secondary)` background with a left 1px black rule. Centers a fixed-aspect canvas with `8px 8px 0 var(--border)` hard-offset shadow. Canvas dimensions recompute via `ResizeObserver` whenever the aspect ratio changes (200ms transition on width/height)
- **Stack modes (`Row` / `Column`)**: Reuse the same grid canvas and export path — they just generate the layout `blocks` dynamically (`stackBlocks` in `useImageCombiner`): N filled images plus one trailing empty "add" tile divide the fixed-aspect canvas into `N+1` equal columns (Row) / rows (Column). Dropping into the trailing tile fills it and spawns a fresh one (infinite stacking, slots stay dense); Remove compacts the strip. Each tile cover-crops its image with the same drag-to-pan / scroll-to-zoom as grid blocks. Export divides the canvas into `N` equal cells (the add-tile is preview-only) and bakes in each tile's scale/offset
- **Image block**:
  - Empty state: `--bg-secondary` fill with a 1px dashed border-light outline; centered `+` icon and "Click or drop" label
  - Hover (empty): outline upgrades to dashed black
  - Hover (filled): outline upgrades to 2px solid purple
  - Drag-over: outline becomes 2px dashed black
  - Filled: image positioned via `cover` math identical to `useImageCombiner.exportImage` so preview matches export pixel-for-pixel
  - Hover overlay (filled): semi-opaque dark veil (`rgba(13,13,13,0.35)`) with two button rows — `Replace` / `Remove` (glass capsules on `--material-thick`; Remove in `--danger`) and zoom controls `[−] NNN% [+]` (28px round glass buttons)
- **Interactions**:
  - Click empty block → file picker
  - Drop file on block → upload (drag/drop highlight)
  - Mouse drag on filled block → pan, clamped to keep image covering tile
  - Wheel on filled block → zoom (1x → 5x clamp); zooming out clamps offsets back into range
  - Replacing or counting up/down auto-revokes Object URLs to avoid leaks
- **Mobile (<768px)**: Workspace flips to vertical (sidebar above canvas, max 50vh), `Canvas · 100% client-side` label and tagline hide
- **Export pipeline**: `exportImage()` mirrors the CSS preview math on a single `<canvas>`. Block sizes use the same `gap.value / 600 * baseSize` and `borderRadius / 600 * baseSize` scaling so the rendered PNG matches the on-screen tile geometry. Sources: `crossOrigin = "anonymous"`, then `drawImage` with the cover-region math (offset/scale fed back into `sx/sy/sw/sh`). Output sizes: 1080 / 1440 / 2160 / 4320 px on the longest edge

### Tool — Instagram Reel Extractor (`/tools/instagram`)

- **Crumbs**: `← All tools` link, then sub-section header `07.02 — Tool` left (purple mono), `yt-dlp · Whisper · WASM` right
- **Title**: "Instagram reels, *extracted.*" — Bricolage Grotesque `clamp(2.5rem, 6vw, 4.5rem)` with italic muted accent
- **URL form**: SF label "Video URL", then a rounded field (`--bg`, separator border, 18px radius, `--shadow-sm`):
  - Mono input (transparent, no border, 0.9rem)
  - Purple "→ Fetch" `AccentButton` capsule inside the field — disables to the gray fill while loading and shows a spinner
  - Footnote line beneath: "Supports /reel/, /reels/, /p/ and /tv/ links · public posts only"
- **Error banner**: rounded (12px) box carrying the server message
- **Info card**: Two-column grid (`160px 1fr`, collapses below 600px). Left: 9:16 thumbnail, 12px radius. Right:
  - Uploader handle (SF footnote, muted)
  - Title (Bricolage Grotesque 1.4rem, 3-line clamp)
  - Meta chips: duration · `WxH` (capsules on `--fill`)
  - Action row: `Download MP4` tinted capsule (`--accent-soft`) + `Get transcript` filled `AccentButton`
  - Card is a grouped surface (`--bg-secondary`, 28px radius), no border
- **Stage progress**: While transcribing, four-step ordered list with `StageDot` glyphs:
  - Pending: hollow square (light border)
  - Active: purple square with pulsing opacity (1 ↔ 0.3, 1.2s)
  - Done: solid muted square
  - Steps: `Downloading audio`, `Decoding audio`, `Loading Whisper model` (with `— NN%` while shards download), `Transcribing`
- **Transcript section**: Header strip `Transcript — [Copy] [.txt] [.srt]` (small rounded buttons), then a Bricolage Grotesque 1.0625rem block on `var(--bg-secondary)` 12px radius, line-height 1.75, whitespace preserved
- **Footnote row**: Downloader / Transcription / Storage labels and values
- **Server pipeline**: `/api/instagram/info` (POST, yt-dlp `--dump-single-json`), `/api/instagram/audio` (GET, `bestaudio[ext=m4a]/bestaudio` streamed inline as `audio/mp4`), `/api/instagram/download` (GET, `mp4/best` streamed as attachment). All run on `nodejs` runtime, gated by `checkRateLimit` (10/h sliding window via Upstash; no-op locally). yt-dlp binary resolved from `./bin/`; `next.config.mjs` declares `outputFileTracingIncludes` for each route so the binary is bundled into the serverless function on Vercel.
- **Client pipeline**: Audio fetched from `/api/instagram/audio` → `AudioContext({ sampleRate: 16000 }).decodeAudioData` (resamples) → mono downmix → dynamic-import of `@huggingface/transformers` → `pipeline("automatic-speech-recognition", "onnx-community/whisper-base.en", { dtype: { encoder_model: "fp32", decoder_model_merged: "q4" }, device: "wasm" })` with `chunk_length_s: 30`, `stride_length_s: 5`, `return_timestamps: true` for SRT export.

### Tool — Speech to Text (`/tools/speech-to-text`)

- **Crumbs**: `← All tools` purple text link
- **Sub-section header**: `07.01 — Tool` left (purple mono), `On-device · whisper-base.en` right, with horizontal rule between
- **Title**: "Speech *to* text." — Bricolage Grotesque `clamp(2.5rem, 6vw, 4.5rem)` with italic muted "to"
- **Recorder card**:
  - Grouped surface: `var(--bg-secondary)`, 28px radius, no border or shadow
  - Top meta strip: animated status dot + phase label (left), `MM:SS` elapsed timer (right) — both SF footnote, muted
  - **Mic button** (150×150 wrapper, 88px circular button visually):
    - Idle: purple circle, mic SVG icon, `--shadow-lg`
    - Recording: `--danger` red with a stop square, gentle scale pulse (1 ↔ 1.04, 1.4s loop), three concentric ring waves expanding outward (1.6s, 0.45s stagger)
    - Hover/tap: scale 1.04 / 0.96 spring
  - **Waveform**: 28-bar live FFT visualizer (3px wide bars, 56px tall) — driven by `AnalyserNode.getByteFrequencyData`, animates each bar's `height` per frame; idle bars are static gray
  - **Status line**: SF footnote, errors switch to muted red (`#a83232`)
  - **Loading bar**: 4px capsule, fills `var(--accent)` over a `--fill-strong` track (only during model download)
- **Transcript panel**: Bricolage Grotesque 1.0625rem on `var(--bg)`, light border, 12px radius, 180px min-height. Empty state: italic muted "Your words will land here." Filled state fades up (0.3s)
- **Transcript actions**: Rounded buttons (Copy / Clear) with border-color hover transition; Copy briefly swaps to "Copied"
- **Footnotes row**: Auto-fit grid (220px min) — three labeled facts: Model, Runtime, Privacy (SF footnote labels and values)
- **Stack**: `@huggingface/transformers` v4 + `onnx-community/whisper-base.en` (q8 quantization, WASM device); `MediaRecorder` (audio/webm;codecs=opus) → `AudioContext.decodeAudioData` at 16kHz → Float32 mono → Whisper pipeline. Lazy-loaded on mount via dynamic import

### Notes (`/notes`)

- **Data source**: Fetches from `/api/notes` (Leaflet JSON Feed); images/links rewritten to `LEAFLET_BASE`
- **Background**: Subtle radial gradients — purple-tinted at top-left, lavender-tinted at bottom-right over `--bg`
- **Grid**: CSS Grid, `repeat(4, 1fr)`, `align-items: start`, `gap: 1.25rem` (4 cols → 3 → 2 → 1)
- **Sticky notes**:
  - Pastel background (8-color rotation), 3px left border in darker shade, `border-radius: var(--radius-sm)` (8px)
  - Slight pseudo-random rotation (±3°, deterministic per index)
  - Faux tape strip at top (40×12px, white translucent, `rgba(255,255,255,0.55)`)
  - Box shadow: `2px 3px 12px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06)`
  - Hover: scale 1.04, straightens to 0°, lifts up 6px, shadow → `0 12px 32px rgba(0,0,0,0.18)`
  - Content: Date (mono 0.6rem) → Title (Bricolage Grotesque 1.1rem) → Preview (0.78rem, 4-line clamp)
- **Note modal**:
  - Backdrop: `rgba(13,13,13,0.55)` + `blur(6px)`; click backdrop to close, ESC key supported
  - Card: note's pastel bg, `border-left: 5px solid` note border color, `border-radius: 1px`, max-width 620px, max-height 84vh
  - Shadow: `8px 16px 48px rgba(0,0,0,0.32), 2px 4px 12px rgba(0,0,0,0.14), inset 0 0 0 1px rgba(255,255,255,0.35)`
  - Top adhesive strip (32px, darkened note color) with centered tape decoration
  - Scrollable content area with **ruled lines** (`repeating-linear-gradient` every 28px)
  - Folded corner (38×38px triangle at bottom-right)
  - URL updated via `?note=<slug>` on open; direct-link support on load
- **Loading state**: 12 placeholder notes with `pulse-placeholder` animation (opacity 0.4 ↔ 0.6)

---

## Animation Catalog

All animations use Framer Motion unless noted as CSS keyframes.

### Framer Motion Animations

| Name | Properties | Duration | Easing | Trigger |
|------|-----------|----------|--------|---------|
| **Reveal** (global utility) | `opacity 0→1, y 60→0, scale 0.95→1` | 0.7s | `[0.22, 1, 0.36, 1]` | 20% in viewport, once |
| **Hero name clip-reveal** | `y "105%"→0, opacity 0→1` | 1.1s | `[0.16, 1, 0.3, 1]` | Mount |
| **Hero name parallax** | `x ±150px` on scroll | Spring (stiffness 60, damping 20) | Spring | Scroll |
| **Hero photo parallax** | `y -100px` on scroll | Spring (stiffness 50, damping 18) | Spring | Scroll |
| **Hero content fade-out** | `opacity 1→0` at 50%–85% scroll | Scroll-linked | Linear | Scroll |
| **Hero description stagger** | `opacity 0→1, y 8→0` per word | 0.4s, 0.055s stagger | `[0.16, 1, 0.3, 1]` | Mount, delayed 1.15s |
| **Hero line draw** | `scaleX 0→1` from left/right origin | 0.7s | `[0.16, 1, 0.3, 1]` | Mount |
| **Marquee ticker** | `x "0%"→"-50%"` infinite loop | 28s | Linear | Mount |
| **Scroll arrow bounce** | `y [0, 5, 0]` | 1.2s infinite | easeInOut | Mount |
| **Project wipe reveal** | `clipPath inset(0 100% 0 0)→inset(0)` | 0.8s | `[0.65, 0, 0.35, 1]` | 40% in viewport, once |
| **Project inner stagger** | Various fade/slide | 0.4–0.5s, delays 0.3–0.6s | `[0.22, 1, 0.36, 1]` | 40% in viewport |
| **Project modal entrance** | `y 100→0, opacity 0→1` | Default | Default | Mount |
| **Blog post stagger** | `opacity 0→1, y 16→0` per card | 0.35s, 0.06s stagger | `[0.22, 1, 0.36, 1]` | Mount |
| **Blog category swap** | Exit: `opacity 0, y -8`. Enter: `opacity 0→1, y 12→0` | 0.22s | easeOut | Category change |
| **Photo lightbox modal** | `scale 0.92→1, opacity 0→1` | 0.25s | Default | Click |
| **Sticky note entrance** | `opacity 0→1, y 30→0, rotate` | 0.35s, 0.03s stagger (max 0.6s) | Default | Mount |
| **Sticky note hover** | `scale 1.04, rotate 0, y -6, shadow deepens` | 0.2s | Default | Hover |
| **Note modal backdrop** | `opacity 0→1` | 0.2s | Default | Mount |
| **Note modal card** | `opacity 0→1, scale 0.25→1, y -80→0, rotate srcRotation*3→0` | Spring (stiffness 320, damping 26, mass 0.85) | Spring | Mount |

### CSS Keyframe Animations

| Name | Effect | Duration |
|------|--------|----------|
| `expand-pill` | `scaleX(0)→scaleX(1)` from right origin | 300ms ease-in-out |
| `collapse-pill` | `scaleX(1)→scaleX(0)` from right origin | 300ms ease-in-out |
| `fade-in` | `opacity 0→1` | 500ms ease-out |
| `fade-blur-out` | `opacity 1→0, blur 0→4px` | 250ms ease-in |
| `fade-in-smooth` | `opacity 0→1, translateY 8→0` | 400ms ease-out |
| `definition-exit` | `opacity 1→0, blur 0→6px, translateX 0→-20px` | 300ms ease-in |
| `pulse-placeholder` | `opacity 0.4↔0.6` | 1.6s infinite ease-in-out |
| **Loading spinner** | `rotate 0→360` | 1s infinite linear |

### Micro-Interactions

- **Nav link hover**: `color: var(--muted) → var(--fg)`, 0.15s transition
- **Blog title hover**: `opacity → 0.6`, 0.15s transition
- **Contact link hover**: `border-color: var(--border-light) → var(--fg)`, 0.15s transition
- **Project link hover**: Same border-color transition
- **Photo hover**: `transform: scale(1.03)`, 0.3s ease
- **Close button hover**: `color: var(--muted) → var(--fg)`, 0.15s transition

---

## Responsive Breakpoints

| Width    | Effect                                                        |
|----------|---------------------------------------------------------------|
| `480px`  | Notes CSS grid → 1 column                                    |
| `640px`  | Photo grid → 1 image/row                                     |
| `768px`  | Photo grid → 2/row; mobile nav triggers; hero photo hidden   |
| `800px`  | Notes CSS grid → 2 columns                                   |
| `900px`  | About section collapses to single column                      |
| `1023px` | Blog sidebar → mobile slide-in; TOC button appears; Lottie hidden |
| `1024px` | Blog layouts → two-column grid; photo grid → 3–4/row         |
| `1200px` | Notes CSS grid → 3 columns; photo grid → max 5/row           |
| `1280px` | Photo grid → 1200px max container                             |

---

## Modals & Overlays

All modals share these traits:
- **Backdrop**: dim black overlay (`rgba(0,0,0,.35–.4)`)
- **Card**: `--bg` (dark: `--bg-secondary`), `--radius-xl`, `--shadow-lg`, no border
- **Close**: 44px round glass button top-right, ESC key support on notes
- **Scroll lock**: `body.style.overflowY = "hidden"` when open
- **Animation**: Scale-up + fade-in on open, reverse on close

| Modal | Backdrop | Card Shadow | Max Width |
|-------|----------|-------------|-----------|
| Project | `rgba(0, 0, 0, 0.4)` | `--shadow-lg` | 720px |
| Photo lightbox | `rgba(242, 239, 232, 0.92)` + `blur(8px)` | None | 56rem |
| Note | `rgba(13,13,13,0.55)` + `blur(6px)` | `8px 16px 48px rgba(0,0,0,0.32)` + inset glow | 620px |

---

## UI Primitives

### AccentButton (design system)

The HIG "prominent" button: a filled purple capsule, SF `0.9375rem` 600,
min-height `--hit`, brightness lift on hover and `scale(0.96)` spring on tap.
`href` renders a Next Link, `disabled` drops to `--fill-strong` with muted
text, `shadow` adds `--shadow-md` (for buttons floating over content). Size
tweaks go through `style`; call sites no longer override its shape.

`StandardButton` is the same filled capsule as a plain button.
`OutlineButton` is the **tinted** style — purple text on `--accent-soft`,
filling purple on hover — for a secondary action.

### SegmentedControl (design system)

Capsule track on `--fill` with a raised thumb (white; `#636366` in dark) that
slides between segments (`layoutId` spring). `radiogroup` semantics with
arrow-key navigation. Used by the blog category filter; the img-grid tool's
option groups use the same look inline.

### Toggle, Select, AudioPlayer (design system)

- **Toggle** — the iOS switch: 51×31 capsule, white 27px knob with a soft
  shadow, purple when on.
- **Select** — a pop-up button: rounded field with chevron, focus halo in
  `--accent-soft`; the menu sits on `--material-thick` with 12px radius,
  `--shadow-lg`, and a purple highlight on the active row.
- **AudioPlayer** — a now-playing capsule: round purple play button, 4px
  scrubber with a white thumb, tabular time.

### ConfirmDialog (design system)

An alert in the HIG sense: centered 320px card on `--material-thick`, 18px
radius, title 17px 600, message 13px, full-width 44px buttons split by
hairlines — Cancel (purple) leading, the action (red, 600) trailing.
Esc cancels, Enter confirms (a deliberate destructive choice, per
HIG › Alerts). Respects reduced motion.

### Reveal (design system)

Scroll-into-view fade + 24px rise on a critically damped spring (stiffness
140, damping 24). `MotionProvider` (`apps/web`) wraps the app in
`<MotionConfig reducedMotion="user">`, so Reduce Motion drops transforms
site-wide and keeps fades.

### Muted link hover (`.link-hover`) and tinted links (`.link-tint`)

`.link-hover`: `--muted` → `--fg` on hover. `.link-tint`: purple text
(`--accent-text`), underline on hover — purple means "tappable" and nothing
else.

### useIsMobile / useMediaQuery (design system)

`useSyncExternalStore`-based media query hooks; SSR renders the `false`
branch. `useIsMobile()` defaults to `< 768px`.

### Chip (`.chip`)
```css
font-family: var(--font-sans);
font-size: 0.8125rem;
font-weight: 500;
color: var(--fg);
background: var(--fill);
border-radius: 9999px;
padding: 0.3rem 0.75rem;
```

### Grouped list (`.ds-group` / `.ds-group-row`)
A `--bg-secondary` surface (18px radius, 6px padding) whose rows (12px radius)
are split by inset hairlines; a row fills purple on hover or keyboard focus and
the hairlines around it hide.

### Section Header
```
01                      ← SF Mono 13px, --accent-text
About                   ← Bricolage 700, clamp(2.25rem, 5vw, 3.5rem)
```

### Focus
Every focusable element gets a 3px purple halo (`--accent` at 55%) offset 2px
on `:focus-visible`.

### Scrollbar (`.scrollbar-thin`)
- Width: 6px, transparent track, `--fill-strong` capsule thumb, hover → `--muted`

---

## System Layer — Status, Tags, Cards, Charts

`packages/design-system/src/system.css` is a shared layer imported by both
`tokens.css` (portfolio) and `shadcn.css` (shadcn consumers like thestockie),
so every app gets the same status vocabulary.

### Status colors

Apple's system hues. **Text** uses the accessible step in light and the
standard dark step in dark; **surfaces** are translucent `color-mix` tints.

| Tone       | Light text | Dark text  | Utilities                                                 |
| ---------- | ---------- | ---------- | --------------------------------------------------------- |
| `positive` | `#1d7a35` (5.4:1) | `#30d158`  | `text-positive` · `bg-positive-surface` · `ring-positive` |
| `negative` | `#d70015` (5.4:1) | `#ff453a`  | `text-negative` · `bg-negative-surface` · `ring-negative` |
| `warning`  | `#c93400` (5.3:1) | `#ff9f0a`  | `text-warning` · `bg-warning-surface` · `ring-warning`    |
| `info`     | `#0066cc` (5.6:1) | `#409cff`  | `text-info` · `bg-info-surface` · `ring-info`             |

`.stat-up` / `.stat-down` are shorthand text colors for numeric deltas.

### Tags

`.tag` + a tone class — a capsule in the system face, tinted surface,
coloured text, sentence case:

```html
<span class="tag tag-positive">Buy</span>
<span class="tag tag-strong-negative">Strong sell</span>
```

Tones: `tag-positive`, `tag-negative`, `tag-warning`, `tag-info`,
`tag-neutral`, plus denser `tag-strong-positive` / `tag-strong-negative`.
Also a React component: `<Tag tone="positive">Buy</Tag>`.

### Cards & tables

- `.ds-card` — `--bg-secondary` surface, 18px radius, no outline.
  `.ds-card-interactive` lifts 2px with `--shadow-md` on hover.
- `.ds-table` — full-width, SF footnote 600 `<th>`, hairline rules, tabular
  numerals, `--fill` row hover.

### Chart palette

Apple's system hues as `--chart-1..8` (green, blue, orange, pink, **purple =
brand**, teal, red, gray), switching to their dark-appearance steps under
`[data-theme="dark"]`. Use `text-chart-3`, `fill-chart-2`, or `var(--chart-2)`.

---

## Technology Stack

| Layer | Tool |
|-------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + Sass modules + CSS custom properties |
| Animation | Framer Motion 11 + CSS keyframes |
| Fonts | `next/font/google` (Bricolage Grotesque, Literata) |
| Lottie | `lottie-react` + `@lottiefiles/react-lottie-player` |
| Icons | `react-icons` |
| Code highlighting | Prism.js (custom light theme overrides) |
| Analytics | Vercel Analytics |
| Image hosting | Vercel Blob (photography) |
| Confetti | tsparticles confetti CDN |
| Package manager | pnpm |

---

## Code Syntax Highlighting (Prism.js Overrides)

Custom light-mode palette tuned to the light grouped background:

| Token | Color |
|-------|-------|
| Comments | `#8a847a` italic |
| Tags / constants | `#a83232` (muted red) |
| Numbers / booleans | `#a05c1a` (amber) |
| Strings / chars | `#3a7a4a` (forest green) |
| Operators / URLs | `#2a5fa8` (blue) |
| Functions / classes | `#6b3a9a` (purple) |
| Keywords | `#a8294a` (magenta) bold |
| Punctuation | `#2e2b27` (dark) |

### Sidebar Code Blocks (Dark Theme — `CodeBlock` component)

The blog sidebar's **CodeView** panel uses a separate dark-themed `CodeBlock` component with its own color scheme, distinct from the light-themed inline article code:

| Property | Value |
|----------|-------|
| Background | `#2a2836` (dark purple-gray) |
| Border | `1px solid #3a384a` |
| Font size | `0.78rem` |
| Line height | `1.6` |
| Syntax colors | Inherited from `prismjs/themes/prism-tomorrow.css` (dark theme base) |

**Variant borders** (left accent):

| Variant | Left border |
|---------|-------------|
| `error` (✗ Wrong Approach) | `3px solid #fca5a5` (light red), label color `#b91c1c` |
| `success` (✓ Correct Approach) | `3px solid #86efac` (light green), label color `#166534` |
| `default` / `alternative` (→ Alternative) | `1px solid #3a384a`, label color `var(--muted)` |

> **Two code themes coexist**: Article body `<pre>` uses the light theme (`var(--bg-secondary)` + custom token overrides). Sidebar `CodeBlock` uses the dark theme (`#2a2836` + prism-tomorrow defaults). The globals.css overrides target `code[class*="language-"]` broadly but the `CodeBlock` component's inline `background: transparent` and dark wrapper visually override them.

---

## File Organization

Turborepo + pnpm workspace. The Next.js app composes packages; visual building
blocks live in `@mtosity/design-system`.

```
apps/
└── web/                          ← The Next.js app (only Vercel deployment)
    └── src/
        ├── app/
        │   ├── globals.css       ← Tailwind v4 entry, keyframes, blog/global rules
        │   ├── layout.tsx        ← Font loading, meta, body class
        │   ├── page.tsx          ← Home page composition
        │   ├── blog/             ← Blog index + dynamic post routes
        │   ├── notes/page.tsx    ← Sticky notes page (inline styles)
        │   ├── photography/      ← Photo gallery (inline styles)
        │   ├── tools/            ← Tools index + thin re-export pages per tool
        │   ├── admin/            ← Thin re-export pages from @mtosity/admin
        │   └── api/              ← Thin re-export route files (handlers in packages)
        ├── components/
        │   ├── Hero.tsx          ← Full-screen hero with parallax
        │   ├── blog/             ← BlogLayout, CategoryFilter, CodeView, etc.
        │   └── template/
        │       ├── home/         ← About, Experience, Projects, Contact + SCSS
        │       └── nav/          ← SideBar, Heading + SCSS
        └── data/                 ← blogPosts.ts, tools.ts registries

packages/
├── design-system/                ← tokens.css (@theme) + SlideTabs, Reveal,
│                                   SectionHeader, OutlineButton, StandardButton
├── lib/                          ← constants (SITE_URL), db, notes, rate-limit, jsonld
├── admin/                        ← NextAuth config, admin pages, admin API handlers
├── whisper/                      ← Shared WASM Whisper worker implementation
├── tool-speech-to-text/          ← /tools/speech-to-text page component
├── tool-img-grid/                ← /tools/img-grid page + canvas components
├── tool-instagram/               ← /tools/instagram page, yt-dlp + URL libs, API handlers
└── typescript-config/            ← Shared tsconfig bases + ambient declarations
```

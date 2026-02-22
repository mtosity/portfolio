# DESIGN.md — mtosity.com Portfolio

Comprehensive design reference for the portfolio site. Every visual decision — colors, type, spacing, animation, layout — documented in one place.

---

## Design Philosophy

**Neo-brutalist editorial.** The site pairs a warm, organic cream background with stark black typography and bold lime-green accents. Typography is the hero — large serif headings, clean sans-serif body text, and monospaced labels create a layered editorial hierarchy. Borders are sharp (no rounded corners on primary elements), shadows use hard offsets, and whitespace is generous. Motion is purposeful: scroll-triggered reveals, parallax, and staggered entrances reward exploration without feeling gimmicky.

---

## Color Palette

| Token               | Value                        | Usage                                  |
|----------------------|------------------------------|----------------------------------------|
| `--bg`              | `#f2efe8` (warm cream)       | Page background                        |
| `--bg-secondary`    | `#e8e5dd` (darker cream)     | Cards, sidebar, code blocks            |
| `--fg`              | `#0d0d0d` (near-black)       | Primary text, headings, links          |
| `--accent`          | `#bef264` (lime green)       | Project row hover, brand highlight     |
| `--border`          | `#0d0d0d`                    | Section dividers, strong borders       |
| `--border-light`    | `#ccc8bd`                    | Subtle separators, photo borders       |
| `--muted`           | `#666460`                    | Secondary text, labels, dates          |
| `--bg-opaque`       | `rgba(242, 239, 232, 0.25)`  | Glassmorphic heading bar (legacy)      |
| `--background-dark` | `#d8d4cc`                    | Legacy sidebar background              |
| `--brand`           | `#bef264`                    | Alias for accent (legacy sidebar)      |

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

---

## Typography

Three Google Fonts loaded via `next/font/google` with CSS variable binding:

| Font           | CSS Variable             | Role                                       |
|----------------|--------------------------|---------------------------------------------|
| **Inter**      | `--font-inter`           | Body text, paragraphs, general UI           |
| **Crimson Text** | `--font-crimson-text`  | Display headings (h1–h6), blog titles, hero name, contact CTA |
| **Lora**       | `--font-lora`            | Serif alternate (available via `--font-serif`) |

### Monospace Stack
```
ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace
```
Used for: nav labels, section numbers, chips/tags, dates, code blocks, project metadata.

### Type Scale

| Element                | Font           | Size                         | Weight | Spacing         | Transform  |
|------------------------|----------------|------------------------------|--------|-----------------|------------|
| Hero name              | Crimson Text   | `clamp(3.5rem, 9vw, 11rem)` | 700    | `-0.03em`       | —          |
| Contact CTA            | Crimson Text   | `clamp(3rem, 7vw, 6rem)`    | 700    | `-0.02em`       | —          |
| Blog post h1           | Crimson Text   | `clamp(1.75rem, 4vw, 3rem)` | 700    | `-0.02em`       | —          |
| Photography tagline    | Crimson Text   | `clamp(2rem, 5vw, 3.5rem)`  | 400 *italic* | `-0.01em` | —          |
| Blog h2                | Crimson Text   | `1.75rem`                    | 700    | `-0.01em`       | —          |
| Blog h3                | Crimson Text   | `1.35rem`                    | 600    | —               | —          |
| Body text              | Inter          | `1.0625rem` (17px)           | 400    | —               | —          |
| Body line-height       | —              | `1.7` (about), `1.85` (blog)| —      | —               | —          |
| Nav links              | Monospace      | `0.75rem`                    | 400    | `0.1em`         | uppercase  |
| Section header label   | Monospace      | `0.75rem`                    | 700    | `0.2em`         | uppercase  |
| Chip / tag             | Monospace      | `0.7rem`                     | 400    | `0.08em`        | uppercase  |
| Meta bar / ticker      | Monospace      | `0.7rem`                     | 400    | `0.18em`        | uppercase  |
| Photo close button     | Monospace      | `0.75rem`                    | 400    | `0.1em`         | uppercase  |
| Sticky note date       | Monospace      | `0.6rem`                     | 400    | `0.12em`        | uppercase  |

### Global Heading Rules (h1–h6)

```css
font-family: var(--font-crimson-text), "Crimson Text", Georgia, serif;
font-weight: 600;
line-height: 1.3;
letter-spacing: -0.015em;
```

- **h1**: weight 700, `2.5rem`, spacing `-0.025em`
- **h2**: `2rem`
- **h3**: `1.5rem`

---

## Spacing & Layout

### Global Rhythm

- **Nav height**: `56px` (fixed top)
- **Section padding**: `6rem` vertical, `clamp(1.5rem, 5vw, 4rem)` horizontal
- **Max content width**: `1400px` (home), `1280px` (blog post), `1200px` (photography), `1152px` (blog list)
- **Section separator**: `1px solid var(--border)` top border via `.section-wrapper`

### Section Numbering

Each section header follows the pattern: `{num} — {TITLE}` using the `SectionHeader` component.

| Section       | Number |
|---------------|--------|
| About         | 01     |
| Experience    | 02     |
| Projects      | 03     |
| Contact       | 04     |
| Photography   | 05     |
| Notes / Blog  | 06     |

---

## Component Design Details

### Navigation (`SlideTabs`)

- **Fixed** top bar, `56px` height, cream background with bottom border
- **Logo**: "MTOSITY" in monospace bold, `0.875rem`, `0.15em` letter-spacing, uppercase
- **Logo interaction**: Clicking fires confetti (tsparticles) and navigates home
- **Desktop links**: `About`, `Photos`, `Writing`, `Contact` — monospace 0.75rem, muted color, hover → fg
- **Mobile**: Hamburger icon (3 horizontal lines SVG / X close), dropdown overlay
- **Links**: `{ label: "About", href: "/" }, { label: "Photos", href: "/photography" }, { label: "Writing", href: "/blog" }, { label: "Contact", href: "/#contact" }`

### Hero Section

- **Full viewport** height, flex column, border-bottom
- **Dot grid texture**: `radial-gradient(circle, var(--border-light) 1px, transparent 1px)` at `28px × 28px`, 45% opacity
- **Top meta bar**: "Software Engineer" left, "United States" right — monospace, 0.75rem, muted
- **Name display**: "MINH TAM" and "NGUYEN" on two lines, Crimson Text, `clamp(3.5rem, 9vw, 11rem)`
  - Each line clip-reveals from below (`y: "105%"` → `y: 0`) with 1.1s duration
  - On scroll: "MINH TAM" drifts left (parallax −150px), "NGUYEN" drifts right (+150px) via `useSpring`
- **Divider lines**: Horizontal 1px rules that scale from left/right respectively
- **Marquee ticker**: Skills text scrolling left continuously at 28s loop, monospace 0.7rem
- **Description**: Word-by-word stagger animation (0.055s between words), Inter 1.0625rem, maxWidth 480px
- **Profile photo** (desktop only, `md:` breakpoint):
  - `clamp(160px, 17vw, 260px)` wide, 1px border, `6px 6px 0` hard offset shadow
  - Parallax: rises independently (−100px) on scroll
- **Bottom bar**: "mtosity.com · 2026" left, "Scroll ↓" right with bouncing arrow animation (1.2s infinite easeInOut)
- **Fade out**: Entire content fades from opacity 1 → 0 between 50%–85% scroll progress

### About Section

- **Two-column grid**: `1fr 280px`, collapses at 900px
- **Text**: Reveal-wrapped paragraphs, Inter 1.0625rem, line-height 1.7
- **Links row**: "Links" label (monospace) + social icons (MyLinks component)
- **Stats sidebar**: Two groups — "Use at work" and "Use for fun"
  - Heading: monospace 0.75rem uppercase muted
  - Skill chips: flex-wrap grid, `.chip` class (monospace 0.7rem, border, uppercase)

### Experience Section

- **Timeline items**: Each item has top border-bottom rule (light), last item has none
- **Layout per item**:
  - **Heading row**: Company name (monospace bold 0.875rem uppercase, optionally linked) | Date range (monospace 0.75rem muted, right-aligned)
  - **Position**: 1rem italic muted
  - **Divider**: 1px light rule
  - **Description**: Pre-line formatted text, 1rem, lh 1.7
  - **Tech chips**: Flex-wrap, same `.chip` styling
- **All content Reveal-wrapped**: fade-up + scale animation

### Projects Section

- **List layout**: Flex column, each row has bottom border (light)
- **Clip-path wipe reveal**: Rows use alternating horizontal wipe — odd from left (`inset(0 100% 0 0)` → `inset(0 0% 0 0%)`), even from right
  - Duration 0.8s, ease `[0.65, 0, 0.35, 1]`
  - Triggered when 40% in viewport (`useInView`)
- **Staggered inner content**: After the wipe, child elements animate independently:
  - Number slides in from opposite side (delay 0.3s)
  - Title row fades up (delay 0.4s)
  - Description fades up (delay 0.5s)
  - Links fade in (delay 0.6s)
- **Hover**: Entire row background → `var(--accent)` (lime green)
- **Row structure**: `{num} | TITLE · tech | [year]` on top, description below, GitHub ↗ / Live ↗ links
- **Modal**: ReactDOM portal with blurred cream backdrop (`rgba(242, 239, 232, 0.85)`, `blur(8px)`)
  - Card: 1px border, cream bg, `4px 4px 0` hard offset shadow, max-width 700px
  - Entrance: slides up from `y: 100` with opacity fade
  - Content: project image, title, tech tags, description, footer links

### Contact Section

- **Large serif CTA**: "LET'S WORK TOGETHER." in Crimson Text, `clamp(3rem, 7vw, 6rem)`, bold
- **Contact links**: Stacked vertically — email, LinkedIn, GitHub — each as monospace `1rem` with bottom border that darkens on hover
- **Reveal-wrapped**: Standard fade-up animation

---

## Page-Level Design

### Home Page (`/`)

`SlideTabs` → `Hero` → `About` (01) → `Experience` (02) → `Projects` (03) → `Contact` (04)

All content sections sit inside a max-width `1400px` container.

### Blog Index (`/blog`)

- **Two-column layout**: `2fr 3fr` grid above `1024px`, stacked on mobile
- **Left column**: Section header, "Personal notes →" link, Lottie animation (hidden on mobile)
- **Right column**: Category filter tabs + post list
- **Category filter**: Horizontal tab bar — monospace 0.7rem uppercase, active tab gets `2px solid var(--fg)` bottom border
- **Post cards**: Staggered fade-up (0.06s per card), category swap uses AnimatePresence exit/enter
- **Post card structure**: Category chip | Date (monospace) → Title (Crimson Text 1.4rem) → Excerpt (0.9375rem muted)
- **Categories**: Building, Living, Money, Tiếng Việt

### Blog Post (`/blog/[slug]`)

- **Two-column layout**: `1fr 1fr` grid above 1024px
- **Sidebar** (left, sticky at `56px + 2.5rem`):
  - Background: `var(--bg-secondary)`, 1px light border
  - Three modes: **TOC** (auto-extracted headings with active indicator), **Definition** (inline definition panel), **Code** (code example viewer)
  - Active heading: left 2px border + dark text
  - Mode transitions: fade/blur/slide animations
  - "← Back to Blog" link at top
- **Mobile sidebar**: Fixed right panel, slides in from right (`translateX(100%)` → `0`), 90vw width, with dark overlay backdrop
- **Mobile TOC button**: Fixed bottom-right, dark bg, monospace 0.65rem uppercase
- **Article typography**: See type scale above. Inline code gets `bg-secondary` + light border. Pre blocks: `bg-secondary`, 1px border, no rounded corners. Blockquotes: 3px left border. Images: 1px light border.
- **Max prose width**: `68ch` for paragraphs and lists

### Photography (`/photography`)

- **Header**: Centered section label + italic serif quote ("Shoot the adjective, not the noun.")
- **Justified grid**: Custom row-based layout algorithm
  - Calculates aspect ratios from actual image dimensions
  - Fills rows to target width with 4px gaps
  - Responsive images per row: 1 (mobile) → 5 (desktop)
- **Lazy loading**: IntersectionObserver with 500px rootMargin
- **Image hover**: `scale(1.03)` with 0.3s ease transition
- **Lightbox modal**: Blurred cream backdrop (`rgba(242, 239, 232, 0.92)`, `blur(8px)`), image scales up from 0.92, "Close ✕" button in monospace

### Notes (`/notes`)

- **Data source**: Fetches from `/api/notes` (Leaflet JSON Feed); images/links rewritten to `LEAFLET_BASE`
- **Background**: Subtle radial gradients — lime-tinted at top-left, lavender-tinted at bottom-right over cream
- **Grid**: CSS Grid, `repeat(4, 1fr)`, `align-items: start`, `gap: 1.25rem` (4 cols → 3 → 2 → 1)
- **Sticky notes**:
  - Pastel background (8-color rotation), 3px left border in darker shade, `border-radius: 2px`
  - Slight pseudo-random rotation (±3°, deterministic per index)
  - Faux tape strip at top (40×12px, white translucent, `rgba(255,255,255,0.55)`)
  - Box shadow: `2px 3px 12px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06)`
  - Hover: scale 1.04, straightens to 0°, lifts up 6px, shadow → `0 12px 32px rgba(0,0,0,0.18)`
  - Content: Date (mono 0.6rem) → Title (Crimson Text 1.1rem) → Preview (0.78rem, 4-line clamp)
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
- **Backdrop**: Blurred, semi-transparent cream or dark overlay
- **Card**: Cream bg, light border, no rounded corners (or minimal 2–4px)
- **Close**: Top-right button, monospace styled, ESC key support on notes
- **Scroll lock**: `body.style.overflowY = "hidden"` when open
- **Animation**: Scale-up + fade-in on open, reverse on close

| Modal | Backdrop | Card Shadow | Max Width |
|-------|----------|-------------|-----------|
| Project | `rgba(242, 239, 232, 0.85)` + `blur(8px)` | `4px 4px 0 var(--border)` | 700px |
| Photo lightbox | `rgba(242, 239, 232, 0.92)` + `blur(8px)` | None | 56rem |
| Note | `rgba(13,13,13,0.55)` + `blur(6px)` | `8px 16px 48px rgba(0,0,0,0.32)` + inset glow | 620px |

---

## UI Primitives

### Chip / Tag (`.chip`)
```css
font-family: var(--font-mono);
font-size: 0.7rem;
letter-spacing: 0.08em;
text-transform: uppercase;
color: var(--muted);
border: 1px solid var(--border-light);
padding: 0.2rem 0.6rem;
```

### Section Header
Pattern: `{number} — {TITLE}` followed by a horizontal rule line.
```
┌─────────────────────────────────────────────┐
│ 01 —  ABOUT ─────────────────────────────── │
└─────────────────────────────────────────────┘
```
All mono, 0.75rem, #number muted / title bold fg, with flex-1 line fill.

### Links
Monospace, 0.7rem, uppercase, underline = `1px solid var(--border-light)` that darkens to `var(--fg)` on hover. Arrow suffix: ↗ or →.

### Scrollbar (`.scrollbar-thin`)
- Width: 6px
- Track: `var(--bg-secondary)`
- Thumb: `var(--border-light)`, hover → `var(--muted)`

---

## Technology Stack

| Layer | Tool |
|-------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + Sass modules + CSS custom properties |
| Animation | Framer Motion 11 + CSS keyframes |
| Fonts | `next/font/google` (Inter, Crimson Text, Lora) |
| Lottie | `lottie-react` + `@lottiefiles/react-lottie-player` |
| Icons | `react-icons` |
| Code highlighting | Prism.js (custom light theme overrides) |
| Analytics | Vercel Analytics |
| Image hosting | Vercel Blob (photography) |
| Confetti | tsparticles confetti CDN |
| Package manager | pnpm |

---

## Code Syntax Highlighting (Prism.js Overrides)

Custom light-mode palette tuned to the cream background:

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

> **Two code themes coexist**: Article body `<pre>` uses the light cream theme (`var(--bg-secondary)` + custom token overrides). Sidebar `CodeBlock` uses the dark theme (`#2a2836` + prism-tomorrow defaults). The globals.css overrides target `code[class*="language-"]` broadly but the `CodeBlock` component's inline `background: transparent` and dark wrapper visually override them.

---

## File Organization

```
src/
├── app/
│   ├── globals.css           ← Design tokens, keyframes, global rules
│   ├── layout.tsx            ← Font loading, meta, body class
│   ├── page.tsx              ← Home page composition
│   ├── blog/                 ← Blog index + dynamic post routes
│   ├── notes/page.tsx        ← Sticky notes page (inline styles)
│   └── photography/page.tsx  ← Photo gallery (inline styles)
├── components/
│   ├── Hero.tsx              ← Full-screen hero with parallax
│   ├── SlideTabs.tsx         ← Fixed navigation bar
│   ├── blog/                 ← BlogLayout, CategoryFilter, CodeView, etc.
│   └── template/
│       ├── home/             ← About, Experience, Projects, Contact + SCSS
│       ├── nav/              ← SideBar, Heading + SCSS
│       ├── buttons/          ← OutlineButton, StandardButton + SCSS
│       └── utils/            ← Reveal, SectionHeader + SCSS
└── data/
    └── blogPosts.ts          ← Blog post registry
```

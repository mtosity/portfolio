# DESIGN.md — mtosity.com

The canonical design reference. The rendered, always-current version is
`/design-system`, which reads every token live from the page.

---

## How the system is built

`@mtosity/design-system` v1 separates **what a role is** from **what it
looks like**:

| File | Holds | Changes when |
|---|---|---|
| `packages/design-system/src/tokens.css` | Roles, fluid type scale, space, layout, motion, browser surfaces (selection, focus, caret, scrollbar), legacy aliases | Rarely — the contract |
| `packages/design-system/src/world.css` | One visual world: faces, display voice, radii, light + dark palettes | The world changes |
| `packages/design-system/src/world.ts` | The world's name, summary, faces and rules for `/design-system` | With world.css |
| `apps/web/src/app/fonts.ts` | The world's two `next/font` faces (`--font-world-display`, `--font-world-text`) and browser chrome colours | With world.css |
| `packages/design-system/src/system.css` | Status colours, chart palette, `.tag`, `.ds-card`, `.ds-table`, `.ds-select`, `.ds-toggle`, `.ds-audio`, `.ds-button` | Component changes |
| `packages/design-system/src/ui.css` | Site chrome: nav, footer, section header, dialog | Component changes |

Every page reads roles; swapping a world is swapping `world.css`,
`world.ts` and `fonts.ts`, plus the home page's scene.

Dark theme: `[data-theme="dark"]` on `<html>`, applied before paint by the
inline script in `apps/web/src/app/layout.tsx`. Light is the default.

## The world: Desk Diorama

A small clay model of the desk this site is built at, lit by a window in
the day and by the desk lamp at night.

- **Palette (light / dark):** ground `#f4eee5` / `#1c1b22`, surface
  `#ebe3d6` / `#25242d`, raised `#fffaf3` / `#2e2d37`, ink `#2b2a33` /
  `#f1ebe2`, muted `#5f5a63` / `#b4acb3`, accent coral `#ff6b4a` /
  `#ff7a5c` (ink-on-coral text `#24171a`), field mint `#cfe7da` /
  `#22312b` with field ink `#1f3a2f` / `#d3eee0`.
- **Faces:** Bricolage Grotesque (display at 88% width, 700, -0.035em;
  UI at normal width) and Literata (reading, optical sizes).
- **Shape:** radii 6 / 10 / 18px; buttons are pills (`--button-radius`).
- **Rules:** coral is the one action; mint is a field (the Projects
  section sits on it), never a highlight; every object on the desk goes
  somewhere real; the lamp is the theme switch.

## Roles (tokens.css + world.css)

| Role | Use |
|---|---|
| `--bg` | Page ground |
| `--bg-secondary` | A step in tone: cards, rows, footer, inline code |
| `--surface-raised` | What floats: menus, dialogs, sheets, labels |
| `--fg` | Running text and headings (body text is never grey) |
| `--muted` | Secondary text, ≥ 4.5:1 on ground |
| `--faint` | Counts, disabled text |
| `--accent` / `--accent-hover` / `--accent-fg` | The one action and its text |
| `--border-light` | Hairlines — tables and reading rules only |
| `--danger` | Destructive actions |
| `--field` / `--field-fg` | A section-sized field of colour (world-specific) |
| `--film` / `--film-ink` | Deep surface for code blocks and scrims, both themes |
| `--shadow-float` | Only on things that float |

Status (`--positive`, `--negative`, `--warning`, `--info` + `-surface`) and
`--chart-1…8` live in `system.css` and are world-independent.

**Face aliases.** `--font-heading` → display, `--font-sans` → UI,
`--font-serif` → text, and `--font-mono` → **the UI face** (v0 used a
monospace costume for labels; 289 inline uses now restyle for free). Real
code uses `--font-code`. Tailwind's `font-mono` utility maps to code.

**Legacy aliases** (`--shadow-brutal` = none, `--shadow-brutal-lg` =
float, `--background`, `--brand`, …) keep the tools and admin compiling.

## Type

Fluid scale `--step--2 … --step-6` (360px → 1440px). Reading uses
`--read-size` (17–20px) at `--read-leading` 1.62 and a 36–40rem measure.
`.display` applies the world's display voice to any element. Headings
are balanced (`text-wrap: balance`), paragraphs `pretty`.

## Space, layout, motion

- `--gutter` clamp(16px → 40px) is the one pair of outer margins;
  `.frame` applies it with `--page-max` 1440px.
- Sections are separated by `--space-9` (80–160px), never by rules.
- `--nav-h` 64px. The nav tucks away while reading down and returns on
  scroll up; over full-bleed first screens it is transparent
  (`<SiteNav overlay />`).
- Easing: `--ease-out` cubic-bezier(0.23,1,0.32,1) for anything answering
  input; `--ease-in-out` for on-screen moves; `--ease-drawer` for sheets.
  Durations: press 140ms, fast 180ms, base 280ms, slow 640ms. All drop to
  0 under `prefers-reduced-motion`.
- Buttons press to 0.97; nothing bounces.

## Components

- **SiteNav** — wordmark (confetti easter egg kept), Work · Writing ·
  Photos · Tools · System, theme toggle; active link underlined in the
  accent; phones get a full-height sheet of large links. `SlideTabs` is
  an alias.
- **SiteFooter** — the name at full width, ways to reach me, pages.
- **Button** — `accent` (the one primary action), `ink`, `quiet`; renders
  a Link for internal hrefs. `AccentButton` wraps `accent`.
- **SectionHeader** — the section's name in the display voice, optional
  lede and aside. No numbers, no eyebrow.
- **Reveal** — rises 20px once, on first view; visible without script.
- **Tag, Select, Toggle, AudioPlayer, ConfirmDialog, ThemeToggle** — see
  `/design-system`.

## Pages

### Home (`/`)
`SiteNav overlay` → world hero → About → Projects (`#work`) → Experience →
Contact → footer. Content lives in `apps/web/src/components/home/data.tsx`
and is shared by every world.

- **Hero (Desk Diorama):** three.js scene (`components/home/hero/desk.ts`):
  laptop → projects (screen cycles real screenshots), notebook → writing,
  camera → photos (flash on hover), toolbox → tools, plant → notes, Baymax
  → about (follows the pointer, breathes, waves on hover), mug → email,
  lamp → theme. Drag turns the model with momentum. The same doors render
  as plain links under the model (keyboard + no-WebGL path). The loop runs
  only while on screen and visible.
- **About:** portrait slightly askew (straightens on hover), the about
  copy, skills as two plain lists.
- **Projects:** the five post-2020 projects pinned by hand on a 12-column
  wall (different spans, sub-degree tilts, staggered drops); the 2020
  projects as a list. Each opens a bottom sheet with the project notes and
  links. Images fall back to the title if they fail to load.
- **Experience:** company in the display voice, role, dates (current job
  marked "here now"), bullets as a list.
- **Contact:** "LET'S WORK TOGETHER." at full width; email with a copy
  button whose confirmation lingers ~1.8s.

### Writing (`/blog`, `/blog/[slug]`) — `app/blog/reading.css`
Newspaper idiom. Index: a section front — huge title, sections (All +
non-empty categories with counts), the newest post leads in serif at
size, the rest run down a column. Article: centred serif column, headline
in the text face at weight, standfirst (the excerpt), byline (author ·
category · date · reading time), drop cap, rules allowed on this surface
only. A sticky rail beside the column holds the TOC ("In this article")
and swaps to definition / code panels; below 1200px it becomes a bottom
sheet behind a "Contents" pill. Anchor terms are whole-word buttons with a
dotted accent underline and a marker highlight when active. Code sits on
`--film` in both themes.

### Photography (`/photography`) — `app/photography/gallery.css`
First screen: one landscape photograph edge to edge with film grain and
"Shoot the adjective, not the noun." set large; frame count beside it.
Justified grid with 6px gutters at the page frame; hovering one picture
quietly dims the others. Lightbox: near-black, arrow keys and buttons walk
the roll, capture date (from the camera filename) and position shown.

### Tools (`/tools`) — `app/tools/tools.css`
One generous row per tool on a surface step: drawn icon, title, tagline,
description, status · year · tags; hover fills the icon with the accent.
Tool pages keep their v0 structure and restyle through the tokens.

### Design system (`/design-system`) — `app/design-system/ds.css`
Sticky index; sections World, Colour, Type, Space & shape, Motion (hover a
row to run its curve), Components (every export, live).

> The tool sections below record each tool's structure, written in v0.
> Colours now come from the world tokens (lime → `--accent`, offset
> shadows → none, mono labels → the UI face).

### Tool — Image Grid (`/tools/img-grid`)

- **Layout**: Full-bleed two-column workspace (288px sidebar + flex canvas), with a thin top header strip carrying the crumbs (`← All tools`, `07.03 — TOOL`, `CANVAS · 100% CLIENT-SIDE`) and the title row
- **Title row**: "Image *grid.*" (Crimson Text `clamp(1.85rem, 4.5vw, 2.75rem)` 700, italic muted accent) + a mono tagline on the right ("Drop images → choose a layout → pan / zoom each tile → export PNG.")
- **Sidebar (`288px`, cream)**: Each control wrapped in a `Section` with mono 0.65rem 700 uppercase muted label
  - **Layout (mode)**: Connected pill row — `Grid` / `Row` / `Column`. `Row` stacks images as equal horizontal rows (top→bottom), `Column` places them as equal vertical columns (left→right); both divide the fixed-aspect canvas among an unbounded number of images. `Grid` is the original fixed preset layouts. Switching modes clears loaded images.
  - **Image count / Aspect ratio / Gap / Export size**: Connected pill row (no gap; 1px outer border, internal 1px dividers). Active segment fills lime, inactive segments hover to `var(--bg-secondary)` and `var(--fg)` text. Image count and the Grid presets are hidden in stack modes
  - **Aspect ratio**: The same 5 fixed ratios in every mode (shared `aspectRatio` state) — it bounds the whole canvas/container, and grid presets or stack divisions lay images out inside it
  - **Grid presets**: Wrap-grid of mini layout previews — 52px wide thumbnails with the layout's blocks rendered as muted/lime rectangles inside; active card border + bg flip to lime (grid mode only)
  - **Radius**: Native range slider, accent `var(--fg)`, label shows live px
  - **Background**: Inline color picker chip (28×28, 1px black border) + mono uppercase hex readout in a bordered strip
  - **Export button** (sticks to bottom via `margin-top: auto`): Mono 0.78rem 700 uppercase. Lime + 4px hard offset shadow when ready, gray + no shadow when blocked. Hover lifts via `translate(-2px, -2px)` with the shadow growing to `6px 6px`. Disabled label shows remaining count: `Fill 2 more`
- **Canvas pane**: `var(--bg-secondary)` background with a left 1px black rule. Centers a fixed-aspect canvas with `8px 8px 0 var(--border)` hard-offset shadow. Canvas dimensions recompute via `ResizeObserver` whenever the aspect ratio changes (200ms transition on width/height)
- **Stack modes (`Row` / `Column`)**: Reuse the same grid canvas and export path — they just generate the layout `blocks` dynamically (`stackBlocks` in `useImageCombiner`): N filled images plus one trailing empty "add" tile divide the fixed-aspect canvas into `N+1` equal columns (Row) / rows (Column). Dropping into the trailing tile fills it and spawns a fresh one (infinite stacking, slots stay dense); Remove compacts the strip. Each tile cover-crops its image with the same drag-to-pan / scroll-to-zoom as grid blocks. Export divides the canvas into `N` equal cells (the add-tile is preview-only) and bakes in each tile's scale/offset
- **Image block**:
  - Empty state: cream-secondary fill with a 1px dashed border-light outline; centered `+` icon and mono "CLICK OR DROP" label
  - Hover (empty): outline upgrades to dashed black
  - Hover (filled): outline upgrades to 2px solid lime
  - Drag-over: outline becomes 2px dashed black
  - Filled: image positioned via `cover` math identical to `useImageCombiner.exportImage` so preview matches export pixel-for-pixel
  - Hover overlay (filled): semi-opaque dark veil (`rgba(13,13,13,0.35)`) with two button rows — `Replace` / `Remove` (mono uppercase, 1px black borders; Remove tinted muted-red) and zoom controls `[−] NNN% [+]` (28px square buttons)
- **Interactions**:
  - Click empty block → file picker
  - Drop file on block → upload (drag/drop highlight)
  - Mouse drag on filled block → pan, clamped to keep image covering tile
  - Wheel on filled block → zoom (1x → 5x clamp); zooming out clamps offsets back into range
  - Replacing or counting up/down auto-revokes Object URLs to avoid leaks
- **Mobile (<768px)**: Workspace flips to vertical (sidebar above canvas, max 50vh), `CANVAS · 100% CLIENT-SIDE` label and tagline hide
- **Export pipeline**: `exportImage()` mirrors the CSS preview math on a single `<canvas>`. Block sizes use the same `gap.value / 600 * baseSize` and `borderRadius / 600 * baseSize` scaling so the rendered PNG matches the on-screen tile geometry. Sources: `crossOrigin = "anonymous"`, then `drawImage` with the cover-region math (offset/scale fed back into `sx/sy/sw/sh`). Output sizes: 1080 / 1440 / 2160 / 4320 px on the longest edge

### Tool — Instagram Reel Extractor (`/tools/instagram`)

- **Crumbs**: `← All tools` link, then sub-section header `07.02 — TOOL` left, `YT-DLP · WHISPER · WASM` right
- **Title**: "Instagram reels, *extracted.*" — Crimson Text `clamp(2.5rem, 6vw, 4.5rem)` with italic muted accent
- **URL form**: Mono uppercase label "REEL URL", then a flex strip on `var(--bg-secondary)` with 1px black border + `4px 4px 0` shadow:
  - Mono input (transparent, no border, 0.9rem)
  - Lime "→ FETCH" submit button (mono 0.75rem 700, 1px black border) — disables to `var(--border-light)` while loading and shows a spinner; otherwise scale 1.02 / 0.98 hover/tap
  - Footnote line beneath: "Supports /reel/, /reels/, /p/ and /tv/ links · public posts only"
- **Error banner**: 1px red border + `3px solid #a83232` left rule on `var(--bg-secondary)` carrying server message in mono
- **Info card**: Two-column grid (`160px 1fr`, collapses below 600px). Left: 9:16 thumbnail with light border. Right:
  - Uploader handle (mono 0.65rem uppercase muted)
  - Title (Crimson Text 1.4rem, 3-line clamp)
  - Meta chips: duration · `WxH` (mono 0.65rem chips)
  - Action row: `Download MP4` primary action (cream bg, black border, mono 0.72rem 700) + `Get transcript` accent action (lime bg, black border)
  - Card has 1px black border + `6px 6px 0` shadow
- **Stage progress**: While transcribing, four-step ordered list with `StageDot` glyphs:
  - Pending: hollow square (light border)
  - Active: lime square with pulsing opacity (1 ↔ 0.3, 1.2s)
  - Done: solid muted square
  - Steps: `Downloading audio`, `Decoding audio`, `Loading Whisper model` (with `— NN%` while shards download), `Transcribing`
- **Transcript section**: Header strip `TRANSCRIPT — [Copy] [.txt] [.srt]` (small bordered mono pill buttons), then a Crimson Text 1.0625rem block on `var(--bg-secondary)` with light border, line-height 1.75, whitespace preserved
- **Footnote row**: DOWNLOADER / TRANSCRIPTION / STORAGE labels and values
- **Server pipeline**: `/api/instagram/info` (POST, yt-dlp `--dump-single-json`), `/api/instagram/audio` (GET, `bestaudio[ext=m4a]/bestaudio` streamed inline as `audio/mp4`), `/api/instagram/download` (GET, `mp4/best` streamed as attachment). All run on `nodejs` runtime, gated by `checkRateLimit` (10/h sliding window via Upstash; no-op locally). yt-dlp binary resolved from `./bin/`; `next.config.mjs` declares `outputFileTracingIncludes` for each route so the binary is bundled into the serverless function on Vercel.
- **Client pipeline**: Audio fetched from `/api/instagram/audio` → `AudioContext({ sampleRate: 16000 }).decodeAudioData` (resamples) → mono downmix → dynamic-import of `@huggingface/transformers` → `pipeline("automatic-speech-recognition", "onnx-community/whisper-base.en", { dtype: { encoder_model: "fp32", decoder_model_merged: "q4" }, device: "wasm" })` with `chunk_length_s: 30`, `stride_length_s: 5`, `return_timestamps: true` for SRT export.

### Tool — Speech to Text (`/tools/speech-to-text`)

- **Crumbs**: `← All tools` link (mono 0.7rem uppercase, light underline)
- **Sub-section header**: `07.01 — TOOL` left, `ON-DEVICE · WHISPER-BASE.EN` right, with horizontal rule between
- **Title**: "Speech *to* text." — Crimson Text `clamp(2.5rem, 6vw, 4.5rem)` with italic muted "to"
- **Recorder card**:
  - 1px black border on `var(--bg-secondary)` with `6px 6px 0` hard offset shadow
  - Top meta strip: animated status dot + phase label (left), `MM:SS` elapsed timer (right) — both mono 0.7rem uppercase muted
  - **Mic button** (150×150 wrapper, 88px circular button visually):
    - Idle: lime background, black 1px border, mic SVG icon, `6px 6px 0` shadow
    - Recording: black background with stop-square in lime, gentle scale pulse (1 ↔ 1.04, 1.4s loop), three concentric ring waves expanding outward (1.6s, 0.45s stagger)
    - Hover/tap: scale 1.04 / 0.96 spring
  - **Waveform**: 28-bar live FFT visualizer (3px wide bars, 56px tall) — driven by `AnalyserNode.getByteFrequencyData`, animates each bar's `height` per frame; idle bars are static gray
  - **Status line**: Mono 0.75rem uppercase, errors switch to muted red (`#a83232`)
  - **Loading bar**: 3px tall, fills `var(--fg)` over `var(--border-light)` track (only during model download)
- **Transcript panel**: Crimson Text 1.0625rem on `var(--bg)`, light border, 180px min-height. Empty state: italic muted "Your words will land here." Filled state fades up (0.3s)
- **Transcript actions**: Mono pill buttons (Copy / Clear) with border-color hover transition; Copy briefly swaps to "Copied"
- **Footnotes row**: Auto-fit grid (220px min) — three labeled facts: MODEL, RUNTIME, PRIVACY (mono 0.65rem labels, mono 0.8rem values)
- **Stack**: `@huggingface/transformers` v4 + `onnx-community/whisper-base.en` (q8 quantization, WASM device); `MediaRecorder` (audio/webm;codecs=opus) → `AudioContext.decodeAudioData` at 16kHz → Float32 mono → Whisper pipeline. Lazy-loaded on mount via dynamic import

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


## Blog definition callouts


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


## Technology

Next.js 16 (App Router), React 19, TypeScript, Tailwind v4 (CSS-first),
Framer Motion 12, three.js 0.180 (home scene only, dynamically imported),
`next/font/google`, Prism, Vercel Analytics, Vercel Blob.

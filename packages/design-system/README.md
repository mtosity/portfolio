# @mtosity/design-system

Design tokens and brutalist UI primitives for mtosity projects — warm cream
background, near-black ink, lime accent. Built for **Tailwind CSS v4**.

Canonical design reference: [`DESIGN.md`](https://github.com/mtosity/portfolio/blob/main/DESIGN.md).

## Install

Published to GitHub Packages under the `@mtosity` scope. In the consuming repo:

```ini
# .npmrc
@mtosity:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

```bash
pnpm add @mtosity/design-system
```

## Usage

### Design tokens (the main export)

Import once in your Tailwind v4 entry CSS, after `@import "tailwindcss"`:

```css
@import "tailwindcss";
@import "@mtosity/design-system/tokens.css";
```

This exposes:

- The palette as Tailwind utilities (`bg-bg`, `text-fg`, `bg-accent`,
  `text-muted`, `border-border-light`, `font-heading`, …) via `@theme static`.
- Plain `:root` CSS variables (`--bg`, `--fg`, `--accent`, `--border`,
  `--shadow-brutal`, …) for SCSS modules and inline styles.
- Dark theme via `[data-theme="dark"]` on `<html>` and a remapped Tailwind
  `dark:` variant (`@custom-variant`).
- Shared utility classes: `.chip`, `.link-hover`, `.section-wrapper`,
  `.theme-light-scope`, `.scrollbar-thin`.
- System layer (status colors, tags, cards, tables, chart palette) via
  `src/system.css`, imported by both `tokens.css` and `shadcn.css`:
  - `.tag` (+ `.tag-positive` / `-negative` / `-warning` / `-info` / `-neutral`)
  - `.ds-card` — the default card: strong theme-adaptive border + hard offset
    shadow, shown directly. Add `.ds-card-interactive` for a hover lift.
  - `.ds-table`, and `--color-chart-1..8`.
  - `.ds-select` and `.ds-toggle` — brutalist form controls (paired with the
    `<Select>` / `<Toggle>` React components).

The lime accent is identical in both themes; only bg/fg/border swap.

### Fonts

The token file references `--font-heading` / `--font-sans` / `--font-serif`,
which resolve to `next/font` CSS variables (`--font-crimson-text`,
`--font-inter`, `--font-lora`). Load those in the consuming app's root layout
with `next/font/google` and put the variable classes on `<html>`.

### Components (optional)

React primitives (`SlideTabs`, `ThemeToggle`, `AccentButton`, `Reveal`, …) are
exported from the package root. They require `framer-motion` (optional peer) and
ship as source, so add `@mtosity/design-system` to `transpilePackages` in
`next.config`.

```ts
import { ThemeToggle, AccentButton } from "@mtosity/design-system";
```

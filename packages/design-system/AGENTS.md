# AGENTS.md — @mtosity/design-system

Read this before changing anything in this package.

## There is a public showcase page — keep it in sync

The design system is documented at **`/design-system`** in the web app:
`apps/web/src/app/design-system/` (`page.tsx` + `DesignSystemShowcase.tsx`).

The page is the canonical, rendered reference for tokens + components. It must
not go stale. The contract:

- **Version** — auto. The page reads the version from this package's
  `package.json` (`import pkg from "@mtosity/design-system/package.json"`), so a
  version bump updates the badge with no page edit. (This requires the
  `"./package.json"` entry in `exports` — keep it.)
- **Tokens / components — manual.** When you add, rename, or remove any of the
  following, update the matching catalogue in `DesignSystemShowcase.tsx`:
  | You changed… | Update in `DesignSystemShowcase.tsx` |
  |---|---|
  | a core palette var (`tokens.css`) | `CORE` |
  | a status color / surface (`system.css`) | `STATUS` / `SURFACES` |
  | the chart palette (`system.css`) | `CHART` |
  | a font token (`tokens.css`) | `FONTS` |
  | a shadow / radius token | the "Shape & depth" section |
  | the type scale (`--text-*`) | `TYPE_SCALE` |
  | a `.tag` / `.ds-card` / `.ds-table` / `.chip` rule | the relevant section |
  | a component exported from `index.ts` | add a `<ComponentRow>` |

  New color vars must also be added to `ALL_VARS` so their resolved value shows.

## Releasing

1. Bump `version` in `package.json` (semver).
2. Merge to `main`.
3. Push a `design-system-v<version>` tag — the `publish-design-system.yml`
   GitHub Action publishes to GitHub Packages on that tag. (Versions can't be
   re-published, so tag only after the bump is on `main`.)
4. Bump consumers (thestockie, alpaca dashboard, …) to the new `^version` if
   they need the change.

## Notes

- Tailwind v4, CSS-first. `tokens.css` imports `system.css`; `shadcn.css` is the
  shadcn bridge and also imports `system.css`. Shadcn apps import `shadcn.css`
  only (not `tokens.css`).
- The look follows Apple's HIG (system palette, SF type, capsules, grouped
  lists, glass nav, springs). The purple fill (#9a3fd1, Apple's system purple a step deeper) is identical in both
  themes; use `--accent-text` (not `--accent`) for violet text so it holds
  4.5:1 on black. bg/fg/separators swap via `[data-theme="dark"]`; every new
  colour also needs a `prefers-contrast: more` value.
- `--font-mono` is for code and index numerals only — UI labels use
  `--font-sans`, sentence case, no letter-spacing.
- Keep `DESIGN.md` (repo root) in sync for any visual/token change too.

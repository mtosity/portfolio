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
  | a palette role (`world.css` / `tokens.css`) | `CORE` |
  | a status color (`system.css`) | `STATUS` |
  | the chart palette (`system.css`) | `CHART` |
  | a face, or the world itself | `world.ts` (`WORLD.faces`, `rules`) |
  | the type / space scale | `STEPS` / `SPACE` |
  | an easing or duration | `EASES` / `DURATIONS` |
  | a component exported from `index.ts` | add a `<Specimen>` |

  `ALL_VARS` is derived from these lists, so resolved values show automatically.

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
- A visual world is `world.css` + `world.ts` (+ the app's `fonts.ts`).
  Roles never change name between worlds; only values do.
- Keep `DESIGN.md` (repo root) in sync for any visual/token change too.

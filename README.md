# ( ͡° ͜ʖ ͡° )

Turborepo + pnpm workspace.

```
apps/web              → mtosity.com (Next.js 16, React 19, Tailwind v4)
packages/
  design-system       → tokens + reusable UI
  lib                 → shared utils & constants
  admin               → /admin pages + auth + API handlers
  tool-speech-to-text → /tools/speech-to-text
  tool-img-grid       → /tools/img-grid
  tool-instagram      → /tools/instagram (+ yt-dlp API)
  whisper             → shared WASM Whisper worker
  typescript-config   → shared tsconfigs
```

```sh
pnpm install
pnpm dev        # develop
pnpm build      # production build
pnpm lint       # eslint
pnpm typecheck  # tsc across packages
```

# oskargramnielsen.info

Lead-generation site for AI implementation & automation services.

- **Stack:** Next.js (App Router, static export) · React · TypeScript · Tailwind CSS v4 · Motion · Lenis
- **Languages:** English at `/`, Danish at `/da/` (separate root layouts in `src/app/(en)` and `src/app/(da)`)
- **Content:** all copy lives in `src/content/` — `en.ts`, `da.ts`, `timeline.ts`, `cases.ts`, `site.ts`

```bash
pnpm install
pnpm dev        # http://localhost:9002
pnpm build      # static output in out/
pnpm lint && pnpm typecheck
```

Deployed on Vercel from `main`.

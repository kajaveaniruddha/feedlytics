# feedlytics-dashboard

Next.js **App Router** frontend for Feedlytics: workspaces, feedback, billing UI, and Google sign-in. It talks to **`feedlytics-service`** over HTTP using **`NEXT_PUBLIC_API_BASE_URL`** (see repo root `.env.development.example`).

## Prerequisites

Use **pnpm** (version pinned via `packageManager` in `package.json`). From the monorepo root, copy `.env.development.example` → `.env.development` and set at least `NEXT_PUBLIC_API_BASE_URL` (e.g. `http://localhost:8081`) and the Google client IDs as documented in the root README.

## Scripts

| Command | Description |
| ------- | ----------- |
| `pnpm dev` | Next.js dev server (default port **3000**; root `docker-compose.dev.yml` overrides `PORT` when running in Docker) |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | ESLint |

## Docker dev

The root compose file runs:

`pnpm exec next dev --webpack -H 0.0.0.0`

so the app binds on `0.0.0.0:3000` inside the container (webpack mode is used for reliability with fonts/TLS in some Docker setups).

## More documentation

- Monorepo quick start, ports, and deployment: **[../README.md](../README.md)**
- Plan copy shown on marketing UI: `src/features/workspace/lib/plan-features.ts` (keep aligned with enforcement in **feedlytics-service** `*PlanLimitStrategy` classes).

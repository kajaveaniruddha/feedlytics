# Next.js Dashboard

The main web application — user-facing dashboard for managing feedback, analytics, billing, and settings.

## Tech Stack

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS** + Radix UI + shadcn/ui
- **Drizzle ORM** with Neon Postgres (serverless driver)
- **NextAuth.js** (GitHub + Google OAuth)
- **Stripe** (payments and billing)
- **TanStack Query + Table** (data fetching and tables)
- **prom-client** (Prometheus metrics)

## Port

`3000` in both development and production.

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server with hot reload |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm db:push` | Push Drizzle schema to database |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:migrate` | Run Drizzle migrations |
| `pnpm db:studio` | Open Drizzle Studio (DB browser) |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run tests with Vitest |

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/auth/*` | * | NextAuth.js authentication |
| `/api/register` | POST | User registration |
| `/api/verify-code` | POST | Email verification |
| `/api/get-analytics` | GET | Dashboard analytics (instrumented with Prometheus) |
| `/api/get-messages` | GET | Fetch feedback messages |
| `/api/get-categories` | GET | Feedback categories |
| `/api/send-message` | POST | Submit feedback (from widget) |
| `/api/get-widget-settings` | POST | Widget configuration |
| `/api/get-user-details` | GET | User profile |
| `/api/update-user-data` | POST | Update user settings |
| `/api/checkout-sessions` | POST | Stripe checkout |
| `/api/stripe-webhook` | POST | Stripe webhook handler |
| `/api/user-workflows` | * | Notification workflow config |
| `/api/metrics` | GET | Prometheus metrics endpoint |

## Metrics

This service exposes Prometheus metrics at `/api/metrics`. The `get-analytics` route is instrumented with latency tracking. To instrument additional routes, use the `withMetrics` helper:

```typescript
import { withMetrics } from "@/lib/metrics";

async function handler(request: Request) {
  // your logic
}

export const GET = withMetrics(handler, "/api/your-route");
```

## Key Directories

```
Next/
├── src/
│   ├── app/
│   │   ├── (app)/          # Authenticated app pages
│   │   ├── (auth)/         # Login/register pages
│   │   └── api/            # API routes
│   ├── components/         # Shared UI components
│   ├── config/             # Auth config, session helpers
│   ├── db/                 # Drizzle ORM setup + models
│   ├── lib/                # Utilities, metrics
│   └── schemas/            # Zod validation schemas
├── Dockerfile              # Production image
└── Dockerfile.dev          # Development image (hot reload)
```

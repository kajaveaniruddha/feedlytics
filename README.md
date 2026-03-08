# FEEDLYTICS

*Transform Feedback into Actionable Insights Effortlessly*

---

## What is Feedlytics?

> Feedlytics helps teams **collect, manage, and analyze feedback with AI** from users.
> Users can either submit customizable forms or embed a lightweight chat widget into their apps to collect actionable insights.

---

## Problem it Solves

SaaS teams often struggle to gather feedback from multiple sources, make sense of it quickly, and respond on time.
Spreadsheets, scattered emails, and disconnected tools just don't scale.

---

## How Feedlytics Solves It

- **Centralized Feedback Collection** — Collect all feedback in one place using a lightweight React widget or customizable forms.
- **AI-Powered Insights** — Auto-analysis with **Groq's LLM (LLaMA 3.1)** for sentiment detection and categorization (Bug, Request, Complaint, Suggestion, Question, Praise).
- **Real-Time Alerts** — Trigger instant workflows via **Slack** or **Google Chat** when important feedback arrives.
- **Smart Dashboard** — Filter, search, and sort through feedback with blazing-fast UI using **TanStack Tables** and **Next.js**.
- **Subscription Billing** — 3-tier plan system (Free, Pro, Business) with **Stripe Subscriptions**, monthly usage resets, and self-service billing portal.
- **Data Retention** — Automated cleanup of old feedbacks based on plan tier (90 days free, 1 year pro, unlimited business).
- **High-Traffic Ready** — Powered by Redis queues, rate limiting, and Bloom filters to handle scale.
- **Observability** — Prometheus + Grafana monitoring with per-API latency tracking (p99/p95) and system metrics.

---

## Pricing Plans

All plans include AI-powered sentiment analysis, categorization, and monthly usage resets.


| Feature              | Free    | Pro ($19/mo) | Business ($79/mo) |
| -------------------- | ------- | ------------ | ----------------- |
| Feedbacks/month      | 200     | 2,000        | 20,000            |
| Workflows            | 3       | 15           | Unlimited         |
| Team members         | 1       | 5            | 25                |
| Data retention       | 90 days | 1 year       | Unlimited         |
| CSV export           | -       | Yes          | Yes               |
| Feedback replies     | -       | Yes          | Yes               |
| Webhook integrations | -       | Yes          | Yes               |
| API access           | -       | -            | Yes               |
| Remove branding      | -       | -            | Yes               |


Plan limits are centrally configured in `Next/src/config/plans.ts` and `Services/src/config/plans.ts`.

---

## Architecture

```
                     ┌─────────────────────────────────────────────┐
                     │                  Browser                    │
                     └──────┬──────────────┬──────────────┬────────┘
                            │              │              │
                       :3000│         :4173│              │
                            ▼              ▼              │
                     ┌────────────┐ ┌────────────┐       │
                     │  Next.js   │ │   Widget   │       │
                     │ (Dashboard)│ │  (Embed)   │       │
                     └──────┬─────┘ └──────┬─────┘       │
                            │              │              │
                            │   :3001      │              │
                            ▼──────────────▼              │
                     ┌─────────────────────┐              │
                     │     Services        │◄─────────────┘
                     │  (Express + BullMQ) │
                     └───┬────────────┬────┘
                         │            │
                         ▼            ▼
                  ┌───────────┐ ┌───────────────┐
                  │   Redis   │ │ Neon Postgres  │
                  │  :6379    │ │   (External)   │
                  └───────────┘ └───────────────┘
```


| Service           | Port   | Description                                           |
| ----------------- | ------ | ----------------------------------------------------- |
| **Next.js**       | `3000` | Dashboard, auth, Stripe billing, API metrics          |
| **Services**      | `3001` | API, BullMQ workers, AI analysis, data retention cron |
| **Widget**        | `4173` | Embeddable feedback widget (Vite + React)             |
| **Redis**         | `6379` | Job queues, rate limiting, caching                    |
| **Prometheus**    | `9090` | Metrics collection and storage                        |
| **Grafana**       | `3002` | Dashboards and visualization                          |
| **node-exporter** | `9100` | Host CPU, RAM, disk metrics                           |


---

## Monitoring

Feedlytics includes Prometheus + Grafana monitoring with:

- **Per-API latency** (p99, p95) for all Next.js API routes
- **Overall latency** (p99, p50) across all routes
- **System metrics** (CPU, RAM, disk) via node-exporter
- All API routes instrumented via `withMetrics` wrapper using `globalThis` singleton pattern

See the full monitoring guide: **[monitoring/MONITORING.md](monitoring/MONITORING.md)**

---

## Project Structure

```
feedlytics/
├── Next/                   # Next.js dashboard — see Next/README.md
│   ├── src/config/plans.ts # Centralized plan limits (Free/Pro/Business)
│   ├── src/db/models/      # Drizzle ORM schemas (user, feedback, workflows)
│   └── src/app/api/        # API routes (billing, checkout, webhook, etc.)
├── Services/               # Express + BullMQ backend
│   ├── src/config/plans.ts # Plan limits (mirrors Next)
│   ├── src/jobs/           # Data retention cron, email, AI analysis
│   └── src/workers/        # BullMQ workers (email, feedback, notifications)
├── Widget/                 # Vite + React embeddable widget
├── monitoring/             # Prometheus, Grafana configs + MONITORING.md
├── Prod/                   # Production-only configs (Nginx, build script)
├── docker-compose.dev.yml  # Local development (uses Dockerfile.dev)
├── docker-compose.yml      # Production (image-only, no build context)
└── .env.development.example # Environment variable template
```

---

## Local Development Setup

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)
- [Git](https://git-scm.com/)
- A [Neon](https://neon.tech/) PostgreSQL database (free tier works)
- A [Groq](https://console.groq.com/) API key (free tier works)
- A [Stripe](https://dashboard.stripe.com/test/apikeys) account (test mode)

### Quick Start

**1. Clone the repository**

```bash
git clone https://github.com/your-username/feedlytics.git
cd feedlytics
```

**2. Create your environment file**

```bash
cp .env.development.example .env.development
```

Open `.env.development` and fill in your values. At minimum you need:

- `DATABASE_URL` — your Neon Postgres connection string
- `GROQ_API_KEY` — your Groq API key
- `NEXTAUTH_SECRET` — any random string
- `STRIPE_SECRET_KEY` — your Stripe test secret key
- `STRIPE_PRICE_PRO_MONTHLY`, `STRIPE_PRICE_PRO_YEARLY`, `STRIPE_PRICE_BUSINESS_MONTHLY`, `STRIPE_PRICE_BUSINESS_YEARLY` — create products/prices in your [Stripe Dashboard](https://dashboard.stripe.com/test/products) and copy the price IDs

**3. . Start all services**

```bash
docker compose -f docker-compose.dev.yml up --build
```

Once running, open:

- **Dashboard:** [http://localhost:3000](http://localhost:3000)
- **Services API:** [http://localhost:3001](http://localhost:3001) (health check: [http://localhost:3001/health](http://localhost:3001/health))
- **Widget:** [http://localhost:4173](http://localhost:4173)
- **Grafana:** [http://localhost:3002](http://localhost:3002) (admin/admin)

**4. Test Stripe webhooks locally (optional)**

```bash
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

Update `STRIPE_WEBHOOK_SECRET` in `.env.development` with the temporary secret printed by the CLI.

### Stopping

```bash
docker compose -f docker-compose.dev.yml down
```

To also remove volumes (Redis data):

```bash
docker compose -f docker-compose.dev.yml down -v
```

---

## Dev vs Production


|                     | Development                    | Production                                    |
| ------------------- | ------------------------------ | --------------------------------------------- |
| **Compose file**    | `docker-compose.dev.yml`       | `docker-compose.yml` / GH Actions             |
| **Dockerfiles**     | `Dockerfile.dev` (per service) | `Dockerfile` (per service)                    |
| **Source code**     | Volume-mounted for hot reload  | Copied into image at build time               |
| **Env file**        | `.env.development` (local)     | Secrets via GH Secrets / VPS `.env`           |
| **Build target**    | Dev servers (`pnpm dev`)       | Optimized builds (`pnpm build && pnpm start`) |
| **Stripe webhooks** | Stripe CLI forwarding          | Configured webhook endpoint URL               |


---

## Deployment (GitHub Actions)

Deployments are managed via the **Deploy Service** workflow (`Actions` tab > `Deploy Service` > `Run workflow`).

You get checkboxes to pick **any combination** of services to build and deploy in a single run:


| Input                          | Type     | Description                                                  |
| ------------------------------ | -------- | ------------------------------------------------------------ |
| **Deploy Next.js**             | Checkbox | Build and deploy the Next.js dashboard                       |
| **Deploy Services**            | Checkbox | Build and deploy the Express/BullMQ backend                  |
| **Deploy Widget**              | Checkbox | Build and deploy the Vite widget                             |
| **Branch**                     | Text     | Branch to build from (defaults to `master`)                  |
| **Deploy to VPS after build?** | Checkbox | Uncheck to only build + push to Docker Hub without deploying |


**Required GitHub Secrets:**


| Secret                               | Description                      |
| ------------------------------------ | -------------------------------- |
| `DOCKERHUB_TOKEN`                    | Docker Hub access token          |
| `HOSTINGER_VPS_HOST`                 | VPS hostname/IP                  |
| `HOSTINGER_VPS_USER`                 | VPS SSH username                 |
| `HOSTINGER_VPS_PVT_KEY`              | VPS SSH private key              |
| `DATABASE_URL`                       | Production Neon Postgres URL     |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key           |
| `STRIPE_SECRET_KEY`                  | Stripe secret key                |
| `STRIPE_WEBHOOK_SECRET`              | Stripe webhook secret            |
| `STRIPE_PRICE_PRO_MONTHLY`           | Stripe Pro monthly price ID      |
| `STRIPE_PRICE_PRO_YEARLY`            | Stripe Pro yearly price ID       |
| `STRIPE_PRICE_BUSINESS_MONTHLY`      | Stripe Business monthly price ID |
| `STRIPE_PRICE_BUSINESS_YEARLY`       | Stripe Business yearly price ID  |


---

## Environment Variables

See `[.env.development.example](.env.development.example)` for the full list with descriptions. Key variables:


| Variable                                   | Required | Description                                                        |
| ------------------------------------------ | -------- | ------------------------------------------------------------------ |
| `DATABASE_URL`                             | Yes      | Neon Postgres connection string                                    |
| `REDIS_URL`                                | Auto     | Pre-configured for Docker (`redis://default:redispass@redis:6379`) |
| `GROQ_API_KEY`                             | Yes      | Groq API key for AI analysis                                       |
| `NEXTAUTH_SECRET`                          | Yes      | Random string for session encryption                               |
| `NEXTAUTH_URL`                             | Yes      | `http://localhost:3000` for dev                                    |
| `GITHUB_ID` / `GITHUB_SECRET`              | Optional | GitHub OAuth app credentials                                       |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`    | Optional | Google OAuth app credentials                                       |
| `STRIPE_SECRET_KEY`                        | Yes      | Stripe test/live secret key                                        |
| `STRIPE_WEBHOOK_SECRET`                    | Yes      | Stripe webhook signing secret                                      |
| `STRIPE_PRICE_PRO_MONTHLY`                 | Yes      | Stripe price ID for Pro monthly plan                               |
| `STRIPE_PRICE_PRO_YEARLY`                  | Yes      | Stripe price ID for Pro yearly plan                                |
| `STRIPE_PRICE_BUSINESS_MONTHLY`            | Yes      | Stripe price ID for Business monthly plan                          |
| `STRIPE_PRICE_BUSINESS_YEARLY`             | Yes      | Stripe price ID for Business yearly plan                           |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`       | Optional | Stripe publishable key (for client-side)                           |
| `GOOGLE_MAIL_FROM` / `GOOGLE_APP_PASSWORD` | Optional | Gmail SMTP for email alerts                                        |


---

## Screenshots

feedlytics
flowchart-0
image
image
image
image

---

## Live Demo

[https://feedlytics.in](https://feedlytics.in)

---

## License

This project is open source. See [LICENSE](LICENSE) for details.
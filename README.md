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
- **Smart Dashboard** — Workspace feedback, billing, and team management with **Next.js** and **TanStack Query** for server state.
- **Subscription Billing** — 3-tier plan system (Free, Pro, Business) with **Stripe Subscriptions**, usage limits enforced in the API, and the Stripe customer portal for self-service billing changes.
- **Plan limits** — Per-tier caps on feedback volume, campaigns, members, widgets, and categories (see `feedlytics-service` plan limit strategies). Retention windows are part of the plan definition; automated purge jobs are not wired in the API yet.
- **High-Traffic Ready** — **Redis** backs BullMQ in the queue worker and **pub/sub** in **feedlytics-service** for in-app notifications (fan-out to WebSockets).

---

## Pricing Plans

All plans include AI-powered sentiment analysis, categorization, and monthly usage resets.


| Feature                             | Free        | Pro ($19/mo) | Business ($79/mo) |
| ----------------------------------- | ----------- | ------------ | ----------------- |
| Feedbacks/month                     | 100         | 5,000        | 20,000            |
| Campaigns                           | 1           | 10           | 50                |
| Team members                        | 2           | 10           | 50                |
| Widgets                             | 1           | 5            | 10                |
| Feedback categories                 | 3           | 6            | 10                |
| API / server feedback (monthly cap) | 1,000 calls | 50,000 calls | 200,000 calls     |
| Data retention (plan policy)        | 90 days     | 1 year       | Unlimited         |


**Enforcement:** usage caps (feedbacks, campaigns, members, widgets, categories, API calls per month) are implemented in **`feedlytics-service`** (`FreePlanLimitStrategy`, `ProPlanLimitStrategy`, `BusinessPlanLimitStrategy`). Marketing copy on the dashboard should stay in sync with **`feedlytics-dashboard/src/features/workspace/lib/plan-features.ts`**.

---

## Architecture

```mermaid
flowchart LR
  subgraph clients [Browser]
    D["feedlytics-dashboard :3000"]
    W["feedlytics-widget :4173"]
  end
  API["feedlytics-service :8081"]
  Q["feedlytics-queue-service :3001 / gRPC :9090"]
  R[Redis :6379]
  P[(Neon Postgres)]
  D -->|"REST"| API
  W -->|"REST"| API
  API -->|"gRPC client"| Q
  API --> P
  API -->|"Redis pub/sub in-app notifications"| R
  Q -->|"BullMQ job store"| R
```



The **Spring Boot API** owns persistence, auth, Stripe webhooks, and public REST. It connects to **Postgres** for data and, when Redis is configured, to **Redis** for **in-app notifications**: it **publishes** events on a per-user channel; a **Redis message listener** in the same API process forwards payloads to **WebSocket** subscribers (`/api/v1/notifications/stream`). If Redis is unavailable, the API can push directly to WebSockets for that path.

The **queue service** runs **BullMQ** workers (email, feedback AI analysis, invitations, outbound workflow webhooks) backed by the **same Redis** instance, and exposes **gRPC** on port **9090** so the API can enqueue work. Workers call back into the API using **`FEEDLYTICS_QUEUE_CALLBACK_BASE_URL`** (see `.env.development.example`).


| Service                      | Ports (dev compose)                            | Description                                   |
| ---------------------------- | ---------------------------------------------- | --------------------------------------------- |
| **feedlytics-dashboard**     | `3000`                                         | Next.js app — UI, auth flows, billing UI      |
| **feedlytics-widget**        | `4173`                                         | Vite embeddable widget                        |
| **feedlytics-service**       | `8081` (HTTP), `9091` (gRPC in-app / internal) | Spring Boot — REST API, Stripe webhooks, data |
| **feedlytics-queue-service** | `3001` (HTTP), `9090` (gRPC)                   | Express + BullMQ workers + gRPC job ingress   |
| **Redis**                    | `6379`                                         | **BullMQ** (queue service) + **pub/sub** (Spring in-app notifications → WebSocket fan-out) |


### Edge traffic and abuse protection (production)

Public HTTP traffic to the live site and API is proxied through **Cloudflare**. **Rate limiting, bot rules, and WAF-style throttling are configured in Cloudflare**, not inside `feedlytics-service`, `feedlytics-dashboard`, or `feedlytics-queue-service`. Locally and on raw container ports there is no Cloudflare layer—only whatever defaults the frameworks expose.

The applications still enforce **authentication**, workspace **authorization**, and **plan / usage limits** (feedbacks, API calls per month, etc.) in **`feedlytics-service`**.

---

## Project Structure

```
feedlytics/
├── feedlytics-dashboard/   # Next.js — see feedlytics-dashboard/README.md
├── feedlytics-service/     # Spring Boot + Kotlin API (JPA, Flyway, Stripe, gRPC client)
├── feedlytics-queue-service/  # Express + BullMQ + gRPC workers — see its README
├── feedlytics-widget/      # Vite + React embed — see feedlytics-widget/README.md
├── prod/                   # VPS: prod/.env (gitignored). Template: prod/.env.example
│   └── nginx/              # local only (gitignored) — copy to /etc/nginx on VPS
├── scripts/                # e.g. build-and-push.sh (local / CI)
├── docker-compose.dev.yml  # Local dev (Dockerfile.dev, volume mounts)
├── docker-compose.yml      # Production (pre-built images)
└── .env.development.example
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

- `SPRING_DATASOURCE_URL` — your Neon Postgres connection string
- `GROQ_API_KEY` — your Groq API key
- `JWT_SECRET` — random string (at least 32 characters)
- `GOOGLE_OAUTH_CLIENT_ID` and `NEXT_PUBLIC_GOOGLE_CLIENT_ID` — same Google OAuth Web client ID (for Sign in with Google)
- `NEXT_PUBLIC_API_BASE_URL` — browser-facing API base URL for the dashboard (e.g. `http://localhost:8081`)
- `VITE_FEEDLYTICS_API_BASE_URL` — same origin for the widget bundle (local dev / Docker)
- `STRIPE_SECRET_KEY` — your Stripe test secret key
- `STRIPE_PRICE_PRO_MONTHLY`, `STRIPE_PRICE_PRO_YEARLY`, `STRIPE_PRICE_BUSINESS_MONTHLY`, `STRIPE_PRICE_BUSINESS_YEARLY` — create products/prices in your [Stripe Dashboard](https://dashboard.stripe.com/test/products) and copy the price IDs

**3. Start all services**

```bash
docker compose -f docker-compose.dev.yml up --build
```

Once running, open:

- **Dashboard:** [http://localhost:3000](http://localhost:3000)
- **API (Spring Boot):** [http://localhost:8081](http://localhost:8081) — e.g. [http://localhost:8081/actuator/health](http://localhost:8081/actuator/health)
- **Queue service (Express):** [http://localhost:3001/health](http://localhost:3001/health)
- **Widget dev server:** [http://localhost:4173](http://localhost:4173)

**4. Test Stripe webhooks locally (optional)**

Stripe webhooks are handled by `**feedlytics-service`**, not the Next.js app:

```bash
stripe listen --forward-to localhost:8081/api/v1/webhooks/stripe
```

Update `STRIPE_WEBHOOK_SECRET` in `.env.development` with the signing secret from the Stripe CLI (or your Stripe Dashboard endpoint).

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


|                     | Development                    | Production                                                                                         |
| ------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------- |
| **Compose file**    | `docker-compose.dev.yml`       | `docker-compose.yml` / GH Actions                                                                  |
| **Dockerfiles**     | `Dockerfile.dev` (per service) | `Dockerfile` (per service)                                                                         |
| **Source code**     | Volume-mounted for hot reload  | Copied into image at build time                                                                    |
| **Env file**        | `.env.development` (local)     | GitHub Secrets for build-time client env; `**prod/.env`** on the VPS for runtime (DB, Stripe, JWT) |
| **Build target**    | Dev servers (`pnpm dev`)       | Optimized builds (`pnpm build && pnpm start`)                                                      |
| **Stripe webhooks** | Stripe CLI forwarding          | Configured webhook endpoint URL                                                                    |


---

## Deployment (GitHub Actions)

Deployments are managed via the **Deploy Service** workflow (`Actions` tab > `Deploy Service` > `Run workflow`).

You get checkboxes to pick **any combination** of services to build and deploy in a single run:


| Input            | Type     | Description                                                     |
| ---------------- | -------- | --------------------------------------------------------------- |
| **branch**       | Text     | Git branch to build from (default `master`)                     |
| **queue**        | Checkbox | Select **feedlytics-queue-service** for build/deploy steps      |
| **service**      | Checkbox | Select **feedlytics-service** (Spring Boot)                     |
| **dashboard**    | Checkbox | Select **feedlytics-dashboard** (Next.js)                       |
| **widget**       | Checkbox | Select **feedlytics-widget** (Vite)                             |
| **build**        | Checkbox | Build Docker images and push to Docker Hub (default on)         |
| **deploy**       | Checkbox | SSH to VPS, pull images, restart selected services (default on) |
| **sync_compose** | Checkbox | Upload `docker-compose.yml` to the VPS                          |


At least one of **build**, **deploy**, or **sync_compose** must be enabled. If **build** or **deploy** is on, at least one service checkbox must be selected (unless you only use **sync_compose**).

Docker Hub username is set in the workflow file (`env.DOCKER_USERNAME`); override the image namespace in CI if you fork.

Building **feedlytics-dashboard** bakes `NEXT_PUBLIC_GOOGLE_CLIENT_ID` and `NEXT_PUBLIC_API_BASE_URL` into the client. The **validate** job requires `NEXT_PUBLIC_GOOGLE_CLIENT_ID` when building the dashboard. The widget build uses secret `**VITE_FEEDLYTICS_API_BASE_URL`** (falls back in script if unset—see workflow).

**GitHub Actions secrets** (used by `.github/workflows/deploy-service.yml`):


| Secret                         | Description                                                                           |
| ------------------------------ | ------------------------------------------------------------------------------------- |
| `DOCKERHUB_TOKEN`              | Docker Hub access token (password for `docker/login-action`)                          |
| `HOSTINGER_VPS_HOST`           | VPS hostname or IP                                                                    |
| `HOSTINGER_VPS_USER`           | VPS SSH username                                                                      |
| `HOSTINGER_VPS_PVT_KEY`        | VPS SSH private key                                                                   |
| `NEXT_PUBLIC_API_BASE_URL`     | Public API URL baked into the dashboard image (e.g. `https://api.feedlytics.in`)      |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth Web client ID (dashboard build; must match API `GOOGLE_OAUTH_CLIENT_ID`) |
| `VITE_FEEDLYTICS_API_BASE_URL` | API origin for the widget production build                                            |


Stripe, JDBC, JWT, and other runtime secrets are **not** passed through this workflow; configure them on the server in `**prod/.env`** (see `prod/.env.example`).

---

## Environment Variables

See `[.env.development.example](.env.development.example)` for the full list with descriptions. Key variables:


| Variable                                   | Required  | Description                                                        |
| ------------------------------------------ | --------- | ------------------------------------------------------------------ |
| `SPRING_DATASOURCE_URL`                    | Yes       | Neon Postgres JDBC connection string                               |
| `REDIS_URL`                                | Auto      | Pre-configured for Docker (`redis://default:redispass@redis:6379`) |
| `GROQ_API_KEY`                             | Yes       | Groq API key for AI analysis                                       |
| `JWT_SECRET`                               | Yes       | Secret for signing access tokens (min 32 characters)               |
| `GOOGLE_OAUTH_CLIENT_ID`                   | Optional  | Google OAuth Web client ID (backend ID token verification)         |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID`             | Optional  | Same Google client ID (dashboard GIS sign-in; must match above)    |
| `NEXT_PUBLIC_API_BASE_URL`                 | Yes (dev) | Browser-facing Spring API URL (e.g. `http://localhost:8081`)       |
| `STRIPE_SECRET_KEY`                        | Yes       | Stripe test/live secret key                                        |
| `STRIPE_WEBHOOK_SECRET`                    | Yes       | Stripe webhook signing secret                                      |
| `STRIPE_PRICE_PRO_MONTHLY`                 | Yes       | Stripe price ID for Pro monthly plan                               |
| `STRIPE_PRICE_PRO_YEARLY`                  | Yes       | Stripe price ID for Pro yearly plan                                |
| `STRIPE_PRICE_BUSINESS_MONTHLY`            | Yes       | Stripe price ID for Business monthly plan                          |
| `STRIPE_PRICE_BUSINESS_YEARLY`             | Yes       | Stripe price ID for Business yearly plan                           |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`       | Optional  | Stripe publishable key (for client-side)                           |
| `GOOGLE_MAIL_FROM` / `GOOGLE_APP_PASSWORD` | Optional  | Gmail SMTP for email alerts                                        |


---

## Screenshots

*(Placeholder list in the repo—replace with real image links or assets when available.)*

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
<p align="center">
  <a href="https://feedlytics.in"><img src="https://img.shields.io/badge/Live%20Demo-Click%20Here-brightgreen?style=for-the-badge" /></a>
</p>

<h1 align="center">FEEDLYTICS</h1>

<p align="center"><i>Transform Feedback into Actionable Insights Effortlessly</i></p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/BullMQ-FF0000?logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/Groq-000000?logo=groq&logoColor=white" />
  <img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/Stripe-008CDD?logo=stripe&logoColor=white" />
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?logo=githubactions&logoColor=white" />
</p>

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
- **Built-in Payments** — Integrated with **Stripe** for secure checkouts and plan upgrades.
- **High-Traffic Ready** — Powered by Redis queues, rate limiting, and Bloom filters to handle scale.

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

| Service | Port | Description |
|---------|------|-------------|
| **Next.js** | `3000` | Dashboard, auth, Stripe billing |
| **Services** | `3001` | API, BullMQ workers, AI analysis |
| **Widget** | `4173` | Embeddable feedback widget (Vite + React) |
| **Redis** | `6379` | Job queues, rate limiting, caching |
| **Prometheus** | `9090` | Metrics collection and storage |
| **Grafana** | `3002` | Dashboards and visualization |
| **node-exporter** | `9100` | Host CPU, RAM, disk metrics |

---

## Monitoring

Feedlytics includes Prometheus + Grafana monitoring for VPS system metrics (CPU, RAM, disk) and API latency tracking (p99/p95/p90).

See the full monitoring guide: **[monitoring/MONITORING.md](monitoring/MONITORING.md)**

---

## Project Structure

```
feedlytics/
├── Next/                   # Next.js dashboard — see Next/README.md
├── Services/               # Express + BullMQ backend — see Services/README.md
├── Widget/                 # Vite + React embeddable widget — see Widget/README.md
├── monitoring/             # Prometheus, Grafana configs + MONITORING.md
├── Prod/                   # Production-only configs (Nginx, build script)
├── docker-compose.dev.yml  # Local development (uses Dockerfile.dev)
├── docker-compose.yml      # Production (image-only, no build context)
└── .env.development.example # Environment variable template
```

### Service Documentation

| Service | README | Description |
|---|---|---|
| **Next.js** | [Next/README.md](Next/README.md) | Dashboard, auth, billing, API routes, metrics |
| **Services** | [Services/README.md](Services/README.md) | BullMQ workers, AI analysis, email, Prometheus metrics |
| **Widget** | [Widget/README.md](Widget/README.md) | Embeddable feedback widget (Shadow DOM) |
| **Monitoring** | [monitoring/MONITORING.md](monitoring/MONITORING.md) | Prometheus + Grafana setup and queries |

---

## Local Development Setup

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)
- [Git](https://git-scm.com/)
- A [Neon](https://neon.tech/) PostgreSQL database (free tier works)
- A [Groq](https://console.groq.com/) API key (free tier works)

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

The rest can be filled in later as you enable OAuth, Stripe, or email features.

**3. Start all services**

```bash
docker compose -f docker-compose.dev.yml up --build
```

Once running, open:
- **Dashboard:** http://localhost:3000
- **Services API:** http://localhost:3001 (health check: http://localhost:3001/health)
- **Widget:** http://localhost:4173

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

| | Development | Production |
|---|---|---|
| **Compose file** | `docker-compose.dev.yml` | `docker-compose.yml` / GH Actions |
| **Dockerfiles** | `Dockerfile.dev` (per service) | `Dockerfile` (per service) |
| **Source code** | Volume-mounted for hot reload | Copied into image at build time |
| **Env file** | `.env.development` (local) | Secrets via GH Secrets / VPS `.env` |
| **Build target** | Dev servers (`pnpm dev`) | Optimized builds (`pnpm build && pnpm start`) |

---

## Deployment (GitHub Actions)

Deployments are managed via the **Deploy Service** workflow (`Actions` tab > `Deploy Service` > `Run workflow`).

You get checkboxes to pick **any combination** of services to build and deploy in a single run:

| Input | Type | Description |
|---|---|---|
| **Deploy Next.js** | Checkbox | Build and deploy the Next.js dashboard |
| **Deploy Services** | Checkbox | Build and deploy the Express/BullMQ backend |
| **Deploy Widget** | Checkbox | Build and deploy the Vite widget |
| **Branch** | Text | Branch to build from (defaults to `master`) |
| **Deploy to VPS after build?** | Checkbox | Uncheck to only build + push to Docker Hub without deploying |

The workflow builds the selected services, pushes images to Docker Hub, then SSHes into the VPS to do a zero-downtime restart of only those services. Unselected services remain untouched.

**Required GitHub Secrets:**

| Secret | Description |
|---|---|
| `DOCKERHUB_TOKEN` | Docker Hub access token |
| `HOSTINGER_VPS_HOST` | VPS hostname/IP |
| `HOSTINGER_VPS_USER` | VPS SSH username |
| `HOSTINGER_VPS_PVT_KEY` | VPS SSH private key |
| `DATABASE_URL` | Production Neon Postgres URL (for Next.js build args) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_PRICE_ID` | Stripe price ID |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret |

---

## Environment Variables

See [`.env.development.example`](.env.development.example) for the full list with descriptions. Key variables:

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Neon Postgres connection string |
| `REDIS_URL` | Auto | Pre-configured for Docker (`redis://default:redispass@redis:6379`) |
| `GROQ_API_KEY` | Yes | Groq API key for AI analysis |
| `NEXTAUTH_SECRET` | Yes | Random string for session encryption |
| `NEXTAUTH_URL` | Yes | `http://localhost:3000` for dev |
| `GITHUB_ID` / `GITHUB_SECRET` | Optional | GitHub OAuth app credentials |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Optional | Google OAuth app credentials |
| `STRIPE_SECRET_KEY` | Optional | Stripe test secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Optional | Stripe test publishable key |
| `GOOGLE_MAIL_FROM` / `GOOGLE_APP_PASSWORD` | Optional | Gmail SMTP for email alerts |

---

## Screenshots

![feedlytics](https://github.com/user-attachments/assets/6c86d36d-1251-431b-a957-e8f6e24f5aea)
![flowchart-0](https://github.com/user-attachments/assets/7e93f0e5-11b4-459d-ab53-697ccc42e74a)
![image](https://github.com/user-attachments/assets/5d6db0af-1965-4444-a444-ff566610c596)
![image](https://github.com/user-attachments/assets/9698e4b9-a736-400d-9e85-52dea7060af9)
![image](https://github.com/user-attachments/assets/db8973ad-3909-4013-9c74-d83b9a04c2e8)
![image](https://github.com/user-attachments/assets/5c3cae79-4c6a-4693-813f-72b8b1c43589)

---

## Live Demo

[https://feedlytics.in](https://feedlytics.in)

---

## License

This project is open source. See [LICENSE](LICENSE) for details.

# Services Backend

The backend API service handling email delivery, feedback processing (AI analysis), and background job management via BullMQ.

## Tech Stack

- **Express.js**
- **TypeScript**
- **BullMQ** (Redis-backed job queues)
- **Drizzle ORM** with Neon Postgres
- **Groq SDK + LangChain** (AI-powered feedback analysis)
- **Nodemailer** (email delivery via Gmail SMTP)
- **prom-client** (Prometheus metrics)

## Port

`3001` in both development and production.

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server with file watching (`tsx watch`) |
| `pnpm build` | Compile TypeScript |
| `pnpm start` | Start production server (`ts-node`) |
| `pnpm db:push` | Push Drizzle schema to database |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:migrate` | Run Drizzle migrations |
| `pnpm db:studio` | Open Drizzle Studio |

## API Endpoints

| Route | Method | Description |
|---|---|---|
| `/health` | GET | Health check |
| `/metrics` | GET | Prometheus metrics (default Node.js process metrics) |
| `/add-feedback` | POST | Queue feedback for AI processing |
| `/get-verification-email` | POST | Queue verification email |
| `/get-payment-email` | POST | Queue payment confirmation email |
| `/health-email` | GET | Test email queue (dev only) |
| `/health-feedback` | GET | Test feedback queue (dev only) |

## Background Workers

| Worker | Queue | Description |
|---|---|---|
| `emailWorker` | `emailQueue` | Sends verification and payment emails via Nodemailer |
| `feedbackWorker` | `feedbackQueue` | Processes feedback with Groq LLM for sentiment and category analysis, stores in DB |
| `workflowNotificationWorker` | — | Sends Slack/Google Chat notifications based on user-configured workflows |

## Key Directories

```
Services/
├── index.ts                # Express server, routes, metrics
├── src/
│   ├── db/                 # Drizzle ORM setup + models
│   ├── jobs/               # LLM functions, email sending logic
│   ├── queue.ts            # BullMQ queue definitions
│   └── workers/            # Background job processors
├── scripts/
│   └── wait-for-deps.sh    # Waits for DB before starting (dev)
├── Dockerfile              # Production image
└── Dockerfile.dev          # Development image (hot reload)
```

## Startup (Dev)

In Docker dev, the service runs:

```bash
sh ./scripts/wait-for-deps.sh pnpm run db:push && pnpm run dev
```

This waits for the Neon database to be reachable, pushes the latest schema, then starts the dev server with file watching.

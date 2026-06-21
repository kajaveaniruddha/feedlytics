# feedlytics-queue-service

Background worker service: **BullMQ** job processing, **Express** for a small HTTP surface (health + email enqueue helpers), and a **gRPC** server so **feedlytics-service** can enqueue AI analysis and related work without going through HTTP.

## Tech stack

- **Node.js** + **TypeScript** + **Express**
- **BullMQ** + **ioredis** (Redis)
- **@grpc/grpc-js** — feedback analysis job ingress (see `proto/feedback_analysis.proto`)
- **Groq** + **LangChain** — LLM calls for sentiment / classification
- **Nodemailer** — transactional email (verification, payment confirmation, invitations)

There is **no Drizzle ORM** in this package; the Spring API owns the database.

## Ports

| Port   | Purpose |
| ------ | ------- |
| `3001` | HTTP (`PORT`, default) — health + email routes |
| `9090` | gRPC (`GRPC_PORT`, default) — job RPCs from feedlytics-service |

## Environment

Local development loads **`../.env.development`** (repo root) when `NODE_ENV !== "production"` (`index.ts`). Required variables are validated in `src/config/env.ts` (e.g. `REDIS_URL`, `GROQ_API_KEY`, Gmail SMTP fields).

In **Docker Compose dev**, Redis URL and other vars come from the same root `.env.development` as the other services.

## Scripts

| Command        | Description |
| -------------- | ----------- |
| `pnpm dev`     | `tsx watch` — Express + gRPC + workers |
| `pnpm build`   | Compile TypeScript to `dist/` |
| `pnpm start`   | Run `node dist/index.js` |
| `pnpm postbuild` | Runs `scripts/verify-build.js` |

## HTTP routes

| Method | Path | Description |
| ------ | ---- | ----------- |
| GET    | `/health` | Liveness |
| POST   | `/get-verification-email` | Queue verification email |
| POST   | `/get-payment-email` | Queue payment confirmation email |

Feedback AI processing is **not** exposed as a public HTTP route; the API enqueues work via **gRPC**.

## Workers (`src/workers`)

| Module | Queue / role | Description |
| ------ | ------------ | ----------- |
| `email.worker` | email queue | Sends mail via Nodemailer |
| `feedback.worker` | feedback queue | Groq analysis; callbacks batch to feedlytics-service internal API |
| `invitation-email.worker` | invitation queue | Workspace invite emails |
| `notification.worker` | notifications | Workflow / delivery notifications |

## Layout

```
feedlytics-queue-service/
├── index.ts                 # Express listen + start gRPC + workers
├── proto/                   # gRPC `.proto` definitions
├── src/
│   ├── app.ts               # Express app wiring
│   ├── config/env.ts        # Zod-validated env
│   ├── grpc/                # gRPC server implementation
│   ├── queues/              # BullMQ queue definitions
│   ├── workers/             # BullMQ workers
│   ├── services/            # LLM, email, feedback orchestration
│   └── routes/              # HTTP routes
├── Dockerfile
└── Dockerfile.dev
```

For monorepo setup and production deploy, see the root **[README.md](../README.md)**.

# Services Backend — Clean Architecture Refactoring Plan

## Current State Assessment

The Services backend (`/Services`) is an Express + BullMQ async job processing service that handles:
- Email delivery (verification, payment confirmation)
- Feedback ingestion (LLM sentiment analysis, DB persistence, workflow notifications)
- Workflow notifications (Slack, Google Chat webhooks)
- Data retention cleanup (cron-based)

### Problems in the Current Code

| # | Problem | Where | Severity |
|---|---------|-------|----------|
| 1 | **God file** — all routes, queue enqueue logic, health checks, and server bootstrap in one 165-line `index.ts` | `index.ts` | High |
| 2 | **No controller layer** — route handlers inline queue `.add()` calls with `.then()/.catch()` chains | `index.ts:18-85` | High |
| 3 | **No service layer** — no abstraction between HTTP handlers and queue/worker internals | Everywhere | High |
| 4 | **No repository layer** — workers run raw Drizzle queries inline | `feedbackWorker.ts:58-79` | High |
| 5 | **No request validation** — incoming payloads are trusted blindly, no Zod schemas | `index.ts` | High |
| 6 | **No typed interfaces** — `req: any, res: any` on every handler, `any` in worker data | `index.ts`, workers | High |
| 7 | **No error handling framework** — no `ApiError` class, no centralized error middleware | Everywhere | High |
| 8 | **No response standardization** — ad-hoc `res.send({ status, message })` patterns | `index.ts` | Medium |
| 9 | **Workers have mixed concerns** — `feedbackWorker` does LLM calls + DB inserts + workflow dispatch in one function | `feedbackWorker.ts` | Medium |
| 10 | **Hardcoded HTML email templates** inline in function bodies | `send-email.ts` | Medium |
| 11 | **No structured logging** — `console.log`/`console.error` everywhere with inconsistent formats | Everywhere | Medium |
| 12 | **Dead code** — 45 lines of commented-out Ollama code | `llm-functions.ts:53-96`, `llm-models.ts:28-44` | Low |
| 13 | **Test endpoints in production** — `/health-email`, `/health-feedback` with hardcoded PII | `index.ts:91-151` | Medium |
| 14 | **Inconsistent naming** — `WorkFlowNotificationQueue` (PascalCase) vs `feedbackQueue` (camelCase) | `queue.ts` | Low |
| 15 | **No middleware pipeline** — no request logging, no auth, no error boundary | `index.ts` | Medium |
| 16 | **Duplicated code** — identical `removeOnComplete`/`removeOnFail` options repeated 5 times | `index.ts` | Low |
| 17 | **Config not centralized** — Redis URL, queue options, retry policies scattered | `queue.ts`, `index.ts` | Medium |

---

## Target Architecture

```
Services/
├── index.ts                              # Bootstrap only — wire app, start server
├── src/
│   ├── app.ts                            # Express app factory (middleware + routes)
│   │
│   ├── config/
│   │   ├── env.ts                        # Validated env vars (zod)
│   │   ├── plans.ts                      # Plan limits (unchanged)
│   │   ├── queue.config.ts               # Redis connection + default job options
│   │   └── email.config.ts               # SMTP transporter config
│   │
│   ├── types/
│   │   ├── feedback.types.ts             # FeedbackJobData, AnalysisResult, etc.
│   │   ├── email.types.ts                # VerificationEmailData, PaymentEmailData
│   │   ├── workflow.types.ts             # WorkflowNotificationData
│   │   └── common.types.ts              # ApiResponse, JobOptions, etc.
│   │
│   ├── schemas/
│   │   ├── feedback.schema.ts            # Zod: AddFeedbackSchema
│   │   ├── email.schema.ts              # Zod: VerificationEmailSchema, PaymentEmailSchema
│   │   └── index.ts                      # Re-exports
│   │
│   ├── lib/
│   │   ├── api-error.ts                  # AppError class (mirrors Next's ApiError)
│   │   ├── api-response.ts              # Standardized success/error response helpers
│   │   ├── logger.ts                     # Structured logger (pino or winston)
│   │   └── validate.ts                   # Zod validation middleware
│   │
│   ├── middleware/
│   │   ├── error-handler.ts              # Global Express error middleware
│   │   ├── request-logger.ts             # HTTP request logging
│   │   └── not-found.ts                  # 404 handler
│   │
│   ├── repositories/
│   │   ├── feedback.repository.ts        # Insert feedback, delete expired
│   │   ├── user.repository.ts            # Fetch user data for retention
│   │   └── workflow.repository.ts        # Query active workflows by category
│   │
│   ├── services/
│   │   ├── email.service.ts              # Compose + send emails via transporter
│   │   ├── feedback.service.ts           # Orchestrate: analyze → persist → notify
│   │   ├── llm.service.ts               # Groq API calls for sentiment analysis
│   │   ├── notification.service.ts       # Webhook dispatch (Slack, Google Chat)
│   │   └── retention.service.ts          # Data retention business logic
│   │
│   ├── controllers/
│   │   ├── email.controller.ts           # POST /emails/verification, /emails/payment
│   │   ├── feedback.controller.ts        # POST /feedbacks
│   │   └── health.controller.ts          # GET /health, GET /metrics
│   │
│   ├── routes/
│   │   ├── email.routes.ts               # Wire email controller + validation
│   │   ├── feedback.routes.ts            # Wire feedback controller + validation
│   │   ├── health.routes.ts              # Wire health/metrics endpoints
│   │   └── index.ts                      # Mount all route groups
│   │
│   ├── queues/
│   │   ├── queue.registry.ts             # Define and export all queues
│   │   ├── job-options.ts                # Shared job option presets
│   │   └── enqueue.ts                    # Type-safe enqueue helper functions
│   │
│   ├── workers/
│   │   ├── email.worker.ts               # Process email queue → email.service
│   │   ├── feedback.worker.ts            # Process feedback queue → feedback.service
│   │   ├── notification.worker.ts        # Process notification queue → notification.service
│   │   └── index.ts                      # Register all workers
│   │
│   ├── templates/
│   │   ├── verification-email.ts         # HTML template function
│   │   └── payment-email.ts              # HTML template function
│   │
│   ├── cron/
│   │   ├── retention.cron.ts             # Schedule + invoke retention.service
│   │   └── index.ts                      # Register all cron jobs
│   │
│   └── db/
│       ├── db.ts                         # Pool + drizzle instance (unchanged)
│       ├── models/                       # Schema definitions (unchanged)
│       └── drizzle/                      # Migrations (unchanged)
```

---

## Refactoring Steps (Ordered by dependency, lowest risk first)

### Phase 1: Foundation — Types, Config, Error Handling

These changes are additive (new files only) — zero risk to existing behavior.

#### Step 1.1: Create `src/types/` with strict interfaces

**File: `src/types/feedback.types.ts`**
```typescript
export interface FeedbackJobData {
  userId: number;
  stars: number;
  content: string;
  email?: string;
  name?: string;
  createdAt: string | Date;
}

export interface SentimentAnalysisResult {
  overall_sentiment: "positive" | "neutral" | "negative";
  feedback_classification: FeedbackCategory[];
}

export type FeedbackCategory =
  | "bug" | "request" | "praise" | "complaint"
  | "suggestion" | "question" | "other";
```

**File: `src/types/email.types.ts`**
```typescript
export interface VerificationEmailData {
  email: string;
  username: string;
  verifyCode: string;
  expiryDate: string | Date;
}

export interface PaymentEmailData {
  email: string;
}
```

**File: `src/types/workflow.types.ts`**
```typescript
export interface WorkflowNotificationPayload {
  webhookUrl: string;
  message: {
    userId: number;
    stars: number;
    content: string;
    sentiment: string;
    category: string[];
    createdAt: Date;
  };
}
```

**File: `src/types/common.types.ts`**
```typescript
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data?: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
```

#### Step 1.2: Create `src/config/env.ts` — validated environment

```typescript
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  GROQ_API_KEY: z.string().min(1),
  GOOGLE_MAIL_FROM: z.string().email(),
  GOOGLE_APP_PASSWORD: z.string().min(1),
});

export const env = envSchema.parse(process.env);
```

#### Step 1.3: Create `src/lib/api-error.ts` — error class

Mirror the pattern from `Next/src/lib/api-error.ts`:

```typescript
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public fieldErrors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "AppError";
  }

  static badRequest(message = "Bad request", fieldErrors?: Record<string, string[]>) {
    return new AppError(message, 400, fieldErrors);
  }

  static notFound(message = "Not found") {
    return new AppError(message, 404);
  }

  static internal(message = "Internal server error") {
    return new AppError(message, 500);
  }
}
```

#### Step 1.4: Create `src/lib/api-response.ts`

```typescript
import { Response } from "express";

export function successResponse(res: Response, message: string, data?: unknown, status = 200) {
  return res.status(status).json({ success: true, message, data });
}

export function errorResponse(res: Response, message: string, status = 500, errors?: Record<string, string[]>) {
  return res.status(status).json({ success: false, message, errors });
}
```

#### Step 1.5: Create `src/lib/logger.ts`

Replace all `console.log` / `console.error` with a structured logger:

```typescript
import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: process.env.NODE_ENV !== "production"
    ? { target: "pino-pretty" }
    : undefined,
});
```

---

### Phase 2: Validation Schemas

#### Step 2.1: Create `src/schemas/`

**File: `src/schemas/feedback.schema.ts`**
```typescript
import { z } from "zod";

export const AddFeedbackSchema = z.object({
  data: z.object({
    userId: z.number().int().positive(),
    stars: z.number().int().min(0).max(5),
    content: z.string().min(1).max(5000),
    email: z.string().email().optional(),
    name: z.string().max(50).optional(),
    createdAt: z.union([z.string(), z.date()]).optional(),
  }),
});
```

**File: `src/schemas/email.schema.ts`**
```typescript
import { z } from "zod";

export const VerificationEmailSchema = z.object({
  data: z.object({
    email: z.string().email(),
    username: z.string().min(1),
    verifyCode: z.string().min(1),
    expiryDate: z.union([z.string(), z.number()]),
  }),
});

export const PaymentEmailSchema = z.object({
  data: z.object({
    email: z.string().email(),
  }),
});
```

#### Step 2.2: Create `src/lib/validate.ts`

```typescript
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { AppError } from "./api-error";

export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const fieldErrors: Record<string, string[]> = {};
      result.error.errors.forEach((err) => {
        const path = err.path.join(".");
        fieldErrors[path] = fieldErrors[path] || [];
        fieldErrors[path].push(err.message);
      });
      throw AppError.badRequest("Validation failed", fieldErrors);
    }
    req.body = result.data;
    next();
  };
}
```

---

### Phase 3: Repository Layer

Extract all inline Drizzle queries into repositories.

#### Step 3.1: Create `src/repositories/feedback.repository.ts`

```typescript
import { db } from "../db/db";
import { feedbacksTable, InsertFeedback } from "../db/models/feedback";
import { eq, lt, and } from "drizzle-orm";

export const feedbackRepository = {
  async insert(data: InsertFeedback) {
    return db.insert(feedbacksTable).values(data);
  },

  async deleteExpiredForUser(userId: number, cutoffDate: Date) {
    const result = await db
      .delete(feedbacksTable)
      .where(
        and(
          eq(feedbacksTable.userId, userId),
          lt(feedbacksTable.createdAt, cutoffDate)
        )
      );
    return result.rowCount ?? 0;
  },
};
```

#### Step 3.2: Create `src/repositories/user.repository.ts`

```typescript
import { db } from "../db/db";
import { usersTable } from "../db/models/user";

export const userRepository = {
  async findAllWithTier() {
    return db
      .select({ id: usersTable.id, userTier: usersTable.userTier })
      .from(usersTable);
  },
};
```

#### Step 3.3: Create `src/repositories/workflow.repository.ts`

```typescript
import { db } from "../db/db";
import { userWorkFlowsTable } from "../db/models/workflows";
import { eq, and, arrayOverlaps } from "drizzle-orm";

export const workflowRepository = {
  async findActiveByUserAndCategories(userId: number, categories: string[]) {
    return db
      .select()
      .from(userWorkFlowsTable)
      .where(
        and(
          eq(userWorkFlowsTable.userId, userId),
          arrayOverlaps(userWorkFlowsTable.notifyCategories, categories),
          userWorkFlowsTable.isActive
        )
      );
  },
};
```

---

### Phase 4: Service Layer

Business logic extracted from workers and route handlers.

#### Step 4.1: Create `src/services/llm.service.ts`

Extract from `jobs/llm-functions.ts` — remove commented-out Ollama code:

```typescript
import { PromptTemplate } from "@langchain/core/prompts";
import { groq, parser } from "../config/llm.config"; // move llm-models.ts here
import { SentimentAnalysisResult } from "../types/feedback.types";
import { logger } from "../lib/logger";

const FALLBACK_RESULT: SentimentAnalysisResult = {
  overall_sentiment: "neutral",
  feedback_classification: ["other"],
};

export const llmService = {
  async analyzeSentiment(content: string): Promise<SentimentAnalysisResult> {
    const promptTemplate = PromptTemplate.fromTemplate(`
      Analyze the following review:
      Review: {review}
      Provide:
      - Overall sentiment (either positive, neutral, or negative)
      - Categories the review in all the applicable categories from the given list: bug, request, praise, complaint, suggestion, question, other.
      - Only return the requested formatted JSON.
      - No need for any explanations or other texts.
      Format response as JSON:
      {{
        "overall_sentiment": "<positive|neutral|negative>",
        "feedback_classification": ["<categories>"],
      }}
    `);

    const prompt = await promptTemplate.format({ review: content });

    try {
      const response = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.1-8b-instant",
        max_tokens: 1024,
        temperature: 0.3,
      });

      const raw = response.choices[0]?.message?.content?.trim();
      return await parser.parse(raw ?? "");
    } catch (error) {
      logger.error({ error, content }, "LLM sentiment analysis failed, using fallback");
      return FALLBACK_RESULT;
    }
  },
};
```

#### Step 4.2: Create `src/services/feedback.service.ts`

Orchestrates: LLM analysis -> DB insert -> workflow notification dispatch.

```typescript
import { feedbackRepository } from "../repositories/feedback.repository";
import { workflowRepository } from "../repositories/workflow.repository";
import { llmService } from "./llm.service";
import { notificationService } from "./notification.service";
import { FeedbackJobData } from "../types/feedback.types";
import { logger } from "../lib/logger";

export const feedbackService = {
  async processFeedback(data: FeedbackJobData) {
    const { userId, stars, content, email, name, createdAt } = data;

    const analysis = await llmService.analyzeSentiment(content);
    const { overall_sentiment: sentiment, feedback_classification: category } = analysis;

    await feedbackRepository.insert({
      userId,
      email,
      name,
      stars,
      content,
      sentiment,
      category,
      createdAt: new Date(createdAt || Date.now()),
    });

    logger.info({ userId, sentiment, category }, "Feedback persisted");

    const workflows = await workflowRepository.findActiveByUserAndCategories(userId, category);
    await notificationService.dispatchAll(workflows, {
      userId, stars, content, sentiment, category,
      createdAt: new Date(createdAt || Date.now()),
    });
  },
};
```

#### Step 4.3: Create `src/services/notification.service.ts`

```typescript
import { WorkflowNotificationPayload } from "../types/workflow.types";
import { logger } from "../lib/logger";

function formatMessage(msg: WorkflowNotificationPayload["message"]): string {
  return [
    "New Feedback Received via Feedlytics",
    "",
    `Stars: ${msg.stars}`,
    `Date: ${new Date(msg.createdAt).toLocaleString()}`,
    `Category: ${msg.category.join(", ")}`,
    `Sentiment: ${msg.sentiment}`,
    "",
    `Feedback: ${msg.content}`,
    "",
    "Powered by Feedlytics",
  ].join("\n");
}

export const notificationService = {
  async send(webhookUrl: string, message: WorkflowNotificationPayload["message"]) {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: formatMessage(message) }),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
    }
  },

  async dispatchAll(workflows: { webhookUrl: string; isActive: boolean }[], message: WorkflowNotificationPayload["message"]) {
    const active = workflows.filter((w) => w.isActive);
    const results = await Promise.allSettled(
      active.map((w) => this.send(w.webhookUrl, message))
    );

    const failed = results.filter((r) => r.status === "rejected");
    if (failed.length > 0) {
      logger.warn({ failedCount: failed.length, total: active.length }, "Some workflow notifications failed");
    }
  },
};
```

#### Step 4.4: Create `src/services/email.service.ts`

```typescript
import { transporter } from "../config/email.config";
import { verificationEmailTemplate } from "../templates/verification-email";
import { paymentEmailTemplate } from "../templates/payment-email";
import { VerificationEmailData, PaymentEmailData } from "../types/email.types";
import { logger } from "../lib/logger";

export const emailService = {
  async sendVerificationEmail(data: VerificationEmailData) {
    const { email, username, verifyCode, expiryDate } = data;
    await transporter.sendMail({
      from: process.env.GOOGLE_MAIL_FROM,
      to: email,
      subject: "FEEDLYTICS | Verify Your Email",
      html: verificationEmailTemplate({ username, verifyCode, expiryDate: new Date(expiryDate) }),
    });
    logger.info({ email }, "Verification email sent");
  },

  async sendPaymentEmail(data: PaymentEmailData) {
    await transporter.sendMail({
      from: process.env.GOOGLE_MAIL_FROM,
      to: data.email,
      subject: "FEEDLYTICS | Premium Plan Activated",
      html: paymentEmailTemplate({ email: data.email }),
    });
    logger.info({ email: data.email }, "Payment confirmation email sent");
  },
};
```

#### Step 4.5: Create `src/services/retention.service.ts`

```typescript
import { userRepository } from "../repositories/user.repository";
import { feedbackRepository } from "../repositories/feedback.repository";
import { PLAN_LIMITS, PlanTier } from "../config/plans";
import { logger } from "../lib/logger";

export const retentionService = {
  async cleanupExpiredFeedbacks() {
    const users = await userRepository.findAllWithTier();
    let totalDeleted = 0;

    for (const user of users) {
      const tier = (user.userTier || "free") as PlanTier;
      const retentionDays = PLAN_LIMITS[tier]?.dataRetentionDays ?? 90;
      if (retentionDays === Infinity) continue;

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      const deleted = await feedbackRepository.deleteExpiredForUser(user.id, cutoffDate);
      if (deleted > 0) {
        totalDeleted += deleted;
        logger.info({ userId: user.id, tier, deleted, retentionDays }, "Deleted expired feedbacks");
      }
    }

    logger.info({ totalDeleted }, "Retention cleanup complete");
    return totalDeleted;
  },
};
```

---

### Phase 5: Templates — Extract HTML

#### Step 5.1: Create `src/templates/verification-email.ts`

Move the inline HTML from `send-email.ts` into a function that accepts typed parameters and returns an HTML string. Keep the same HTML, just make it a pure function.

#### Step 5.2: Create `src/templates/payment-email.ts`

Same pattern — pure function returning HTML string.

---

### Phase 6: Queue & Worker Refactoring

#### Step 6.1: Create `src/queues/queue.registry.ts`

```typescript
import { Queue } from "bullmq";
import { redisConnection, defaultJobOptions } from "../config/queue.config";

export const emailQueue = new Queue("emailQueue", {
  connection: redisConnection,
  defaultJobOptions,
});

export const feedbackQueue = new Queue("feedbackQueue", {
  connection: redisConnection,
  defaultJobOptions,
});

export const notificationQueue = new Queue("notificationQueue", {
  connection: redisConnection,
  defaultJobOptions,
});
```

#### Step 6.2: Create `src/queues/enqueue.ts`

Type-safe enqueue functions that controllers call:

```typescript
import { emailQueue, feedbackQueue, notificationQueue } from "./queue.registry";
import { FeedbackJobData } from "../types/feedback.types";
import { VerificationEmailData, PaymentEmailData } from "../types/email.types";

const SHORT_LIVED_JOB = { removeOnComplete: { age: 5, count: 0 }, removeOnFail: { age: 5 } };

export async function enqueueFeedback(data: FeedbackJobData) {
  return feedbackQueue.add("processFeedback", data, SHORT_LIVED_JOB);
}

export async function enqueueVerificationEmail(data: VerificationEmailData) {
  return emailQueue.add("sendVerificationEmail", data, SHORT_LIVED_JOB);
}

export async function enqueuePaymentEmail(data: PaymentEmailData) {
  return emailQueue.add("sendPaymentEmail", data, SHORT_LIVED_JOB);
}
```

#### Step 6.3: Refactor workers to be thin — delegate to services

**`src/workers/feedback.worker.ts`** — calls `feedbackService.processFeedback(job.data)`
**`src/workers/email.worker.ts`** — calls `emailService.sendVerificationEmail` / `sendPaymentEmail`
**`src/workers/notification.worker.ts`** — calls `notificationService.send`

Workers should only:
1. Extract `job.data`
2. Call the appropriate service
3. Log completion/failure

---

### Phase 7: Controller + Routes + Middleware

#### Step 7.1: Create `src/middleware/error-handler.ts`

```typescript
import { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/api-error";
import { logger } from "../lib/logger";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.fieldErrors,
    });
  }

  logger.error({ error: err }, "Unhandled error");
  return res.status(500).json({ success: false, message: "Internal server error" });
}
```

#### Step 7.2: Create `src/middleware/request-logger.ts`

```typescript
import { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  res.on("finish", () => {
    logger.info({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: Date.now() - start,
    }, "HTTP request");
  });
  next();
}
```

#### Step 7.3: Create controllers

**`src/controllers/feedback.controller.ts`**
```typescript
import { Request, Response } from "express";
import { enqueueFeedback } from "../queues/enqueue";
import { successResponse } from "../lib/api-response";

export const feedbackController = {
  async addFeedback(req: Request, res: Response) {
    await enqueueFeedback(req.body.data);
    return successResponse(res, "Feedback queued successfully");
  },
};
```

**`src/controllers/email.controller.ts`**
```typescript
import { Request, Response } from "express";
import { enqueueVerificationEmail, enqueuePaymentEmail } from "../queues/enqueue";
import { successResponse } from "../lib/api-response";

export const emailController = {
  async sendVerification(req: Request, res: Response) {
    await enqueueVerificationEmail(req.body.data);
    return successResponse(res, "Verification email queued");
  },

  async sendPaymentConfirmation(req: Request, res: Response) {
    await enqueuePaymentEmail(req.body.data);
    return successResponse(res, "Payment email queued");
  },
};
```

**`src/controllers/health.controller.ts`**
```typescript
import { Request, Response } from "express";
import client from "prom-client";

export const healthController = {
  health(_req: Request, res: Response) {
    res.json({ status: "ok", uptime: process.uptime() });
  },

  async metrics(_req: Request, res: Response) {
    res.setHeader("Content-Type", client.register.contentType);
    res.send(await client.register.metrics());
  },
};
```

#### Step 7.4: Create routes

**`src/routes/feedback.routes.ts`**
```typescript
import { Router } from "express";
import { feedbackController } from "../controllers/feedback.controller";
import { validateBody } from "../lib/validate";
import { AddFeedbackSchema } from "../schemas/feedback.schema";

const router = Router();
router.post("/feedbacks", validateBody(AddFeedbackSchema), feedbackController.addFeedback);
export default router;
```

**`src/routes/email.routes.ts`**
```typescript
import { Router } from "express";
import { emailController } from "../controllers/email.controller";
import { validateBody } from "../lib/validate";
import { VerificationEmailSchema, PaymentEmailSchema } from "../schemas/email.schema";

const router = Router();
router.post("/emails/verification", validateBody(VerificationEmailSchema), emailController.sendVerification);
router.post("/emails/payment", validateBody(PaymentEmailSchema), emailController.sendPaymentConfirmation);
export default router;
```

**`src/routes/index.ts`**
```typescript
import { Router } from "express";
import emailRoutes from "./email.routes";
import feedbackRoutes from "./feedback.routes";
import healthRoutes from "./health.routes";

const router = Router();
router.use(emailRoutes);
router.use(feedbackRoutes);
router.use(healthRoutes);
export default router;
```

#### Step 7.5: Create `src/app.ts` — Express app factory

```typescript
import express from "express";
import client from "prom-client";
import routes from "./routes";
import { requestLogger } from "./middleware/request-logger";
import { errorHandler } from "./middleware/error-handler";
import { notFoundHandler } from "./middleware/not-found";

export function createApp() {
  const app = express();

  client.collectDefaultMetrics({ register: client.register });

  app.use(express.json());
  app.use(requestLogger);

  app.use(routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
```

#### Step 7.6: Slim down `index.ts` to bootstrap only

```typescript
import "dotenv/config";
import { createApp } from "./src/app";
import { env } from "./src/config/env";
import { logger } from "./src/lib/logger";
import "./src/workers";
import { startCronJobs } from "./src/cron";

const app = createApp();

app.listen(env.PORT, () => {
  logger.info({ port: env.PORT }, "Services server started");
});

startCronJobs();
```

---

### Phase 8: Cleanup & Migration

#### Step 8.1: Update Next.js `message.service.ts` API call

The endpoint path changes. Update the fetch URL:
- `/add-feedback` -> `/feedbacks`
- `/get-verification-email` -> `/emails/verification`
- `/get-payment-email` -> `/emails/payment`

**Option A (recommended):** Support both old and new routes temporarily using route aliases during migration.
**Option B:** Update all callers at once (Next.js service files).

#### Step 8.2: Remove dead code

- Delete commented-out Ollama code from `llm-functions.ts` and `llm-models.ts`
- Delete `/health-email` and `/health-feedback` test endpoints (replace with proper integration tests if needed)
- Remove unused `ApiResponse` interface from old `send-email.ts`

#### Step 8.3: Fix naming consistency

- `WorkFlowNotificationQueue` -> `notificationQueue`
- `userWorkFlowsTable` reference stays (DB schema name), but code references use `workflowRepository`
- File names: all lowercase with dots (`email.worker.ts`, not `emailWorker.ts`)

---

## Route Mapping (Old -> New)

| Old Route | New Route | Method |
|-----------|-----------|--------|
| `/add-feedback` | `/feedbacks` | POST |
| `/get-verification-email` | `/emails/verification` | POST |
| `/get-payment-email` | `/emails/payment` | POST |
| `/health` | `/health` | GET |
| `/metrics` | `/metrics` | GET |
| `/health-email` | **REMOVED** (test only) | — |
| `/health-feedback` | **REMOVED** (test only) | — |

---

## Dependency Changes

### Add
```json
{
  "pino": "^9.x",
  "pino-pretty": "^11.x" // devDependency
}
```

### Already present (no changes needed)
- `zod` (already used via `langchain`)
- `express`, `bullmq`, `drizzle-orm`, `groq-sdk`, `prom-client`, `node-cron`, `nodemailer`

---

## Execution Order & Risk Assessment

| Phase | Description | Risk | Estimated Effort |
|-------|-------------|------|-----------------|
| 1 | Types, Config, Error Handling, Logger | None (additive) | 1-2 hours |
| 2 | Validation Schemas | None (additive) | 30 min |
| 3 | Repository Layer | None (additive) | 1 hour |
| 4 | Service Layer | None (additive) | 2-3 hours |
| 5 | Email Templates | None (additive) | 30 min |
| 6 | Queue & Worker Refactor | Medium (behavioral) | 2 hours |
| 7 | Controller + Routes + Middleware | Medium (entry point change) | 2-3 hours |
| 8 | Cleanup & Migration | Medium (caller updates) | 1-2 hours |

**Total estimated effort: 10-14 hours**

---

## Verification Checklist

After each phase, verify:

- [ ] `npm run build` — TypeScript compiles without errors
- [ ] Existing tests (if any) still pass
- [ ] Server starts without errors
- [ ] `/health` endpoint responds
- [ ] `/metrics` endpoint returns Prometheus data
- [ ] Send a test feedback via widget — appears in dashboard with correct sentiment
- [ ] Verification email sends on new user signup
- [ ] Payment email sends on Stripe webhook
- [ ] Workflow notifications fire to Slack/Google Chat
- [ ] Data retention cron runs without errors (check logs at 03:00 UTC or trigger manually)

---

## Architecture Principles Applied

| Principle | How It's Applied |
|-----------|-----------------|
| **Single Responsibility** | Each file has one reason to change — repositories handle queries, services handle logic, controllers handle HTTP |
| **Dependency Inversion** | Controllers depend on services (abstractions), not on queue/DB internals |
| **Open/Closed** | Add new email types by creating a new template + schema + enqueue function — no existing code changes |
| **DRY** | Job options, response formatting, validation all centralized — not copy-pasted per route |
| **Separation of Concerns** | HTTP layer (controller) never touches DB; worker layer never builds HTTP responses |
| **Type Safety** | End-to-end typed from request validation (Zod) -> service -> repository -> DB (Drizzle inferred types) |
| **Fail-Safe Defaults** | Validated env vars crash on startup if missing; LLM falls back to neutral sentiment on failure |
| **Observability** | Structured logs (pino) + Prometheus metrics on every request |

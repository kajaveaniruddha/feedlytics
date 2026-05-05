import { logger } from "../lib/logger";

export type AnalysisCallbackPayloadItem = {
  feedbackId: number;
  sentiment: string;
  overallConfidence: number;
  categories: { categoryName: string; confidence: number | null }[];
  callbackBaseUrl: string;
  internalAuthToken: string;
};

const BATCH_MS = Number(process.env.AI_CALLBACK_BATCH_MS ?? 5000);
const MAX_BATCH_SIZE = Number(process.env.AI_CALLBACK_MAX_BATCH ?? 50);

const buffer: AnalysisCallbackPayloadItem[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let flushing = false;

function normalizeBase(url: string): string {
  return url.trim().replace(/\/$/, "");
}

async function postBatch(items: AnalysisCallbackPayloadItem[]): Promise<void> {
  if (items.length === 0) return;
  const base = normalizeBase(items[0]!.callbackBaseUrl);
  const token = items[0]!.internalAuthToken;
  const body = {
    items: items.map((i) => ({
      feedbackId: i.feedbackId,
      sentiment: i.sentiment,
      overallConfidence: i.overallConfidence,
      categories: i.categories.map((c) => ({
        categoryName: c.categoryName,
        confidence: c.confidence,
      })),
    })),
  };

  const res = await fetch(`${base}/api/v1/internal/feedback/batch-ai-analysis`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Internal-Auth": token,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Batch AI callback failed: ${res.status} ${text}`);
  }
}

async function flushNow(): Promise<void> {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  if (buffer.length === 0 || flushing) return;
  flushing = true;
  const batch = buffer.splice(0, buffer.length);
  try {
    await postBatch(batch);
    logger.info({ count: batch.length }, "Flushed AI analysis batch to feedlytics-service");
  } catch (err) {
    logger.error({ err: String(err), count: batch.length }, "AI analysis batch callback failed");
    buffer.unshift(...batch);
  } finally {
    flushing = false;
  }
}

export function enqueueAnalysisCallbackItem(item: AnalysisCallbackPayloadItem): void {
  buffer.push(item);

  if (buffer.length >= MAX_BATCH_SIZE) {
    void flushNow();
    return;
  }

  if (!flushTimer) {
    flushTimer = setTimeout(() => {
      flushTimer = null;
      void flushNow();
    }, BATCH_MS);
  }
}

export async function flushAnalysisCallbacksOnShutdown(): Promise<void> {
  await flushNow();
}

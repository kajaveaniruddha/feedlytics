/**
 * `withRetry` — decorator that wraps a promise-returning function so transient
 * failures (network / 5xx) retry a bounded number of times with exponential
 * backoff. Client errors (4xx) are not retried — they are user mistakes.
 */
import { ApiError } from "@/services/api/errors/ApiError";

type AsyncFn<TArgs extends unknown[], TReturn> = (...args: TArgs) => Promise<TReturn>;

export type RetryOptions = {
  attempts?: number;
  baseDelayMs?: number;
  shouldRetry?: (error: unknown, attempt: number) => boolean;
};

export function withRetry<TArgs extends unknown[], TReturn>(
  fn: AsyncFn<TArgs, TReturn>,
  { attempts = 2, baseDelayMs = 200, shouldRetry = defaultShouldRetry }: RetryOptions = {},
): AsyncFn<TArgs, TReturn> {
  return async (...args: TArgs): Promise<TReturn> => {
    let lastError: unknown;
    for (let attempt = 0; attempt <= attempts; attempt++) {
      try {
        return await fn(...args);
      } catch (err) {
        lastError = err;
        if (attempt === attempts || !shouldRetry(err, attempt)) {
          throw err;
        }
        await sleep(baseDelayMs * 2 ** attempt);
      }
    }
    throw lastError;
  };
}

function defaultShouldRetry(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status === 0 || error.status >= 500;
  }
  return false;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

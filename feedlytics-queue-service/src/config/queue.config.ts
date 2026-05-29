import { env } from "./env";

export const redisConnection = {
  url: env.REDIS_URL,
};

export const defaultJobOptions = {
  attempts: 3,
  backoff: {
    type: "exponential" as const,
    delay: 1000,
  },
};

export const shortLivedJobOptions = {
  removeOnComplete: { age: 5, count: 0 },
  removeOnFail: { age: 5 },
};

import { RateLimiterRedis, RateLimiterMemory } from "rate-limiter-flexible";
import Redis from "ioredis";
import { NextRequest, NextResponse } from "next/server";

const limiters = new Map<string, RateLimiterRedis | RateLimiterMemory>();
let redisClient: Redis | null = null;

function getRedisClient(): Redis | null {
  if (redisClient) return redisClient;
  const url = process.env.REDIS_URL;
  if (!url) return null;
  redisClient = new Redis(url, { maxRetriesPerRequest: 1 });
  return redisClient;
}

function getLimiter(ipLimit: number, ipWindow: number) {
  const key = `${ipLimit}:${ipWindow}`;
  const cached = limiters.get(key);
  if (cached) return cached;

  const client = getRedisClient();
  let limiter: RateLimiterRedis | RateLimiterMemory;

  if (client) {
    limiter = new RateLimiterRedis({
      storeClient: client,
      keyPrefix: `rl_${key}`,
      points: ipLimit,
      duration: ipWindow,
    });
  } else {
    console.warn("REDIS_URL not set — falling back to in-memory rate limiter");
    limiter = new RateLimiterMemory({
      keyPrefix: `rl_${key}`,
      points: ipLimit,
      duration: ipWindow,
    });
  }

  limiters.set(key, limiter);
  return limiter;
}

export async function rateLimit({
  request,
  ipLimit = 120,
  ipWindow = 10,
}: {
  request: NextRequest;
  response: NextResponse;
  sessionLimit?: number;
  ipLimit?: number;
  sessionWindow?: number;
  ipWindow?: number;
}) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  const limiter = getLimiter(ipLimit, ipWindow);

  try {
    await limiter.consume(ip);
  } catch {
    return new NextResponse(
      JSON.stringify({ error: "Too Many Requests" }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(ipWindow),
        },
      }
    );
  }

  return undefined;
}

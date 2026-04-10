import { RateLimiterMemory } from "rate-limiter-flexible";
import { NextRequest, NextResponse } from "next/server";

const limiters = new Map<string, RateLimiterMemory>();

function getLimiter(ipLimit: number, ipWindow: number) {
  const key = `${ipLimit}:${ipWindow}`;
  const cached = limiters.get(key);
  if (cached) return cached;

  const limiter = new RateLimiterMemory({
    keyPrefix: `rl_${key}`,
    points: ipLimit,
    duration: ipWindow,
  });

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
  const path = request.nextUrl.pathname;

  try {
    await limiter.consume(ip);
  } catch {
    console.warn(`[Rate Limit] 429 blocked — IP: ${ip} | Path: ${path}`);

    const baseUrl = request.nextUrl.origin;
    fetch(`${baseUrl}/api/rate-limit-inc`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    }).catch(() => {});

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

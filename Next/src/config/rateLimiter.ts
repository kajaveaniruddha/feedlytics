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

function getClientIp(request: NextRequest): string {
  // CF-Connecting-IP is set by Cloudflare and is the most reliable
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  // x-forwarded-for: first entry is the original client IP
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first && first !== "127.0.0.1" && first !== "::1") return first;
  }

  // x-real-ip set by nginx/reverse proxies
  const realIp = request.headers.get("x-real-ip");
  if (realIp && realIp !== "127.0.0.1" && realIp !== "::1") return realIp.trim();

  // Next.js sometimes exposes the IP via the request object
  const nextIp = (request as any).ip;
  if (nextIp) return nextIp;

  return "unknown";
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
  const ip = getClientIp(request);

  // If we can't identify the client, skip rate limiting rather than
  // blocking all traffic under a shared "unknown" bucket
  if (ip === "unknown") return undefined;

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
      JSON.stringify({ success: false, message: "Too many requests. Please try again later." }),
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

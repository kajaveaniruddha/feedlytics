import { rateLimit as nextRateLimit } from "@daveyplate/next-rate-limit";
import { NextRequest, NextResponse } from "next/server";

export async function rateLimit({
  request,
  response,
  sessionLimit = 30,
  ipLimit = 120,
  sessionWindow = 10,
  ipWindow = 10,
  upstash = {
    enabled: !!(process.env.UPSTASH_REDIS_URL || process.env.REDIS_URL),
    url: process.env.UPSTASH_REDIS_URL || process.env.REDIS_URL,
    token: process.env.UPSTASH_REDIS_TOKEN || "",
    analytics: false,
  },
}: {
  request: NextRequest;
  response: NextResponse;
  sessionLimit?: number;
  ipLimit?: number;
  sessionWindow?: number;
  ipWindow?: number;
  upstash?: {
    enabled: boolean;
    url?: string;
    token?: string;
    analytics?: boolean;
  };
}) {
  const result = await nextRateLimit({
    request,
    response,
    sessionLimit,
    ipLimit,
    sessionWindow,
    ipWindow,
    upstash,
  });

  if (result?.status === 429) {
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

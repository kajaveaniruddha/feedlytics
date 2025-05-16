import { rateLimit as nextRateLimit } from "@daveyplate/next-rate-limit";
import { NextRequest, NextResponse } from "next/server";

export async function rateLimit({
  request,
  response,
  sessionLimit = 30, //Maximum number of requests allowed per session within the sessionWindow (default: 30 requests per 10 seconds).
  ipLimit = 120,
  sessionWindow = 10, //Time window in seconds for session-based rate limiting.
  ipWindow = 10,
  upstash = {
    enabled: false,
    url: process.env.REDIS_URL,
    token: "",
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
    return new NextResponse("Too Many Requests", { status: 429 });
  }
  // Allow request to continue
  return undefined;
}

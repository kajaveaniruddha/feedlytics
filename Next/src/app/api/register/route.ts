import { createHandler } from "@/lib/route-handler";
import { successResponse } from "@/lib/api-response";
import { userRepository } from "@/repositories/user.repository";
import { ApiError } from "@/lib/api-error";
import { PLAN_LIMITS } from "@/config/plans";
import { rateLimit } from "@/config/rateLimiter";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { withMetrics } from "@/lib/metrics";

const handlePOST = createHandler(async (request: Request) => {
  const rateLimitResult = await rateLimit({
    request: request as NextRequest,
    response: new NextResponse(),
    ipLimit: 3,
    ipWindow: 10,
  });
  if (rateLimitResult) return rateLimitResult;

  const { name, username, email, password } = await request.json();

  const existingVerified = await userRepository.findVerifiedByUsername(username);
  if (existingVerified) {
    throw ApiError.badRequest("Username already taken.");
  }

  const existingByEmail = await userRepository.findByEmail(email);
  const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiryDate = new Date(Date.now() + 3600000);
  const hashedPassword = await bcrypt.hash(password, 10);

  if (existingByEmail) {
    if (existingByEmail.isVerified) {
      throw ApiError.forbidden("User already exists with this email.");
    }
    await userRepository.updateByEmail(email, {
      password: hashedPassword,
      verifyCode,
      verifyCodeExpiry: expiryDate,
    });
  } else {
    await userRepository.createIfNotExists({
      name,
      username,
      email,
      password: hashedPassword,
      verifyCode,
      verifyCodeExpiry: expiryDate,
      isVerified: false,
      messageCount: 0,
      maxMessages: PLAN_LIMITS.free.maxFeedbacksPerMonth,
      maxWorkflows: PLAN_LIMITS.free.maxWorkflows,
      billingPeriodStart: new Date(),
      billingPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
  }

  const queueResponse = await fetch(
    `${process.env.SERVICES_URL}/get-verification-email`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: { email, username, verifyCode, expiryDate },
      }),
    }
  );

  if (!queueResponse.ok) {
    throw ApiError.internal("Failed to add job to the queue.");
  }

  return successResponse(
    { message: "User registered successfully." },
    201
  );
});

export const POST = withMetrics(handlePOST, "/api/register");

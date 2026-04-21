import { createHandler } from "@/lib/route-handler";
import { successResponse } from "@/lib/api-response";
import { authService } from "@/services/auth.service";
import { userRepository } from "@/repositories/user.repository";
import { workflowRepository } from "@/repositories/workflow.repository";
import { feedbackRepository } from "@/repositories/feedback.repository";
import { ApiError } from "@/lib/api-error";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { usersTable } from "@/db/models/user";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { withMetrics } from "@/lib/metrics";

const handleGET = createHandler(async () => {
  const user = await authService.requireAuth();
  const userId = authService.parseUserId(user);

  const [[billing], workflowCount] = await Promise.all([
    db
      .select({
        userTier: usersTable.userTier,
        messageCount: usersTable.messageCount,
        maxMessages: usersTable.maxMessages,
        maxWorkflows: usersTable.maxWorkflows,
        billingPeriodStart: usersTable.billingPeriodStart,
        billingPeriodEnd: usersTable.billingPeriodEnd,
        stripeCustomerId: usersTable.stripeCustomerId,
        stripeSubscriptionId: usersTable.stripeSubscriptionId,
      })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1),
    workflowRepository.countByUserId(userId),
  ]);

  if (!billing) {
    throw ApiError.notFound("User not found.");
  }

  let periodFeedbackCount = 0;
  if (billing.billingPeriodStart) {
    periodFeedbackCount = await feedbackRepository.countByUserIdSince(
      userId,
      billing.billingPeriodStart
    );
  }

  return successResponse({
    ...billing,
    workflowCount,
    periodFeedbackCount,
  });
});

const handlePOST = createHandler(async () => {
  const user = await authService.requireAuth();
  const userId = authService.parseUserId(user);

  const dbUser = await userRepository.findById(userId);
  if (!dbUser?.stripeCustomerId) {
    throw ApiError.badRequest("No billing account found.");
  }

  const headersList = await headers();
  const origin = headersList.get("origin");

  const session = await stripe.billingPortal.sessions.create({
    customer: dbUser.stripeCustomerId,
    return_url: `${origin}/settings`,
  });

  return successResponse({ url: session.url });
});

export const GET = withMetrics(handleGET, "/api/billing");
export const POST = withMetrics(handlePOST, "/api/billing");

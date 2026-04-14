import { withMetrics } from "@/lib/metrics";
import { createHandler } from "@/lib/route-handler";
import { successResponse } from "@/lib/api-response";
import { authService } from "@/services/auth.service";
import { userRepository } from "@/repositories/user.repository";
import { workflowRepository } from "@/repositories/workflow.repository";
import { feedbackRepository } from "@/repositories/feedback.repository";
import { usersTable } from "@/db/models/user";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { ApiError } from "@/lib/api-error";

const handleGET = createHandler(async () => {
  const user = await authService.requireAuth();
  const userId = authService.parseUserId(user);

  const billing = await userRepository.selectFieldsById(userId, {
    userTier: usersTable.userTier,
    messageCount: usersTable.messageCount,
    maxMessages: usersTable.maxMessages,
    maxWorkflows: usersTable.maxWorkflows,
    billingPeriodStart: usersTable.billingPeriodStart,
    billingPeriodEnd: usersTable.billingPeriodEnd,
    stripeCustomerId: usersTable.stripeCustomerId,
    stripeSubscriptionId: usersTable.stripeSubscriptionId,
  });

  if (!billing) {
    throw ApiError.notFound("User not found.");
  }

  const workflowCount = await workflowRepository.countByUserId(userId);

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

  const dbUser = await userRepository.selectFieldsById(userId, {
    stripeCustomerId: usersTable.stripeCustomerId,
  });

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

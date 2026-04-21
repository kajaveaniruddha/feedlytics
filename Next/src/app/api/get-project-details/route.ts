import { createHandler } from "@/lib/route-handler";
import { successResponse } from "@/lib/api-response";
import { authService } from "@/services/auth.service";
import { userRepository } from "@/repositories/user.repository";
import { ApiError } from "@/lib/api-error";
import { usersTable } from "@/db/models/user";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { withMetrics } from "@/lib/metrics";

const handleGET = createHandler(async () => {
  const user = await authService.requireAuth();
  const userId = authService.parseUserId(user);

  const [userDetails] = await db
    .select({
      name: usersTable.name,
      userTier: usersTable.userTier,
      avatar_url: usersTable.avatarUrl,
      messageCount: usersTable.messageCount,
      maxMessages: usersTable.maxMessages,
      maxWorkflows: usersTable.maxWorkflows,
      textColor: usersTable.textColor,
      bgColor: usersTable.bgColor,
      collectName: usersTable.collectName,
      collectEmail: usersTable.collectEmail,
      billingPeriodStart: usersTable.billingPeriodStart,
      billingPeriodEnd: usersTable.billingPeriodEnd,
    })
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);

  if (!userDetails) {
    throw ApiError.notFound("User not found.");
  }

  const {
    name,
    userTier,
    avatar_url,
    messageCount,
    maxMessages,
    maxWorkflows,
    bgColor,
    collectEmail,
    collectName,
    textColor,
    billingPeriodStart,
    billingPeriodEnd,
  } = userDetails;

  return successResponse({
    messageCount,
    maxMessages,
    maxWorkflows,
    billingPeriodStart,
    billingPeriodEnd,
    userDetails: {
      name,
      userTier,
      avatar_url,
      bgColor,
      collectEmail,
      collectName,
      textColor,
    },
  });
});

export const GET = withMetrics(handleGET, "/api/get-project-details");

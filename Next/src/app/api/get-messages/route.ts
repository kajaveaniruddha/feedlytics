import { withMetrics } from "@/lib/metrics";
import { createHandler } from "@/lib/route-handler";
import { successResponse } from "@/lib/api-response";
import { authService } from "@/services/auth.service";
import { feedbackRepository } from "@/repositories/feedback.repository";

const handleGET = createHandler(async () => {
  const user = await authService.requireAuth();
  const userId = authService.parseUserId(user);

  const messages = await feedbackRepository.findByUserId(userId, {
    limit: 10000,
    offset: 0,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  return successResponse({ messages });
});

export const GET = withMetrics(handleGET, "/api/get-messages");

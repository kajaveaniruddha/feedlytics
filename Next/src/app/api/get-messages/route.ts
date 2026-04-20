import { createHandler } from "@/lib/route-handler";
import { successResponse } from "@/lib/api-response";
import { authService } from "@/services/auth.service";
import { feedbackRepository } from "@/repositories/feedback.repository";
import { withMetrics } from "@/lib/metrics";

const handleGET = createHandler(async () => {
  const user = await authService.requireAuth();
  const userId = authService.parseUserId(user);

  const [messages, messagesFound] = await Promise.all([
    feedbackRepository.findByUserId(userId),
    feedbackRepository.countByUserId(userId),
  ]);

  return successResponse({ messages, messagesFound });
});

export const GET = withMetrics(handleGET, "/api/get-messages");

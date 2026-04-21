import { createHandler } from "@/lib/route-handler";
import { successResponse } from "@/lib/api-response";
import { authService } from "@/services/auth.service";
import { analyticsService } from "@/services/analytics.service";
import { withMetrics } from "@/lib/metrics";

const handleGET = createHandler(async () => {
  const user = await authService.requireAuth();
  const userId = authService.parseUserId(user);

  const counts = await analyticsService.getSentimentCounts(userId);

  return successResponse({ counts });
});

export const GET = withMetrics(handleGET, "/api/get-categories");

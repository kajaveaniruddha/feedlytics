import { withMetrics } from "@/lib/metrics";
import { createHandler } from "@/lib/route-handler";
import { successResponse } from "@/lib/api-response";
import { authService } from "@/services/auth.service";
import { analyticsService } from "@/services/analytics.service";

const handler = createHandler(async () => {
  const user = await authService.requireAuth();
  const userId = authService.parseUserId(user);

  const analytics = await analyticsService.getAnalytics(userId);

  return successResponse(analytics);
});

export const GET = withMetrics(handler, "/api/get-analytics");

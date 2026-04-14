import { withMetrics } from "@/lib/metrics";
import { createHandler } from "@/lib/route-handler";
import { validateQuery } from "@/lib/validate";
import { paginationSchema, type PaginationParams } from "@/schemas/paginationSchema";
import { successResponse } from "@/lib/api-response";
import { authService } from "@/services/auth.service";
import { feedbackRepository } from "@/repositories/feedback.repository";

const handleGET = createHandler(async (request: Request) => {
  const user = await authService.requireAuth();
  const userId = authService.parseUserId(user);

  const url = new URL(request.url);
  const params = validateQuery<PaginationParams>(url, paginationSchema);

  const { page, limit, sortBy, sortOrder, content, stars, sentiment, category } = params;
  const offset = (page - 1) * limit;
  const filters = { content, stars, sentiment, category };

  const [messages, totalCount] = await Promise.all([
    feedbackRepository.findByUserId(userId, { limit, offset, sortBy, sortOrder, ...filters }),
    feedbackRepository.countByUserId(userId, filters),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return successResponse({
    messages,
    totalPages,
    totalCount,
    currentPage: page,
  });
});

export const GET = withMetrics(handleGET, "/api/get-messages");

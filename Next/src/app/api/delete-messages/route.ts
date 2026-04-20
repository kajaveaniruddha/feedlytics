import { createHandler } from "@/lib/route-handler";
import { successResponse } from "@/lib/api-response";
import { validateBody } from "@/lib/validate";
import { deleteMessagesSchema } from "@/schemas/deleteMessagesSchema";
import { authService } from "@/services/auth.service";
import { feedbackRepository } from "@/repositories/feedback.repository";
import { userRepository } from "@/repositories/user.repository";
import { ApiError } from "@/lib/api-error";
import { withMetrics } from "@/lib/metrics";

const handleDELETE = createHandler(async (request: Request) => {
  const user = await authService.requireAuth();
  const userId = authService.parseUserId(user);

  const { messageIds } = await validateBody(request, deleteMessagesSchema);
  const objectIds = messageIds.map((id) => parseInt(id, 10));

  const deletedCount = await feedbackRepository.deleteByIdsForUser(objectIds, userId);

  if (deletedCount === 0) {
    throw ApiError.notFound("Messages not found.");
  }

  await userRepository.decrementMessageCount(userId, deletedCount);

  return successResponse({ message: "Messages deleted successfully." });
});

export const DELETE = withMetrics(handleDELETE, "/api/delete-messages");

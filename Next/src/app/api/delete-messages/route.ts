import { withMetrics } from "@/lib/metrics";
import { createHandler } from "@/lib/route-handler";
import { validateBody } from "@/lib/validate";
import { deleteMessagesSchema } from "@/schemas/deleteMessagesSchema";
import { successResponse } from "@/lib/api-response";
import { authService } from "@/services/auth.service";
import { feedbackRepository } from "@/repositories/feedback.repository";
import { userRepository } from "@/repositories/user.repository";
import { ApiError } from "@/lib/api-error";

const handleDELETE = createHandler(async (request: Request) => {
  const user = await authService.requireAuth();
  const userId = authService.parseUserId(user);

  const { messageIds } = await validateBody(request, deleteMessagesSchema);
  const objectIds = messageIds.map((id) => parseInt(id, 10));

  // SECURITY FIX: deleteByIdsForUser adds userId filter
  const deleteResult = await feedbackRepository.deleteByIdsForUser(objectIds, userId);

  if (deleteResult.rowCount === 0) {
    throw ApiError.notFound("Messages not found.");
  }

  await userRepository.decrementMessageCount(userId, objectIds.length);

  return successResponse({ message: "Messages deleted successfully." });
});

export const DELETE = withMetrics(handleDELETE, "/api/delete-messages");

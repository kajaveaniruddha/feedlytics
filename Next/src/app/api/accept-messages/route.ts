import { createHandler } from "@/lib/route-handler";
import { successResponse } from "@/lib/api-response";
import { authService } from "@/services/auth.service";
import { userRepository } from "@/repositories/user.repository";
import { ApiError } from "@/lib/api-error";
import { withMetrics } from "@/lib/metrics";

const handleGET = createHandler(async () => {
  const user = await authService.requireAuth();
  const userId = authService.parseUserId(user);

  const dbUser = await userRepository.findById(userId);
  if (!dbUser) {
    throw ApiError.notFound("User not found.");
  }

  return successResponse({ isAcceptingMessages: dbUser.isAcceptingMessage });
});

const handlePUT = createHandler(async (request: Request) => {
  const user = await authService.requireAuth();
  const userId = authService.parseUserId(user);

  const { acceptMessages } = await request.json();

  const rowCount = await userRepository.updateById(userId, {
    isAcceptingMessage: acceptMessages,
  });

  if (!rowCount) {
    throw ApiError.internal("Failed to update user message acceptance status.");
  }

  return successResponse({
    message: "Message acceptance status updated successfully.",
  });
});

export const GET = withMetrics(handleGET, "/api/accept-messages");
export const PUT = withMetrics(handlePUT, "/api/accept-messages");

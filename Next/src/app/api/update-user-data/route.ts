import { withMetrics } from "@/lib/metrics";
import { createHandler } from "@/lib/route-handler";
import { validateBody } from "@/lib/validate";
import { updateUserData } from "@/schemas/updateUserData";
import { successResponse } from "@/lib/api-response";
import { authService } from "@/services/auth.service";
import { userRepository } from "@/repositories/user.repository";
import { ApiError } from "@/lib/api-error";

const handlePUT = createHandler(async (request: Request) => {
  const user = await authService.requireAuth();
  const userId = authService.parseUserId(user);

  const data = await validateBody(request, updateUserData);

  const updateResult = await userRepository.updateById(userId, {
    introduction: data.introduction,
    questions: data.questions,
    username: data.username,
    name: data.name,
    avatarUrl: data.avatar_url,
    bgColor: data.bg_color,
    textColor: data.text_color,
    collectName: data.collect_info?.name,
    collectEmail: data.collect_info?.email,
  });

  if (!updateResult.rowCount) {
    throw ApiError.internal("Failed to update.");
  }

  return successResponse({ message: "Details updated successfully." });
});

export const PUT = withMetrics(handlePUT, "/api/update-user-data");

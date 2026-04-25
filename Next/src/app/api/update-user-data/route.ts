import { createHandler } from "@/lib/route-handler";
import { successResponse } from "@/lib/api-response";
import { authService } from "@/services/auth.service";
import { userRepository } from "@/repositories/user.repository";
import { ApiError } from "@/lib/api-error";
import { withMetrics } from "@/lib/metrics";

const handlePUT = createHandler(async (request: Request) => {
  const user = await authService.requireAuth();
  const userId = authService.parseUserId(user);

  const {
    introduction,
    questions,
    username,
    name,
    avatar_url,
    bg_color,
    text_color,
    collect_info,
    form_theme,
  } = await request.json();

  const updateData: Record<string, unknown> = {
    introduction,
    questions,
    username,
    name,
    avatarUrl: avatar_url,
    bgColor: bg_color,
    textColor: text_color,
    collectName: collect_info?.name,
    collectEmail: collect_info?.email,
  };

  if (form_theme) {
    const existingUser = await userRepository.findById(userId);
    const existingTheme = (existingUser?.formTheme as Record<string, unknown>) || {};
    updateData.formTheme = { ...existingTheme, ...form_theme };
  }

  const rowCount = await userRepository.updateById(userId, updateData);

  if (!rowCount) {
    throw ApiError.internal("Failed to update.");
  }

  return successResponse({ message: "Details updated successfully." });
});

export const PUT = withMetrics(handlePUT, "/api/update-user-data");

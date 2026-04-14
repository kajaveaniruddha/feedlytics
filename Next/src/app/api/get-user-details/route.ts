import { withMetrics } from "@/lib/metrics";
import { createHandler } from "@/lib/route-handler";
import { successResponse } from "@/lib/api-response";
import { authService } from "@/services/auth.service";
import { userRepository } from "@/repositories/user.repository";
import { usersTable } from "@/db/models/user";
import { ApiError } from "@/lib/api-error";

const handleGET = createHandler(async () => {
  const user = await authService.requireAuth();

  const userDetails = await userRepository.selectFieldsByEmail(user.email!, {
    name: usersTable.name,
    username: usersTable.username,
    avatar_url: usersTable.avatarUrl,
    introduction: usersTable.introduction,
    questions: usersTable.questions,
    textColor: usersTable.textColor,
    bgColor: usersTable.bgColor,
    collectName: usersTable.collectName,
    collectEmail: usersTable.collectEmail,
  });

  if (!userDetails) {
    throw ApiError.notFound("User not found.");
  }

  return successResponse({ message: "User Found.", userDetails });
});

export const GET = withMetrics(handleGET, "/api/get-user-details");

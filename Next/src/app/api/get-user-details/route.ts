import { createHandler } from "@/lib/route-handler";
import { successResponse } from "@/lib/api-response";
import { authService } from "@/services/auth.service";
import { userRepository } from "@/repositories/user.repository";
import { ApiError } from "@/lib/api-error";
import { usersTable } from "@/db/models/user";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { withMetrics } from "@/lib/metrics";

const handleGET = createHandler(async () => {
  const user = await authService.requireAuth();

  if (!user.email) {
    throw ApiError.badRequest("Email not found in session.");
  }

  const [dbUser] = await db
    .select({
      name: usersTable.name,
      username: usersTable.username,
      avatar_url: usersTable.avatarUrl,
      introduction: usersTable.introduction,
      questions: usersTable.questions,
      textColor: usersTable.textColor,
      bgColor: usersTable.bgColor,
      collectName: usersTable.collectName,
      collectEmail: usersTable.collectEmail,
    })
    .from(usersTable)
    .where(eq(usersTable.email, user.email))
    .limit(1);

  if (!dbUser) {
    throw ApiError.notFound("User not found.");
  }

  return successResponse({ message: "User Found.", userDetails: dbUser });
});

export const GET = withMetrics(handleGET, "/api/get-user-details");

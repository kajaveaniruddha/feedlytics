import { createHandler } from "@/lib/route-handler";
import { successResponse } from "@/lib/api-response";
import { userRepository } from "@/repositories/user.repository";
import { ApiError } from "@/lib/api-error";
import { usersTable } from "@/db/models/user";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { withMetrics } from "@/lib/metrics";
import { mergeWithDefaults } from "@/lib/theme-utils";

const handleGET = createHandler(
  async (
    _request: Request,
    { params }: { params: Promise<{ username: string }> }
  ) => {
    const { username } = await params;

    const [user] = await db
      .select({
        name: usersTable.name,
        introduction: usersTable.introduction,
        questions: usersTable.questions,
        avatar_url: usersTable.avatarUrl,
        collectName: usersTable.collectName,
        collectEmail: usersTable.collectEmail,
        bgColor: usersTable.bgColor,
        textColor: usersTable.textColor,
        formTheme: usersTable.formTheme,
      })
      .from(usersTable)
      .where(eq(usersTable.username, username))
      .limit(1);

    if (!user) {
      throw ApiError.notFound("User not found.");
    }

    const rawTheme = (user.formTheme as Record<string, unknown>) || {};
    if (!rawTheme.formBgColor && user.bgColor) {
      rawTheme.formBgColor = user.bgColor;
    }
    if (!rawTheme.formTextColor && user.textColor) {
      rawTheme.formTextColor = user.textColor;
    }
    const formTheme = mergeWithDefaults(rawTheme);

    const { bgColor, textColor, formTheme: _raw, ...rest } = user;

    return successResponse({ message: "User Found.", userDetails: { ...rest, formTheme } });
  }
);

export const GET = withMetrics(handleGET, "/api/get-user-form-details");

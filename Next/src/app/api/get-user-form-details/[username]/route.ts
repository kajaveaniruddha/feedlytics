import { withMetrics } from "@/lib/metrics";
import { createHandler } from "@/lib/route-handler";
import { successResponse } from "@/lib/api-response";
import { userRepository } from "@/repositories/user.repository";
import { usersTable } from "@/db/models/user";
import { ApiError } from "@/lib/api-error";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";

const handleGET = createHandler(
  async (
    req: Request,
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
      })
      .from(usersTable)
      .where(eq(usersTable.username, username))
      .limit(1);

    if (!user) {
      throw ApiError.notFound("User not found.");
    }

    return successResponse({ message: "User Found.", userDetails: user });
  }
);

export const GET = withMetrics(handleGET, "/api/get-user-form-details");

import { getServerSession, User } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { ApiError } from "@/lib/api-error";

export const authService = {
  async requireAuth(): Promise<User> {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      throw ApiError.unauthorized("Not authenticated");
    }
    return session.user;
  },

  parseUserId(user: User): number {
    const userId = parseInt(user.id ?? "0", 10);
    if (!userId || isNaN(userId)) {
      throw ApiError.badRequest("Invalid user ID");
    }
    return userId;
  },
};

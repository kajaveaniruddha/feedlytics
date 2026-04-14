import { feedbackRepository } from "@/repositories/feedback.repository";
import { userRepository } from "@/repositories/user.repository";
import { usersTable } from "@/db/models/user";
import { ApiError } from "@/lib/api-error";

export const analyticsService = {
  async getAnalytics(userId: number) {
    const userDetails = await userRepository.selectFieldsById(userId, {
      name: usersTable.name,
      messageCount: usersTable.messageCount,
      maxMessages: usersTable.maxMessages,
    });

    if (!userDetails) {
      throw ApiError.notFound("User not found.");
    }

    const [categoryCounts, sentimentCounts, ratingsCount] = await Promise.all([
      feedbackRepository.getCategoryCounts(userId),
      feedbackRepository.getSentimentCounts(userId),
      feedbackRepository.getRatingsCounts(userId),
    ]);

    return {
      userDetails: {
        name: userDetails.name,
        messageCount: userDetails.messageCount,
        maxMessages: userDetails.maxMessages,
      },
      categoryCounts,
      sentimentCounts,
      ratingsCount,
    };
  },

  async getSentimentCounts(userId: number) {
    return feedbackRepository.getSentimentCounts(userId);
  },
};

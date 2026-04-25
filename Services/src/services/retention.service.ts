import { userRepository } from "../repositories/user.repository";
import { feedbackRepository } from "../repositories/feedback.repository";
import { PLAN_LIMITS, type PlanTier } from "../config/plans";
import { logger } from "../lib/logger";

export const retentionService = {
  async cleanupExpiredFeedbacks() {
    logger.info({}, "Starting data retention cleanup");

    const users = await userRepository.findAllWithTier();
    let totalDeleted = 0;

    for (const user of users) {
      const tier = (user.userTier || "free") as PlanTier;
      const retentionDays = PLAN_LIMITS[tier]?.dataRetentionDays ?? 90;
      if (retentionDays === Infinity) continue;

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      const deleted = await feedbackRepository.deleteExpiredForUser(user.id, cutoffDate);
      if (deleted > 0) {
        totalDeleted += deleted;
        logger.info({ userId: user.id, tier, deleted, retentionDays }, "Deleted expired feedbacks");
      }
    }

    logger.info({ totalDeleted }, "Retention cleanup complete");
    return totalDeleted;
  },
};

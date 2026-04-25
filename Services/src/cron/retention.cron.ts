import cron from "node-cron";
import { retentionService } from "../services/retention.service";
import { logger } from "../lib/logger";

export function startRetentionCron() {
  cron.schedule("0 3 * * *", () => {
    retentionService.cleanupExpiredFeedbacks().catch((error) => {
      logger.error({ error: String(error) }, "Retention cron failed");
    });
  });
  logger.info({}, "Retention cron scheduled: daily at 03:00 UTC");
}

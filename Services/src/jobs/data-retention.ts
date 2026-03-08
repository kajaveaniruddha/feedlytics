import cron from "node-cron";
import { db } from "../db/db";
import { feedbacksTable } from "../db/models/feedback";
import { usersTable } from "../db/models/user";
import { eq, lt, and, sql } from "drizzle-orm";
import { PLAN_LIMITS, type PlanTier } from "../config/plans";

async function runRetentionCleanup() {
  console.log("[retention] Starting data retention cleanup...");

  try {
    const users = await db
      .select({
        id: usersTable.id,
        userTier: usersTable.userTier,
      })
      .from(usersTable);

    let totalDeleted = 0;

    for (const user of users) {
      const tier = (user.userTier || "free") as PlanTier;
      const retentionDays = PLAN_LIMITS[tier]?.dataRetentionDays ?? 90;

      if (retentionDays === Infinity) continue;

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      const result = await db
        .delete(feedbacksTable)
        .where(
          and(
            eq(feedbacksTable.userId, user.id),
            lt(feedbacksTable.createdAt, cutoffDate)
          )
        );

      const deleted = result.rowCount ?? 0;
      if (deleted > 0) {
        totalDeleted += deleted;
        console.log(
          `[retention] Deleted ${deleted} expired feedbacks for user ${user.id} (tier: ${tier}, retention: ${retentionDays}d)`
        );
      }
    }

    console.log(
      `[retention] Cleanup complete. Total deleted: ${totalDeleted}`
    );
  } catch (error) {
    console.error("[retention] Cleanup failed:", error);
  }
}

export function startRetentionCron() {
  cron.schedule("0 3 * * *", () => {
    runRetentionCleanup();
  });
  console.log("[retention] Cron scheduled: daily at 03:00 UTC");
}

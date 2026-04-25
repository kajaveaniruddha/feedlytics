import { db } from "../db/db";
import { feedbacksTable, InsertFeedback } from "../db/models/feedback";
import { eq, lt, and } from "drizzle-orm";

export const feedbackRepository = {
  async insert(data: InsertFeedback) {
    return db.insert(feedbacksTable).values(data);
  },

  async deleteExpiredForUser(userId: number, cutoffDate: Date) {
    const result = await db
      .delete(feedbacksTable)
      .where(
        and(
          eq(feedbacksTable.userId, userId),
          lt(feedbacksTable.createdAt, cutoffDate)
        )
      );
    return result.rowCount ?? 0;
  },
};

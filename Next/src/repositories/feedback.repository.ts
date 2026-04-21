import { db } from "@/db/db";
import { feedbacksTable } from "@/db/models/feedback";
import { eq, and, sql, desc, gte, inArray } from "drizzle-orm";

export const feedbackRepository = {
  async findByUserId(userId: number) {
    return db
      .select()
      .from(feedbacksTable)
      .where(eq(feedbacksTable.userId, userId))
      .orderBy(desc(feedbacksTable.createdAt));
  },

  async countByUserId(userId: number) {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(feedbacksTable)
      .where(eq(feedbacksTable.userId, userId));
    return Number(result?.count ?? 0);
  },

  async countByUserIdSince(userId: number, since: Date) {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(feedbacksTable)
      .where(
        and(eq(feedbacksTable.userId, userId), gte(feedbacksTable.createdAt, since))
      );
    return Number(result?.count ?? 0);
  },

  async deleteByIdsForUser(ids: number[], userId: number) {
    const result = await db
      .delete(feedbacksTable)
      .where(
        and(
          inArray(feedbacksTable.id, ids),
          eq(feedbacksTable.userId, userId)
        )
      );
    return result.rowCount ?? 0;
  },

  async getCategoryCounts(userId: number) {
    return db
      .select({
        category: sql<string>`unnest(${feedbacksTable.category})`.as("category"),
        count: sql<number>`COUNT(*)`,
      })
      .from(feedbacksTable)
      .where(eq(feedbacksTable.userId, userId))
      .groupBy(sql`unnest(${feedbacksTable.category})`);
  },

  async getSentimentCounts(userId: number) {
    const rows = await db
      .select({
        sentiment: feedbacksTable.sentiment,
        count: sql<number>`COUNT(${feedbacksTable.sentiment})`,
      })
      .from(feedbacksTable)
      .where(eq(feedbacksTable.userId, userId))
      .groupBy(feedbacksTable.sentiment);

    const counts = { positive: 0, negative: 0, neutral: 0 };
    rows.forEach((row) => {
      counts[row.sentiment as keyof typeof counts] = Number(row.count);
    });
    return counts;
  },

  async getRatingsCounts(userId: number) {
    return db
      .select({
        rating: feedbacksTable.stars,
        count: sql<number>`COUNT(${feedbacksTable.stars})`,
      })
      .from(feedbacksTable)
      .where(eq(feedbacksTable.userId, userId))
      .groupBy(feedbacksTable.stars);
  },
};

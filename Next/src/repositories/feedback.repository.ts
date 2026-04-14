import { db } from "@/db/db";
import { feedbacksTable } from "@/db/models/feedback";
import { eq, and, inArray, ilike, desc, asc, sql, SQL } from "drizzle-orm";

export interface FindByUserIdOptions {
  limit?: number;
  offset?: number;
  sortBy?: "createdAt" | "stars";
  sortOrder?: "asc" | "desc";
  content?: string;
  stars?: number[];
  sentiment?: string[];
  category?: string[];
}

function buildFilterConditions(
  userId: number,
  filters?: Omit<FindByUserIdOptions, "limit" | "offset" | "sortBy" | "sortOrder">
): SQL[] {
  const conditions: SQL[] = [eq(feedbacksTable.userId, userId)];

  if (filters?.content) {
    conditions.push(ilike(feedbacksTable.content, `%${filters.content}%`));
  }

  if (filters?.stars && filters.stars.length > 0) {
    conditions.push(inArray(feedbacksTable.stars, filters.stars));
  }

  if (filters?.sentiment && filters.sentiment.length > 0) {
    conditions.push(inArray(feedbacksTable.sentiment, filters.sentiment));
  }

  if (filters?.category && filters.category.length > 0) {
    conditions.push(
      sql`${feedbacksTable.category} && ARRAY[${sql.join(
        filters.category.map((cat) => sql`${cat}`),
        sql`, `
      )}]::text[]`
    );
  }

  return conditions;
}

export const feedbackRepository = {
  async findByUserId(userId: number, options: FindByUserIdOptions = {}) {
    const {
      limit = 10,
      offset = 0,
      sortBy = "createdAt",
      sortOrder = "desc",
      content,
      stars,
      sentiment,
      category,
    } = options;

    const conditions = buildFilterConditions(userId, { content, stars, sentiment, category });
    const orderByColumn = feedbacksTable[sortBy];
    const orderByClause = sortOrder === "desc" ? desc(orderByColumn) : asc(orderByColumn);

    return db
      .select()
      .from(feedbacksTable)
      .where(and(...conditions))
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);
  },

  async countByUserId(
    userId: number,
    filters?: Omit<FindByUserIdOptions, "limit" | "offset" | "sortBy" | "sortOrder">
  ) {
    const conditions = buildFilterConditions(userId, filters);

    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(feedbacksTable)
      .where(and(...conditions));

    return Number(result[0]?.count ?? 0);
  },

  async countByUserIdSince(userId: number, since: Date) {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(feedbacksTable)
      .where(
        and(
          eq(feedbacksTable.userId, userId),
          sql`${feedbacksTable.createdAt} >= ${since}`
        )
      );
    return Number(result[0]?.count ?? 0);
  },

  /** SECURITY FIX: Deletes only messages owned by the given user */
  async deleteByIdsForUser(ids: number[], userId: number) {
    return db
      .delete(feedbacksTable)
      .where(
        and(
          inArray(feedbacksTable.id, ids),
          eq(feedbacksTable.userId, userId)
        )
      );
  },

  async getSentimentCounts(userId: number) {
    const sentimentCounts = await db
      .select({
        sentiment: feedbacksTable.sentiment,
        count: sql<number>`COUNT(${feedbacksTable.sentiment})`,
      })
      .from(feedbacksTable)
      .where(eq(feedbacksTable.userId, userId))
      .groupBy(feedbacksTable.sentiment);

    const counts = { positive: 0, negative: 0, neutral: 0 };
    sentimentCounts.forEach((item) => {
      counts[item.sentiment as keyof typeof counts] = Number(item.count);
    });
    return counts;
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

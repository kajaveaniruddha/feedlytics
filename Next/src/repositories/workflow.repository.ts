import { db } from "@/db/db";
import { userWorkFlowsTable, InsertChatGroup } from "@/db/models/workflows";
import { eq, and, sql } from "drizzle-orm";

export const workflowRepository = {
  async findByUserId(userId: number) {
    return db
      .select()
      .from(userWorkFlowsTable)
      .where(eq(userWorkFlowsTable.userId, userId));
  },

  async countByUserId(userId: number) {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(userWorkFlowsTable)
      .where(eq(userWorkFlowsTable.userId, userId));
    return Number(result?.count ?? 0);
  },

  async create(data: InsertChatGroup) {
    return db.insert(userWorkFlowsTable).values(data);
  },

  async updateByIdAndUserId(
    id: number,
    userId: number,
    data: Partial<InsertChatGroup>
  ) {
    const result = await db
      .update(userWorkFlowsTable)
      .set(data)
      .where(
        and(
          eq(userWorkFlowsTable.id, id),
          eq(userWorkFlowsTable.userId, userId)
        )
      );
    return result.rowCount ?? 0;
  },

  async deleteByIdAndUserId(id: number, userId: number) {
    await db
      .delete(userWorkFlowsTable)
      .where(
        and(
          eq(userWorkFlowsTable.id, id),
          eq(userWorkFlowsTable.userId, userId)
        )
      );
  },
};

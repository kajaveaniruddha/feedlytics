import { db } from "../db/db";
import { userWorkFlowsTable } from "../db/models/workflows";
import { eq, and, arrayOverlaps } from "drizzle-orm";

export const workflowRepository = {
  async findActiveByUserAndCategories(userId: number, categories: string[]) {
    return db
      .select()
      .from(userWorkFlowsTable)
      .where(
        and(
          eq(userWorkFlowsTable.userId, userId),
          arrayOverlaps(userWorkFlowsTable.notifyCategories, categories),
          userWorkFlowsTable.isActive
        )
      );
  },
};

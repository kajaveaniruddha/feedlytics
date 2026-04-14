import { userRepository } from "@/repositories/user.repository";
import { workflowRepository } from "@/repositories/workflow.repository";
import { usersTable } from "@/db/models/user";
import { PLAN_LIMITS, PlanTier } from "@/config/plans";
import { ApiError } from "@/lib/api-error";
import type { InsertChatGroup } from "@/db/models/workflows";

function trimValues<T extends Record<string, any>>(obj: T): T {
  const result = { ...obj };
  for (const key in result) {
    if (typeof result[key] === "string") {
      (result as any)[key] = result[key].trim();
    } else if (Array.isArray(result[key])) {
      (result as any)[key] = result[key].map((item: any) =>
        typeof item === "string" ? item.trim() : item
      );
    }
  }
  return result;
}

export const workflowService = {
  async getWorkflows(userId: number) {
    const workflows = await workflowRepository.findByUserId(userId);

    const workflowsByProvider = workflows.reduce(
      (acc, wf) => {
        acc[wf.provider] = acc[wf.provider] || [];
        acc[wf.provider].push({
          id: wf.id.toString(),
          groupName: wf.groupName,
          webhookUrl: wf.webhookUrl,
          notifyCategories: wf.notifyCategories || [],
          isActive: wf.isActive || false,
        });
        return acc;
      },
      {} as Record<string, { id: string; groupName: string; webhookUrl: string; notifyCategories: string[]; isActive: boolean }[]>
    );

    return workflowsByProvider;
  },

  async createWorkflow(userId: number, data: InsertChatGroup) {
    const [userData, currentCount] = await Promise.all([
      userRepository.selectFieldsById(userId, {
        maxWorkflows: usersTable.maxWorkflows,
        userTier: usersTable.userTier,
      }),
      workflowRepository.countByUserId(userId),
    ]);

    if (!userData) {
      throw ApiError.notFound("User not found");
    }

    const tier = (userData.userTier || "free") as PlanTier;
    const maxWorkflows = PLAN_LIMITS[tier]?.maxWorkflows ?? userData.maxWorkflows ?? 5;

    if (currentCount >= maxWorkflows) {
      throw ApiError.forbidden(
        `You have reached your maximum workflow limit of ${maxWorkflows}. Please upgrade your plan to add more workflows.`
      );
    }

    return workflowRepository.create(data);
  },

  async updateWorkflow(
    id: number,
    userId: number,
    data: Partial<InsertChatGroup>
  ) {
    return workflowRepository.updateByIdAndUserId(id, userId, trimValues(data));
  },

  async deleteWorkflow(id: number, userId: number) {
    return workflowRepository.deleteByIdAndUserId(id, userId);
  },
};

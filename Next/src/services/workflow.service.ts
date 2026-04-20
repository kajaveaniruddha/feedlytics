import { workflowRepository } from "@/repositories/workflow.repository";
import { userRepository } from "@/repositories/user.repository";
import { ApiError } from "@/lib/api-error";
import { PLAN_LIMITS, PlanTier } from "@/config/plans";

export const workflowService = {
  async getWorkflowsByProvider(userId: number) {
    const workflows = await workflowRepository.findByUserId(userId);

    return workflows.reduce(
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
      {} as Record<
        string,
        {
          id: string;
          groupName: string;
          webhookUrl: string;
          notifyCategories: string[];
          isActive: boolean;
        }[]
      >
    );
  },

  async createWorkflow(
    userId: number,
    data: {
      provider: "googlechat" | "slack";
      groupName: string;
      webhookUrl: string;
      notifyCategories?: string[];
      isActive?: boolean;
    }
  ) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw ApiError.notFound("User not found.");
    }

    const tier = (user.userTier || "free") as PlanTier;
    const maxWorkflows =
      PLAN_LIMITS[tier]?.maxWorkflows ?? user.maxWorkflows ?? 5;
    const currentCount = await workflowRepository.countByUserId(userId);

    if (currentCount >= maxWorkflows) {
      throw ApiError.forbidden(
        `You have reached your maximum workflow limit of ${maxWorkflows}. Please upgrade your plan to add more workflows.`
      );
    }

    return workflowRepository.create({
      userId,
      provider: data.provider,
      groupName: data.groupName,
      webhookUrl: data.webhookUrl,
      notifyCategories: data.notifyCategories || [],
      isActive: data.isActive ?? true,
    });
  },

  async updateWorkflow(
    id: number,
    userId: number,
    data: {
      provider?: "googlechat" | "slack";
      groupName?: string;
      webhookUrl?: string;
      notifyCategories?: string[];
      isActive?: boolean;
    }
  ) {
    return workflowRepository.updateByIdAndUserId(id, userId, {
      ...(data.provider !== undefined && { provider: data.provider }),
      ...(data.groupName !== undefined && { groupName: data.groupName }),
      ...(data.webhookUrl !== undefined && { webhookUrl: data.webhookUrl }),
      ...(data.notifyCategories !== undefined && {
        notifyCategories: data.notifyCategories,
      }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    });
  },

  async deleteWorkflow(id: number, userId: number) {
    return workflowRepository.deleteByIdAndUserId(id, userId);
  },
};

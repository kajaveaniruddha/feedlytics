import { withMetrics } from "@/lib/metrics";
import { createHandler } from "@/lib/route-handler";
import { validateBody } from "@/lib/validate";
import { workflowsSchema, type WorkflowsSchema } from "@/schemas/workFlowsSchema";
import { successResponse } from "@/lib/api-response";
import { authService } from "@/services/auth.service";
import { workflowService } from "@/services/workflow.service";
import { ApiError } from "@/lib/api-error";

const handleGET = createHandler(async () => {
  const user = await authService.requireAuth();
  const userId = authService.parseUserId(user);

  const workflows = await workflowService.getWorkflows(userId);
  return successResponse({ workflows });
});

const handlePOST = createHandler(async (req: Request) => {
  const user = await authService.requireAuth();
  const userId = authService.parseUserId(user);

  const data = await validateBody<WorkflowsSchema>(req, workflowsSchema);

  const result = await workflowService.createWorkflow(userId, {
    userId,
    provider: data.provider,
    groupName: data.groupName,
    webhookUrl: data.webhookUrl,
    notifyCategories: data.notifyCategories || [],
    isActive: data.isActive,
  });

  return successResponse({ data: result, message: "Workflow created successfully" }, 201);
});

const handlePATCH = createHandler(async (req: Request) => {
  const user = await authService.requireAuth();
  const userId = authService.parseUserId(user);

  const { id, provider, groupName, webhookUrl, notifyCategories, isActive } =
    await req.json();

  if (id === undefined || id === null) {
    throw ApiError.badRequest("Missing workflow id");
  }

  const result = await workflowService.updateWorkflow(id, userId, {
    provider,
    groupName,
    webhookUrl,
    notifyCategories: notifyCategories || [],
    isActive,
  });

  return successResponse({ data: result });
});

const handleDELETE = createHandler(async (req: Request) => {
  const user = await authService.requireAuth();
  const userId = authService.parseUserId(user);

  const { id } = await req.json();
  if (id === undefined || id === null) {
    throw ApiError.badRequest("Missing workflow id");
  }

  await workflowService.deleteWorkflow(id, userId);
  return successResponse({});
});

export const GET = withMetrics(handleGET, "/api/user-workflows");
export const POST = withMetrics(handlePOST, "/api/user-workflows");
export const PATCH = withMetrics(handlePATCH, "/api/user-workflows");
export const DELETE = withMetrics(handleDELETE, "/api/user-workflows");

import { createHandler } from "@/lib/route-handler";
import { successResponse } from "@/lib/api-response";
import { validateBody } from "@/lib/validate";
import { workflowsSchema } from "@/schemas/workFlowsSchema";
import { authService } from "@/services/auth.service";
import { workflowService } from "@/services/workflow.service";
import { ApiError } from "@/lib/api-error";
import { withMetrics } from "@/lib/metrics";

function trimValues(obj: any): any {
  if (typeof obj === "string") return obj.trim();
  if (obj && typeof obj === "object") {
    for (const key in obj) {
      if (typeof obj[key] === "string") {
        obj[key] = obj[key].trim();
      } else if (Array.isArray(obj[key])) {
        obj[key] = obj[key].map((item: any) =>
          typeof item === "string" ? item.trim() : item
        );
      }
    }
  }
  return obj;
}

const handleGET = createHandler(async () => {
  const user = await authService.requireAuth();
  const userId = authService.parseUserId(user);

  const workflows = await workflowService.getWorkflowsByProvider(userId);

  return successResponse({ workflows });
});

const handlePOST = createHandler(async (request: Request) => {
  const user = await authService.requireAuth();
  const userId = authService.parseUserId(user);

  let json = await request.json();
  json = trimValues(json);
  const data = workflowsSchema.parse(json);

  await workflowService.createWorkflow(userId, data);

  return successResponse({ message: "Workflow created successfully." });
});

const handlePATCH = createHandler(async (request: Request) => {
  const user = await authService.requireAuth();
  const userId = authService.parseUserId(user);

  let json = await request.json();
  json = trimValues(json);

  const { id, provider, groupName, webhookUrl, notifyCategories, isActive } =
    json;

  if (id === undefined || id === null) {
    throw ApiError.badRequest("Missing workflow id.");
  }

  await workflowService.updateWorkflow(id, userId, {
    provider,
    groupName,
    webhookUrl,
    notifyCategories: notifyCategories || [],
    isActive,
  });

  return successResponse({ message: "Workflow updated successfully." });
});

const handleDELETE = createHandler(async (request: Request) => {
  const user = await authService.requireAuth();
  const userId = authService.parseUserId(user);

  const { id } = await request.json();

  if (id === undefined || id === null) {
    throw ApiError.badRequest("Missing workflow id.");
  }

  await workflowService.deleteWorkflow(id, userId);

  return successResponse({ message: "Workflow deleted successfully." });
});

export const GET = withMetrics(handleGET, "/api/user-workflows");
export const POST = withMetrics(handlePOST, "/api/user-workflows");
export const PATCH = withMetrics(handlePATCH, "/api/user-workflows");
export const DELETE = withMetrics(handleDELETE, "/api/user-workflows");

import { http, HttpResponse } from "msw";

import { env } from "@/config/env";
import { workspaceWidgetFixture } from "@/mocks/fixtures/workspace-widget.fixture";
import type { WorkspaceWidgetDto } from "@/services/workspace/workspaceWidget.service";

const managementUrl = `${env.apiBaseUrl}/api/v1/workspaces/:workspacePublicId/widget/management`;

let widgetState: WorkspaceWidgetDto = { ...workspaceWidgetFixture, theme: { ...workspaceWidgetFixture.theme } };

export function resetWorkspaceWidgetHandlerState() {
  widgetState = { ...workspaceWidgetFixture, theme: { ...workspaceWidgetFixture.theme } };
}

export const workspaceWidgetManagementHappyHandlers = [
  http.get(managementUrl, () => HttpResponse.json(widgetState)),
  http.patch(managementUrl, async ({ request }) => {
    const body = (await request.json()) as Partial<WorkspaceWidgetDto>;
    widgetState = {
      ...widgetState,
      collectName: body.collectName ?? widgetState.collectName,
      collectEmail: body.collectEmail ?? widgetState.collectEmail,
      isActive: body.isActive ?? widgetState.isActive,
      theme: body.theme ? { ...body.theme } : { ...widgetState.theme },
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(widgetState);
  }),
];

export const workspaceWidgetManagementForbiddenHandlers = [
  http.get(managementUrl, () =>
    HttpResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: "Only owner or admin can perform this action" } },
      { status: 403 },
    ),
  ),
];

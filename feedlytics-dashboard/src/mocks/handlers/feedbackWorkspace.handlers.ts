import { http, HttpResponse } from "msw";

import { env } from "@/config/env";
import { workspaceOverviewFixture } from "@/mocks/fixtures/workspace-overview.fixture";

export const feedbackWorkspaceOverviewHandlers = [
  http.get(
    `${env.apiBaseUrl}/api/v1/workspaces/:workspacePublicId/feedbacks/analytics/overview`,
    () => HttpResponse.json(workspaceOverviewFixture),
  ),
];

export const feedbackWorkspaceOverviewErrorHandlers = [
  http.get(
    `${env.apiBaseUrl}/api/v1/workspaces/:workspacePublicId/feedbacks/analytics/overview`,
    () =>
      HttpResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Not allowed" } },
        { status: 403 },
      ),
  ),
];

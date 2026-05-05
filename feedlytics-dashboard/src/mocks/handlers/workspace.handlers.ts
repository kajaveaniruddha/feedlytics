import { http, HttpResponse } from "msw";

import { env } from "@/config/env";
import { endpoints } from "@/services/api/endpoints";
import {
  createdWorkspaceFixture,
  workspaceListAtFreeLimitFixture,
  workspaceListFixture,
} from "@/mocks/fixtures/workspace.fixture";

const url = (path: string) => `${env.apiBaseUrl}${path}`;

export const workspaceHappyPathHandlers = [
  http.get(url(endpoints.workspace.root), () =>
    HttpResponse.json({ success: true, workspaces: workspaceListFixture }),
  ),
  http.post(url(endpoints.workspace.root), async ({ request }) => {
    const body = (await request.json()) as { name?: string; description?: string };
    return HttpResponse.json(
      {
        success: true,
        message: "Workspace created successfully.",
        workspace: {
          ...createdWorkspaceFixture,
          name: body.name ?? createdWorkspaceFixture.name,
          description: body.description ?? null,
        },
      },
      { status: 200 },
    );
  }),
];

export const workspaceListEmptyHandlers = [
  http.get(url(endpoints.workspace.root), () =>
    HttpResponse.json({ success: true, workspaces: [] }),
  ),
];

export const workspaceListAtLimitHandlers = [
  http.get(url(endpoints.workspace.root), () =>
    HttpResponse.json({ success: true, workspaces: workspaceListAtFreeLimitFixture }),
  ),
  http.post(url(endpoints.workspace.root), () =>
    HttpResponse.json(
      {
        success: false,
        error: {
          code: "FREE_WORKSPACE_LIMIT_EXCEEDED",
          message:
            "You can only have 3 free workspaces. Upgrade an existing workspace to PRO or BUSINESS to create more.",
        },
      },
      { status: 429 },
    ),
  ),
];

export const workspaceListErrorHandlers = [
  http.get(url(endpoints.workspace.root), () =>
    HttpResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Something went wrong" } },
      { status: 500 },
    ),
  ),
];

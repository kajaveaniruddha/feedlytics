import { http, HttpResponse } from "msw";

import { env } from "@/config/env";
import { endpoints } from "@/services/api/endpoints";
import { workspaceOverviewFixture } from "@/mocks/fixtures/workspace-overview.fixture";
import { workspaceFeedbackFixture } from "@/mocks/fixtures/workspace-feedback.fixture";
import { workspaceRecentFeedbackFixture } from "@/mocks/fixtures/workspace-recent-feedback.fixture";

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

const url = (path: string) => `${env.apiBaseUrl}${path}`;

export const feedbackWorkspaceListHandlers = [
  http.get(url(endpoints.feedback.workspaceList(":workspacePublicId")), ({ request }) => {
    const parsedUrl = new URL(request.url);
    const page = Number(parsedUrl.searchParams.get("page") ?? "0");
    const size = Number(parsedUrl.searchParams.get("size") ?? "10");
    const source = page === 0 && size === 3 ? workspaceRecentFeedbackFixture : workspaceFeedbackFixture;
    const start = page * size;
    const rows = source.slice(start, start + size);
    return HttpResponse.json({
      feedbacks: rows,
      page,
      size,
      totalElements: source.length,
      totalPages: Math.ceil(source.length / size),
    });
  }),
];

export const feedbackWorkspaceListEmptyHandlers = [
  http.get(url(endpoints.feedback.workspaceList(":workspacePublicId")), ({ request }) => {
    const parsedUrl = new URL(request.url);
    const page = Number(parsedUrl.searchParams.get("page") ?? "0");
    const size = Number(parsedUrl.searchParams.get("size") ?? "10");
    return HttpResponse.json({
      feedbacks: [],
      page,
      size,
      totalElements: 0,
      totalPages: 0,
    });
  }),
];

export const feedbackWorkspaceListErrorHandlers = [
  http.get(url(endpoints.feedback.workspaceList(":workspacePublicId")), () =>
    HttpResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Could not load feedbacks" } },
      { status: 500 },
    ),
  ),
];

export const feedbackWorkspaceDeleteHandlers = [
  http.delete(url(endpoints.feedback.workspaceItem(":workspacePublicId", ":feedbackPublicId")), () =>
    new HttpResponse(null, { status: 204 }),
  ),
];

export const feedbackWorkspaceDeleteForbiddenHandlers = [
  http.delete(url(endpoints.feedback.workspaceItem(":workspacePublicId", ":feedbackPublicId")), () =>
    HttpResponse.json(
      { success: false, error: { code: "INSUFFICIENT_PERMISSION", message: "Not allowed" } },
      { status: 403 },
    ),
  ),
];

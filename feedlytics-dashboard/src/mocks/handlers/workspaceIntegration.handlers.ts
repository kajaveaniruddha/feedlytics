import { http, HttpResponse } from "msw";

import { env } from "@/config/env";

const integrationBase = `${env.apiBaseUrl}/api/v1/workspaces/:workspacePublicId/integration`;

export const workspaceIntegrationHappyHandlers = [
  http.get(integrationBase, () =>
    HttpResponse.json({
      success: true,
      hasApiKey: true,
      hasWidgetSecret: false,
      hasWidgetOrigins: true,
      widgetOrigins: ["https://example.com", "http://localhost:3000"],
    }),
  ),
  http.post(`${integrationBase}/api-key/rotate`, () =>
    HttpResponse.json({
      success: true,
      apiKey: "flt_storybook_test_key_replace_me",
    }),
  ),
  http.delete(`${integrationBase}/api-key`, () => new HttpResponse(null, { status: 204 })),
  http.post(`${integrationBase}/widget-secret/rotate`, () =>
    HttpResponse.json({
      success: true,
      widgetSecret: "fltw_storybook_test_secret_replace_me",
    }),
  ),
  http.delete(`${integrationBase}/widget-secret`, () => new HttpResponse(null, { status: 204 })),
  http.put(`${integrationBase}/widget-origins`, async ({ request }) => {
    const body = (await request.json()) as { origins?: string[] };
    return HttpResponse.json({
      success: true,
      hasApiKey: true,
      hasWidgetSecret: false,
      hasWidgetOrigins: (body.origins?.length ?? 0) > 0,
      widgetOrigins: body.origins ?? [],
    });
  }),
];

export const workspaceIntegrationForbiddenHandlers = [
  http.get(integrationBase, () =>
    HttpResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: "Only owner or admin" } },
      { status: 403 },
    ),
  ),
];

export const workspaceIntegrationValidationErrorHandlers = [
  http.get(integrationBase, () =>
    HttpResponse.json({
      success: true,
      hasApiKey: false,
      hasWidgetSecret: false,
      hasWidgetOrigins: false,
      widgetOrigins: [],
    }),
  ),
  http.put(`${integrationBase}/widget-origins`, () =>
    HttpResponse.json(
      {
        success: false,
        error: { code: "BAD_REQUEST", message: "INVALID_ORIGIN: Origin must use http or https" },
      },
      { status: 400 },
    ),
  ),
];

import { http, HttpResponse } from "msw";

import { env } from "@/config/env";
import { endpoints } from "@/services/api/endpoints";

import { adaProfile } from "../fixtures/users.fixture";

const url = (path: string) => `${env.apiBaseUrl}${path}`;

export const userHappyPathHandlers = [
  http.get(url(endpoints.user.profile), () =>
    HttpResponse.json({ success: true, user: adaProfile }),
  ),
];

export const userProfileUnauthorized = http.get(
  url(endpoints.user.profile),
  () =>
    HttpResponse.json(
      { success: false, error: { code: "NOT_AUTHENTICATED", message: "Missing token" } },
      { status: 401 },
    ),
);

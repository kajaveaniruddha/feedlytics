import { http, HttpResponse } from "msw";

import { env } from "@/config/env";
import { endpoints } from "@/services/api/endpoints";

import {
  authEmailExists,
  authInvalidCredentials,
  authSuccess,
  authValidationError,
  registerNeedsVerification,
} from "../fixtures/auth.fixture";

const url = (path: string) => `${env.apiBaseUrl}${path}`;

export const authHappyPathHandlers = [
  http.post(url(endpoints.auth.login), () => HttpResponse.json(authSuccess)),
  http.post(url(endpoints.auth.register), () =>
    HttpResponse.json(registerNeedsVerification, { status: 201 }),
  ),
  http.post(url(endpoints.auth.verifyEmail), () =>
    HttpResponse.json({ success: true, message: "Email verified successfully" }),
  ),
  http.post(url(endpoints.auth.regenerateEmailCode), () =>
    HttpResponse.json({ success: true, message: "Verification code sent" }),
  ),
  http.post(url(endpoints.auth.refresh), () => HttpResponse.json(authSuccess)),
  http.post(url(endpoints.auth.logout), () => HttpResponse.json({ success: true })),
  http.post(url(endpoints.auth.oauth(":provider")), () =>
    HttpResponse.json(authSuccess),
  ),
];

export const authLoginInvalidCredentials = http.post(
  url(endpoints.auth.login),
  () => HttpResponse.json(authInvalidCredentials, { status: 401 }),
);

export const authLoginValidationError = http.post(url(endpoints.auth.login), () =>
  HttpResponse.json(authValidationError, { status: 400 }),
);

export const authLoginNetworkError = http.post(
  url(endpoints.auth.login),
  () => HttpResponse.error(),
);

export const authRegisterEmailExists = http.post(
  url(endpoints.auth.register),
  () => HttpResponse.json(authEmailExists, { status: 409 }),
);

export const authRegisterAutoVerified = http.post(
  url(endpoints.auth.register),
  () => HttpResponse.json(authSuccess, { status: 201 }),
);

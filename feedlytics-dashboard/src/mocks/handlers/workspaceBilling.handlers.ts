import { http, HttpResponse } from "msw";

import { env } from "@/config/env";
import { endpoints } from "@/services/api/endpoints";
import {
  billingBusinessYearlyFixture,
  billingFreeFixture,
  billingProMonthlyFixture,
} from "@/mocks/fixtures/workspace-billing.fixture";

const url = (path: string) => `${env.apiBaseUrl}${path}`;

export const billingFreeHandlers = [
  http.get(url(endpoints.billing.info(":publicId")), () =>
    HttpResponse.json(billingFreeFixture),
  ),
  http.post(url(endpoints.billing.checkoutSession(":publicId")), () =>
    HttpResponse.json({ success: true, url: "https://checkout.stripe.com/mock-session" }),
  ),
  http.post(url(endpoints.billing.portalSession(":publicId")), () =>
    HttpResponse.json({ success: true, url: "https://billing.stripe.com/mock-portal" }),
  ),
];

export const billingProHandlers = [
  http.get(url(endpoints.billing.info(":publicId")), () =>
    HttpResponse.json(billingProMonthlyFixture),
  ),
  http.post(url(endpoints.billing.checkoutSession(":publicId")), () =>
    HttpResponse.json({ success: true, url: "https://checkout.stripe.com/mock-session" }),
  ),
  http.post(url(endpoints.billing.portalSession(":publicId")), () =>
    HttpResponse.json({ success: true, url: "https://billing.stripe.com/mock-portal" }),
  ),
];

export const billingBusinessHandlers = [
  http.get(url(endpoints.billing.info(":publicId")), () =>
    HttpResponse.json(billingBusinessYearlyFixture),
  ),
  http.post(url(endpoints.billing.checkoutSession(":publicId")), () =>
    HttpResponse.json({ success: true, url: "https://checkout.stripe.com/mock-session" }),
  ),
  http.post(url(endpoints.billing.portalSession(":publicId")), () =>
    HttpResponse.json({ success: true, url: "https://billing.stripe.com/mock-portal" }),
  ),
];

export const billingErrorHandlers = [
  http.get(url(endpoints.billing.info(":publicId")), () =>
    HttpResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to load billing info" } },
      { status: 500 },
    ),
  ),
];

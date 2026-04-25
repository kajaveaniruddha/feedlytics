import { analyticsApi } from "./analytics.api";
import { feedbackApi } from "./feedback.api";
import { billingApi } from "./billing.api";
import { userApi } from "./user.api";
import { workflowApi } from "./workflow.api";

export const api = {
  ...analyticsApi,
  ...feedbackApi,
  ...billingApi,
  ...userApi,
  ...workflowApi,
};

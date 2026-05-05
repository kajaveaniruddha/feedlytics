/**
 * Central registry of backend URL paths. Keeping them in one file lets us
 * swap versions (`/api/v2`) with one edit and keeps typos out of services.
 */
export const endpoints = {
  auth: {
    register: "/api/v1/auth/register",
    login: "/api/v1/auth/login",
    refresh: "/api/v1/auth/refresh",
    logout: "/api/v1/auth/logout",
    verifyEmail: "/api/v1/auth/verify-email",
    regenerateEmailCode: "/api/v1/auth/regenerate-email-verification-code",
    oauth: (provider: string) => `/api/v1/auth/oauth/${provider}`,
  },
  user: {
    profile: "/api/v1/users/profile",
  },
  workspace: {
    root: "/api/v1/workspaces",
    byId: (publicId: string) => `/api/v1/workspaces/${publicId}`,
    integration: (publicId: string) => `/api/v1/workspaces/${publicId}/integration`,
    integrationApiKeyRotate: (publicId: string) =>
      `/api/v1/workspaces/${publicId}/integration/api-key/rotate`,
    integrationApiKey: (publicId: string) => `/api/v1/workspaces/${publicId}/integration/api-key`,
    integrationWidgetSecretRotate: (publicId: string) =>
      `/api/v1/workspaces/${publicId}/integration/widget-secret/rotate`,
    integrationWidgetSecret: (publicId: string) =>
      `/api/v1/workspaces/${publicId}/integration/widget-secret`,
    integrationWidgetOrigins: (publicId: string) =>
      `/api/v1/workspaces/${publicId}/integration/widget-origins`,
  },
  feedback: {
    workspaceOverview: (workspacePublicId: string) =>
      `/api/v1/workspaces/${workspacePublicId}/feedbacks/analytics/overview`,
    categories: (workspacePublicId: string) =>
      `/api/v1/workspaces/${workspacePublicId}/feedback-categories`,
    category: (workspacePublicId: string, categoryId: number) =>
      `/api/v1/workspaces/${workspacePublicId}/feedback-categories/${categoryId}`,
  },
} as const;

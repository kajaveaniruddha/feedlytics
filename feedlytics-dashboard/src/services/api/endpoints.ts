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
  invites: {
    pending: "/api/v1/invites/pending",
    pendingAccept: (inviteId: string) => `/api/v1/invites/pending/${inviteId}/accept`,
    pendingReject: (inviteId: string) => `/api/v1/invites/pending/${inviteId}/reject`,
    acceptWithToken: "/api/v1/invites/accept",
    workspaceInvites: (workspacePublicId: string) => `/api/v1/workspaces/${workspacePublicId}/invites`,
    workspaceInvite: (workspacePublicId: string, inviteId: string) =>
      `/api/v1/workspaces/${workspacePublicId}/invites/${inviteId}`,
    workspaceInviteResend: (workspacePublicId: string, inviteId: string) =>
      `/api/v1/workspaces/${workspacePublicId}/invites/${inviteId}/resend`,
  },
  workspace: {
    root: "/api/v1/workspaces",
    byId: (publicId: string) => `/api/v1/workspaces/${publicId}`,
    planUsage: (publicId: string) => `/api/v1/workspaces/${publicId}/plan-usage`,
    members: (publicId: string) => `/api/v1/workspaces/${publicId}/members`,
    member: (workspacePublicId: string, memberUserPublicId: string) =>
      `/api/v1/workspaces/${workspacePublicId}/members/${memberUserPublicId}`,
    membersLeave: (publicId: string) => `/api/v1/workspaces/${publicId}/members/leave`,
    transferOwnership: (publicId: string) => `/api/v1/workspaces/${publicId}/transfer-ownership`,
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
    widgetPublic: (publicId: string) => `/api/v1/workspaces/${publicId}/widget`,
    widgetManagement: (publicId: string) => `/api/v1/workspaces/${publicId}/widget/management`,
  },
  billing: {
    info: (publicId: string) => `/api/v1/workspaces/${publicId}/billing`,
    checkoutSession: (publicId: string) => `/api/v1/workspaces/${publicId}/billing/checkout-session`,
    portalSession: (publicId: string) => `/api/v1/workspaces/${publicId}/billing/portal-session`,
  },
  feedback: {
    workspaceList: (workspacePublicId: string) => `/api/v1/workspaces/${workspacePublicId}/feedbacks`,
    workspaceItem: (workspacePublicId: string, feedbackPublicId: string) =>
      `/api/v1/workspaces/${workspacePublicId}/feedbacks/${feedbackPublicId}`,
    workspaceOverview: (workspacePublicId: string) =>
      `/api/v1/workspaces/${workspacePublicId}/feedbacks/analytics/overview`,
    categories: (workspacePublicId: string) =>
      `/api/v1/workspaces/${workspacePublicId}/feedback-categories`,
    category: (workspacePublicId: string, categoryId: number) =>
      `/api/v1/workspaces/${workspacePublicId}/feedback-categories/${categoryId}`,
    publicSend: (workspacePublicId: string) =>
      `/api/v1/workspaces/${workspacePublicId}/send-feedback`,
  },
} as const;

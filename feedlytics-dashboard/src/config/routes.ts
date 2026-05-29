/**
 * Typed route constants. Use these instead of hard-coded strings so a rename
 * is a single find-and-replace.
 */
export const routes = {
  home: "/",
  login: "/login",
  signup: "/signup",
  verifyEmail: "/signup/verify",
  /** Workspace list */
  workspaces: "/workspaces",
  /** Single workspace (dashboard, feedbacks, …). */
  workspace: (publicId: string) => `/workspaces/${publicId}`,
  workspaceSettings: (publicId: string) => `/workspaces/${publicId}/settings`,
  workspaceWidget: (publicId: string) => `/workspaces/${publicId}/widget`,
  workspaceApiSettings: (publicId: string) => `/workspaces/${publicId}/api-settings`,
  workspaceFeedbacks: (publicId: string) => `/workspaces/${publicId}/feedbacks`,
  workspaceTeam: (publicId: string) => `/workspaces/${publicId}/team`,
  workspaceBilling: (publicId: string) => `/workspaces/${publicId}/billing`,
} as const;

/** URL path prefixes that require an authenticated session (client gate). */
export const protectedPathPrefixes = [routes.workspaces] as const;

export function isProtectedPath(pathname: string): boolean {
  return protectedPathPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export type AppRoute = (typeof routes)[keyof typeof routes];

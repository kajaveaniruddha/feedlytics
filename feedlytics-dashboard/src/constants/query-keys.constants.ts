/**
 * Central registry of TanStack Query cache keys.
 *
 * Any two callers asking for the same resource MUST use the same key so
 * requests are deduplicated by the QueryClient. Add new keys here, never
 * inline them in hooks.
 */
export const queryKeys = {
  user: {
    root: ["user"] as const,
    me: () => ["user", "me"] as const,
  },
  auth: {
    root: ["auth"] as const,
    session: () => ["auth", "session"] as const,
  },
  workspace: {
    root: ["workspace"] as const,
    list: () => ["workspace", "list"] as const,
    byId: (id: string) => ["workspace", "detail", id] as const,
    members: (publicId: string) => ["workspace", "members", publicId] as const,
    overview: (publicId: string) => ["workspace", "overview", publicId] as const,
    planUsage: (publicId: string) => ["workspace", "plan-usage", publicId] as const,
    feedbacksRoot: (publicId: string) => ["workspace", "feedbacks", publicId] as const,
    feedbacks: (publicId: string, page: number, size: number) =>
      ["workspace", "feedbacks", publicId, page, size] as const,
    feedbackCategories: (publicId: string) => ["workspace", "feedback-categories", publicId] as const,
    integration: (publicId: string) => ["workspace", "integration", publicId] as const,
    widgetManagement: (publicId: string) => ["workspace", "widget-management", publicId] as const,
    billing: (publicId: string) => ["workspace", "billing", publicId] as const,
  },
  invites: {
    root: ["invites"] as const,
    pending: () => ["invites", "pending"] as const,
  },
} as const;

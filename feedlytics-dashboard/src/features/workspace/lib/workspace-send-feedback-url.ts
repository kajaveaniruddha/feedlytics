import { env } from "@/config/env";

export function workspaceSendFeedbackUrl(workspacePublicId: string): string {
  const base = env.apiBaseUrl.replace(/\/$/, "");
  return `${base}/api/v1/workspaces/${workspacePublicId}/send-feedback`;
}

import type { WorkspaceRole } from "@/features/workspace/types/workspace.types";

const workspaceRoleLabels: Record<WorkspaceRole, string> = {
  OWNER: "Owner",
  ADMIN: "Admin",
  MEMBER: "Member",
};

export function formatWorkspaceRole(role: WorkspaceRole): string {
  return workspaceRoleLabels[role];
}

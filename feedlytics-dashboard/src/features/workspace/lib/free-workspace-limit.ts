import { MAX_FREE_OWNED_WORKSPACES } from "@/features/workspace/constants/workspace.constants";

import type { WorkspaceData } from "@/features/workspace/types/workspace.types";

export function countOwnedFreeWorkspaces(workspaces: readonly WorkspaceData[]): number {
  return workspaces.filter((w) => w.role === "OWNER" && w.plan === "FREE").length;
}

export function isAtFreeWorkspaceCreationLimit(workspaces: readonly WorkspaceData[]): boolean {
  return countOwnedFreeWorkspaces(workspaces) >= MAX_FREE_OWNED_WORKSPACES;
}

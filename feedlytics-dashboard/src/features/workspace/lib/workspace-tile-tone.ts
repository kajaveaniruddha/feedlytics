import type { WorkspaceTileIconTone } from "@/components/layout/WorkspaceTileIcon";
import type { WorkspaceData } from "@/features/workspace/types/workspace.types";

export function workspaceTileTone(workspace: WorkspaceData): WorkspaceTileIconTone {
  if (workspace.plan === "BUSINESS") return "gradient";
  if (workspace.plan === "PRO") return "brand";
  if (workspace.plan === "ARCHIVED") return "muted";
  if (workspace.plan === "FREE" && workspace.role === "MEMBER") return "muted";
  return "brand";
}

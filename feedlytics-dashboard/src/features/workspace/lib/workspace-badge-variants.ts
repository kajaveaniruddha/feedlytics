import type { VariantProps } from "class-variance-authority";

import { badgeVariants } from "@/components/ui/badge";
import type { WorkspacePlan, WorkspaceRole } from "@/features/workspace/types/workspace.types";

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

export function workspacePlanBadgeVariant(plan: WorkspacePlan): BadgeVariant {
  switch (plan) {
    case "FREE":
      return "workspacePlanFree";
    case "PRO":
      return "workspacePlanPro";
    case "BUSINESS":
      return "workspacePlanBusiness";
    case "ARCHIVED":
      return "workspacePlanArchived";
    default: {
      const _exhaustive: never = plan;
      return _exhaustive;
    }
  }
}

export function workspaceRoleBadgeVariant(role: WorkspaceRole): BadgeVariant {
  switch (role) {
    case "OWNER":
      return "workspaceRoleOwner";
    case "ADMIN":
      return "workspaceRoleAdmin";
    case "MEMBER":
      return "workspaceRoleMember";
    default: {
      const _exhaustive: never = role;
      return _exhaustive;
    }
  }
}

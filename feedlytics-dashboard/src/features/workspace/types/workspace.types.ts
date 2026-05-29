export type WorkspacePlan = "FREE" | "PRO" | "BUSINESS" | "ARCHIVED";

export type WorkspaceRole = "OWNER" | "ADMIN" | "MEMBER";

export type MemberStatus = "ACTIVE" | "FROZEN";

export type WorkspaceData = {
  publicId: string;
  name: string;
  description: string | null;
  plan: WorkspacePlan;
  role: WorkspaceRole;
  status: MemberStatus;
  memberCount: number;
  maxMembers: number;
  feedbackCount: number;
  avgRating: number | null;
  createdAt: string;
};

export type WorkspaceListResponse = {
  success: boolean;
  workspaces: WorkspaceData[];
};

export type WorkspaceSingleResponse = {
  success: boolean;
  message?: string | null;
  workspace: WorkspaceData;
};

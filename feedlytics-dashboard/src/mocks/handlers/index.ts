import { authHappyPathHandlers } from "./auth.handlers";
import { feedbackWorkspaceOverviewHandlers } from "./feedbackWorkspace.handlers";
import { userHappyPathHandlers } from "./user.handlers";
import { workspaceHappyPathHandlers } from "./workspace.handlers";

export const handlers = [
  ...authHappyPathHandlers,
  ...userHappyPathHandlers,
  ...workspaceHappyPathHandlers,
  ...feedbackWorkspaceOverviewHandlers,
];

export * from "./auth.handlers";
export * from "./feedbackWorkspace.handlers";
export * from "./user.handlers";
export * from "./workspace.handlers";

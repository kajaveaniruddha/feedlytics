import type { Meta, StoryObj } from "@storybook/nextjs";
import { http, HttpResponse } from "msw";

import { env } from "@/config/env";
import { withAuthSession } from "@/mocks/decorators/withAuthSession";
import {
  feedbackWorkspaceDeleteHandlers,
  feedbackWorkspaceListEmptyHandlers,
  feedbackWorkspaceListErrorHandlers,
  feedbackWorkspaceListHandlers,
} from "@/mocks/handlers/feedbackWorkspace.handlers";
import { userHappyPathHandlers } from "@/mocks/handlers/user.handlers";
import { workspaceHappyPathHandlers } from "@/mocks/handlers/workspace.handlers";
import { workspaceListFixture } from "@/mocks/fixtures/workspace.fixture";
import { endpoints } from "@/services/api/endpoints";

import { WorkspaceFeedbacksPageContent } from "./WorkspaceFeedbacksPageContent";

const workspacePublicId = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
const url = (path: string) => `${env.apiBaseUrl}${path}`;

const memberWorkspaceDetailHandler = http.get(
  url(endpoints.workspace.byId(":publicId")),
  () =>
    HttpResponse.json({
      success: true,
      workspace: { ...workspaceListFixture[0], role: "MEMBER" as const },
    }),
);

const meta: Meta<typeof WorkspaceFeedbacksPageContent> = {
  title: "Workspace/Feedbacks/WorkspaceFeedbacksPageContent",
  component: WorkspaceFeedbacksPageContent,
  args: { workspacePublicId },
  parameters: {
    layout: "fullscreen",
    msw: {
      handlers: [
        ...userHappyPathHandlers,
        ...workspaceHappyPathHandlers,
        ...feedbackWorkspaceListHandlers,
        ...feedbackWorkspaceDeleteHandlers,
      ],
    },
    nextjs: {
      navigation: {
        pathname: `/workspaces/${workspacePublicId}/feedbacks`,
      },
    },
  },
  decorators: [
    withAuthSession,
    (Story) => (
      <div className="min-h-screen w-full bg-bg">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof WorkspaceFeedbacksPageContent>;

export const OwnerCanDelete: Story = {};

export const MemberReadOnly: Story = {
  parameters: {
    msw: {
      handlers: [
        ...userHappyPathHandlers,
        memberWorkspaceDetailHandler,
        ...feedbackWorkspaceListHandlers,
        ...feedbackWorkspaceDeleteHandlers,
      ],
    },
  },
};

export const EmptyState: Story = {
  parameters: {
    msw: {
      handlers: [
        ...userHappyPathHandlers,
        ...workspaceHappyPathHandlers,
        ...feedbackWorkspaceListEmptyHandlers,
        ...feedbackWorkspaceDeleteHandlers,
      ],
    },
  },
};

export const ListError: Story = {
  parameters: {
    msw: {
      handlers: [
        ...userHappyPathHandlers,
        ...workspaceHappyPathHandlers,
        ...feedbackWorkspaceListErrorHandlers,
      ],
    },
  },
};

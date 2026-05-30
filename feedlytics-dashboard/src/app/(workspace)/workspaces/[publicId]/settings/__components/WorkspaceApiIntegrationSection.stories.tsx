import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, waitFor, within } from "storybook/test";

import { withAuthSession } from "@/mocks/decorators/withAuthSession";
import {
  workspaceIntegrationForbiddenHandlers,
  workspaceIntegrationHappyHandlers,
} from "@/mocks/handlers/workspaceIntegration.handlers";

import { WorkspaceApiIntegrationSection } from "./WorkspaceApiIntegrationSection";

const meta: Meta<typeof WorkspaceApiIntegrationSection> = {
  title: "Workspace/WorkspaceApiIntegrationSection",
  component: WorkspaceApiIntegrationSection,
  args: { workspacePublicId: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee" },
  parameters: {
    layout: "padded",
    msw: { handlers: workspaceIntegrationHappyHandlers },
    nextjs: {
      navigation: {
        pathname: "/workspaces/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee/api-settings",
      },
    },
  },
  decorators: [
    withAuthSession,
    (Story) => (
      <div className="min-h-[480px] w-full max-w-3xl bg-bg p-6">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof WorkspaceApiIntegrationSection>;

export const HappyPath: Story = {};

export const ForbiddenForMember: Story = {
  parameters: { msw: { handlers: workspaceIntegrationForbiddenHandlers } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(canvas.getByText(/only workspace owners and admins can manage api keys/i)).toBeInTheDocument(),
    );
  },
};

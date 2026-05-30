import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, waitFor, within } from "storybook/test";

import { withAuthSession } from "@/mocks/decorators/withAuthSession";
import {
  workspaceIntegrationForbiddenHandlers,
  workspaceIntegrationHappyHandlers,
} from "@/mocks/handlers/workspaceIntegration.handlers";

import { WorkspaceWidgetIntegrationSection } from "./WorkspaceWidgetIntegrationSection";

const meta: Meta<typeof WorkspaceWidgetIntegrationSection> = {
  title: "Workspace/WorkspaceWidgetIntegrationSection",
  component: WorkspaceWidgetIntegrationSection,
  args: { workspacePublicId: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee" },
  parameters: {
    layout: "padded",
    msw: { handlers: workspaceIntegrationHappyHandlers },
    nextjs: {
      navigation: {
        pathname: "/workspaces/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee/widget",
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

type Story = StoryObj<typeof WorkspaceWidgetIntegrationSection>;

export const HappyPath: Story = {};

export const ForbiddenForMember: Story = {
  parameters: { msw: { handlers: workspaceIntegrationForbiddenHandlers } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(
        canvas.getByText(/only workspace owners and admins can manage the widget secret/i),
      ).toBeInTheDocument(),
    );
  },
};

import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, waitFor, within } from "storybook/test";

import { withAuthSession } from "@/mocks/decorators/withAuthSession";
import {
  workspaceWidgetManagementForbiddenHandlers,
  workspaceWidgetManagementHappyHandlers,
} from "@/mocks/handlers/workspaceWidget.handlers";

import { WorkspaceWidgetAppearanceSection } from "./WorkspaceWidgetAppearanceSection";

const meta: Meta<typeof WorkspaceWidgetAppearanceSection> = {
  title: "Workspace/WorkspaceWidgetAppearanceSection",
  component: WorkspaceWidgetAppearanceSection,
  args: { workspacePublicId: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee" },
  parameters: {
    layout: "padded",
    msw: { handlers: workspaceWidgetManagementHappyHandlers },
    nextjs: {
      navigation: {
        pathname: "/workspaces/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee/widget",
      },
    },
  },
  decorators: [
    withAuthSession,
    (Story) => (
      <div className="min-h-[640px] w-full max-w-6xl bg-bg p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof WorkspaceWidgetAppearanceSection>;

export const HappyPath: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText(/customize appearance/i)).toBeInTheDocument());
  },
};

export const ForbiddenForMember: Story = {
  parameters: { msw: { handlers: workspaceWidgetManagementForbiddenHandlers } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(
        canvas.getByText(/only workspace owners and admins can customize the widget appearance/i),
      ).toBeInTheDocument(),
    );
  },
};

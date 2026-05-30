import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, userEvent, waitFor, within } from "storybook/test";

import { withAuthSession } from "@/mocks/decorators/withAuthSession";
import {
  workspaceIntegrationForbiddenHandlers,
  workspaceIntegrationHappyHandlers,
  workspaceIntegrationValidationErrorHandlers,
} from "@/mocks/handlers/workspaceIntegration.handlers";

import { WorkspaceAllowedOriginsSection } from "./WorkspaceAllowedOriginsSection";

const meta: Meta<typeof WorkspaceAllowedOriginsSection> = {
  title: "Workspace/WorkspaceAllowedOriginsSection",
  component: WorkspaceAllowedOriginsSection,
  args: { workspacePublicId: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee" },
  parameters: {
    layout: "padded",
    msw: { handlers: workspaceIntegrationHappyHandlers },
    nextjs: {
      navigation: {
        pathname: "/workspaces/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee/settings",
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

type Story = StoryObj<typeof WorkspaceAllowedOriginsSection>;

export const HappyPath: Story = {};

export const ForbiddenForMember: Story = {
  parameters: { msw: { handlers: workspaceIntegrationForbiddenHandlers } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(
        canvas.getByText(/only workspace owners and admins can manage allowed origins/i),
      ).toBeInTheDocument(),
    );
  },
};

/** MSW returns 400 on save — user sees server error after a valid add + save. */
export const SaveServerValidationError: Story = {
  parameters: { msw: { handlers: workspaceIntegrationValidationErrorHandlers } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByLabelText(/add origin url/i)).toBeInTheDocument());
    await userEvent.type(canvas.getByLabelText(/add origin url/i), "https://example.com");
    await userEvent.click(canvas.getByRole("button", { name: /^add$/i }));
    await waitFor(() => expect(canvas.getByRole("button", { name: /save changes/i })).toBeEnabled());
    await userEvent.click(canvas.getByRole("button", { name: /save changes/i }));
    await waitFor(() =>
      expect(document.body.textContent).toMatch(/origin must use http or https|invalid_origin/i),
    );
  },
};

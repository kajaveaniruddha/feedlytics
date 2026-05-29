import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, waitFor, within } from "storybook/test";

import { withAuthSession } from "@/mocks/decorators/withAuthSession";
import { userHappyPathHandlers } from "@/mocks/handlers/user.handlers";
import { workspaceHappyPathHandlers } from "@/mocks/handlers/workspace.handlers";
import {
  billingBusinessHandlers,
  billingErrorHandlers,
  billingFreeHandlers,
  billingProHandlers,
} from "@/mocks/handlers/workspaceBilling.handlers";

import { WorkspaceBillingPageContent } from "./WorkspaceBillingPageContent";

const meta: Meta<typeof WorkspaceBillingPageContent> = {
  title: "Workspace/Billing/WorkspaceBillingPageContent",
  component: WorkspaceBillingPageContent,
  args: { workspacePublicId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa" },
  parameters: {
    layout: "fullscreen",
    nextjs: {
      navigation: {
        pathname: "/workspaces/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/billing",
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

type Story = StoryObj<typeof WorkspaceBillingPageContent>;

export const FreePlan: Story = {
  parameters: {
    msw: {
      handlers: [
        ...userHappyPathHandlers,
        ...workspaceHappyPathHandlers,
        ...billingFreeHandlers,
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByRole("heading", { name: /billing/i })).toBeInTheDocument());
    await waitFor(() => expect(canvas.getByText(/choose a plan/i)).toBeInTheDocument());
    await waitFor(() => expect(canvas.getByText(/most popular/i)).toBeInTheDocument());
  },
};

export const ProMonthly: Story = {
  parameters: {
    msw: {
      handlers: [
        ...userHappyPathHandlers,
        ...workspaceHappyPathHandlers,
        ...billingProHandlers,
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByRole("heading", { name: /billing/i })).toBeInTheDocument());
    await waitFor(() => expect(canvas.getByText(/current subscription/i)).toBeInTheDocument());
    await waitFor(() => expect(canvas.getByText(/manage subscription/i)).toBeInTheDocument());
  },
};

export const BusinessYearly: Story = {
  parameters: {
    msw: {
      handlers: [
        ...userHappyPathHandlers,
        ...workspaceHappyPathHandlers,
        ...billingBusinessHandlers,
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByRole("heading", { name: /billing/i })).toBeInTheDocument());
    await waitFor(() => expect(canvas.getByText(/current subscription/i)).toBeInTheDocument());
  },
};

export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [
        ...userHappyPathHandlers,
        ...workspaceHappyPathHandlers,
        ...billingErrorHandlers,
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText(/try again/i)).toBeInTheDocument());
  },
};

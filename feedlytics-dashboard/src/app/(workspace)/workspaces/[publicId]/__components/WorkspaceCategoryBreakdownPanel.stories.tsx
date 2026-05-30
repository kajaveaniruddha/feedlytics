import type { Meta, StoryObj } from "@storybook/nextjs";

import {
  workspaceOverviewFixture,
  workspaceOverviewNotConfiguredFixture,
} from "@/mocks/fixtures/workspace-overview.fixture";

import { WorkspaceCategoryBreakdownPanel } from "./WorkspaceCategoryBreakdownPanel";

const meta: Meta<typeof WorkspaceCategoryBreakdownPanel> = {
  title: "Workspace/WorkspaceCategoryBreakdownPanel",
  component: WorkspaceCategoryBreakdownPanel,
  args: {
    workspacePublicId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  },
  parameters: {
    layout: "padded",
    nextjs: {
      navigation: {
        pathname: "/workspaces/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-[360px] w-full max-w-md bg-bg p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof WorkspaceCategoryBreakdownPanel>;

export const Ready: Story = {
  args: {
    categories: workspaceOverviewFixture.categories,
  },
};

export const NotConfigured: Story = {
  args: {
    categories: workspaceOverviewNotConfiguredFixture.categories,
  },
};

export const ManyCategories: Story = {
  args: {
    categories: {
      state: "READY",
      items: Array.from({ length: 8 }, (_, index) => ({
        id: 100 + index,
        name: `Category ${index + 1} — ${["Alpha", "βeta", "γ-amínos", "🎯 Goals"][index % 4]}`,
        feedbackCount: 8 - index,
      })),
      otherCount: 3,
      message: null,
    },
  },
};

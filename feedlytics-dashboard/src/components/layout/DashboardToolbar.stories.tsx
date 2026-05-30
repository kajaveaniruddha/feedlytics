import type { Meta, StoryObj } from "@storybook/nextjs";

import { DashboardToolbar } from "./DashboardToolbar";

const meta: Meta<typeof DashboardToolbar> = {
  title: "Layout/DashboardToolbar",
  component: DashboardToolbar,
};
export default meta;

type Story = StoryObj<typeof DashboardToolbar>;

export const Default: Story = {
  render: () => (
    <DashboardToolbar
      leading={<span className="text-sm font-bold text-navy-700 dark:text-white">Brand</span>}
      trailing={<span className="text-sm text-secondary-gray-600">Actions</span>}
    />
  ),
};

export const TrailingOnly: Story = {
  render: () => (
    <DashboardToolbar trailing={<span className="text-sm text-secondary-gray-600">Search and profile</span>} />
  ),
};

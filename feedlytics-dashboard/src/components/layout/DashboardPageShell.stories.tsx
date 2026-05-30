import type { Meta, StoryObj } from "@storybook/nextjs";

import { DashboardPageShell } from "./DashboardPageShell";

const meta: Meta<typeof DashboardPageShell> = {
  title: "Layout/DashboardPageShell",
  component: DashboardPageShell,
};
export default meta;

type Story = StoryObj<typeof DashboardPageShell>;

export const Default: Story = {
  render: () => (
    <DashboardPageShell>
      <p className="text-sm text-navy-700 dark:text-white">Page content sits inside the shell.</p>
    </DashboardPageShell>
  ),
};

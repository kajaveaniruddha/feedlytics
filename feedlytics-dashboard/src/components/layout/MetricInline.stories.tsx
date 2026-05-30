import type { Meta, StoryObj } from "@storybook/nextjs";
import { UsersIcon } from "lucide-react";

import { MetricInline } from "./MetricInline";

const meta: Meta<typeof MetricInline> = {
  title: "Layout/MetricInline",
  component: MetricInline,
};
export default meta;

type Story = StoryObj<typeof MetricInline>;

export const Default: Story = {
  render: () => (
    <MetricInline icon={<UsersIcon strokeWidth={2} aria-hidden />}>5 members</MetricInline>
  ),
};

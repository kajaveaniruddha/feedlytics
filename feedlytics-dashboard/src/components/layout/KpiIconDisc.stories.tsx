import type { Meta, StoryObj } from "@storybook/nextjs";
import { MessageSquareIcon } from "lucide-react";

import { KpiIconDisc } from "./KpiIconDisc";

const meta: Meta<typeof KpiIconDisc> = {
  title: "Layout/KpiIconDisc",
  component: KpiIconDisc,
};
export default meta;

type Story = StoryObj<typeof KpiIconDisc>;

export const Default: Story = {
  render: () => (
    <KpiIconDisc>
      <MessageSquareIcon strokeWidth={2} />
    </KpiIconDisc>
  ),
};

export const OnGradient: Story = {
  render: () => (
    <div className="flex rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 p-6">
      <KpiIconDisc variant="onGradient">
        <MessageSquareIcon strokeWidth={2} />
      </KpiIconDisc>
    </div>
  ),
};

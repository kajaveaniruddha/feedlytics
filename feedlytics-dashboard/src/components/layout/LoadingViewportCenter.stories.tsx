import type { Meta, StoryObj } from "@storybook/nextjs";

import { LoadingViewportCenter } from "./LoadingViewportCenter";

const meta: Meta<typeof LoadingViewportCenter> = {
  title: "Layout/LoadingViewportCenter",
  component: LoadingViewportCenter,
  args: { label: "Loading" },
};
export default meta;

type Story = StoryObj<typeof LoadingViewportCenter>;

export const Default: Story = {};

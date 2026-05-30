import type { Meta, StoryObj } from "@storybook/nextjs";

import { Input } from "@/components/ui/input";

import { SearchFieldShell } from "./SearchFieldShell";

const meta: Meta<typeof SearchFieldShell> = {
  title: "Layout/SearchFieldShell",
  component: SearchFieldShell,
  args: {
    preset: "search",
    minWidth: "toolbar",
    children: <Input variant="searchInset" type="search" placeholder="Search" aria-label="Search" />,
  },
};
export default meta;

type Story = StoryObj<typeof SearchFieldShell>;

export const Default: Story = {};

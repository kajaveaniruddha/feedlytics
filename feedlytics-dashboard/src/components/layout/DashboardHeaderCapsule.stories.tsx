import type { Meta, StoryObj } from "@storybook/nextjs";

import { Input } from "@/components/ui/input";

import { DashboardHeaderCapsule } from "./DashboardHeaderCapsule";
import { SearchFieldShell } from "./SearchFieldShell";

const meta: Meta<typeof DashboardHeaderCapsule> = {
  title: "Layout/DashboardHeaderCapsule",
  component: DashboardHeaderCapsule,
  args: {
    userInitials: "JD",
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl bg-secondary-gray-100 p-6 dark:bg-navy-900">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof DashboardHeaderCapsule>;

export const WithSearch: Story = {
  args: {
    showSearch: true,
    search: (
      <SearchFieldShell
        preset="search"
        minWidth="toolbar"
        className="h-auto min-h-8 flex-1 border-0 bg-transparent px-1 py-0 shadow-none dark:bg-transparent dark:shadow-none md:min-w-[190px]"
      >
        <Input type="search" variant="searchInset" placeholder="Search" aria-label="Search" />
      </SearchFieldShell>
    ),
  },
};

export const ActionsOnly: Story = {
  args: {
    showSearch: false,
  },
};

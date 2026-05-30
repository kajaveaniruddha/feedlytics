import type { Meta, StoryObj } from "@storybook/nextjs";

import { Input } from "./input";

const meta: Meta<typeof Input> = {
  title: "UI/Atoms/Input",
  component: Input,
  args: {
    placeholder: "mail@feedlytics.com",
    variant: "auth",
    size: "lg",
  },
  argTypes: {
    variant: { control: "select", options: ["auth", "main", "search", "searchInset"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
  decorators: [
    (Story) => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Auth: Story = { args: { variant: "auth" } };
export const Main: Story = { args: { variant: "main" } };
export const Search: Story = { args: { variant: "search", placeholder: "Search…" } };

export const SearchInset: Story = {
  args: { variant: "searchInset", placeholder: "Search", type: "search" },
  decorators: [
    (Story) => (
      <div className="flex h-9 max-w-[240px] items-center gap-2 rounded-full bg-surface px-4 shadow-card">
        <Story />
      </div>
    ),
  ],
};
export const Invalid: Story = { args: { variant: "auth", "aria-invalid": true, defaultValue: "invalid-email" } };
export const Disabled: Story = { args: { variant: "auth", disabled: true, defaultValue: "ada@feedlytics.com" } };

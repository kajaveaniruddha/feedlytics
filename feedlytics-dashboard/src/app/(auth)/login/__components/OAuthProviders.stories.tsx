import type { Meta, StoryObj } from "@storybook/nextjs";

import { OAuthProviders } from "./OAuthProviders";

const meta: Meta<typeof OAuthProviders> = {
  title: "Auth/Login/OAuthProviders",
  component: OAuthProviders,
  decorators: [
    (Story) => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof OAuthProviders>;
export const Basic: Story = {};

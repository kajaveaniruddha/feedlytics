import type { Meta, StoryObj } from "@storybook/nextjs";

import { PasswordStrengthMeter } from "./PasswordStrengthMeter";

const meta: Meta<typeof PasswordStrengthMeter> = {
  title: "Auth/PasswordStrengthMeter",
  component: PasswordStrengthMeter,
  decorators: [
    (Story) => (
      <div className="w-[360px]">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof PasswordStrengthMeter>;

export const Empty: Story = { args: { password: "" } };
export const TooShort: Story = { args: { password: "abc" } };
export const Weak: Story = { args: { password: "abcdefgh" } };
export const Okay: Story = { args: { password: "Abcdefgh" } };
export const Strong: Story = { args: { password: "Abcdefgh1" } };
export const Excellent: Story = { args: { password: "Abcdefgh1!" } };

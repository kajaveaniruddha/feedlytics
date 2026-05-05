import type { Meta, StoryObj } from "@storybook/nextjs";

import { RatingValue } from "./RatingValue";

const meta: Meta<typeof RatingValue> = {
  title: "Layout/RatingValue",
  component: RatingValue,
};
export default meta;

type Story = StoryObj<typeof RatingValue>;

export const WithRating: Story = { args: { value: 4.5 } };

export const Empty: Story = { args: { value: null } };

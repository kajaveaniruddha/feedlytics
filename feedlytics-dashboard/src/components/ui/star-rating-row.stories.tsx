import type { Meta, StoryObj } from "@storybook/nextjs";

import { StarRatingRow } from "./star-rating-row";

const meta: Meta<typeof StarRatingRow> = {
  title: "UI/StarRatingRow",
  component: StarRatingRow,
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof StarRatingRow>;

export const FiveStars: Story = { args: { rating: 5 } };
export const FourStars: Story = { args: { rating: 4 } };
export const TwoStars: Story = { args: { rating: 2 } };

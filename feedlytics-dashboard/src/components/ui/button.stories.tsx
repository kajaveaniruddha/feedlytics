import type { Meta, StoryObj } from "@storybook/nextjs";

import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "UI/Atoms/Button",
  component: Button,
  args: {
    children: "Sign In",
    variant: "brand",
    size: "lg",
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "brand",
        "darkBrand",
        "lightBrand",
        "light",
        "outline",
        "ghost",
        "action",
        "setup",
        "cta",
        "bannerCta",
        "destructive",
        "link",
      ],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "icon", "icon-sm", "icon-lg"],
    },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Brand: Story = { args: { variant: "brand" } };
export const DarkBrand: Story = { args: { variant: "darkBrand" } };
export const LightBrand: Story = { args: { variant: "lightBrand" } };
export const Light: Story = { args: { variant: "light", children: "Sign in with Google" } };
export const Outline: Story = { args: { variant: "outline" } };
export const Ghost: Story = { args: { variant: "ghost" } };
export const Action: Story = { args: { variant: "action", children: "Filter" } };
export const Setup: Story = { args: { variant: "setup", children: "Add step" } };
export const Destructive: Story = { args: { variant: "destructive", children: "Delete" } };
export const LinkVariant: Story = { args: { variant: "link", children: "Forgot password?" } };

/** Horizon marketing / boilerplate “Get started now” CTA — pill + depth shadow */
export const CtaLanding: Story = {
  args: {
    variant: "cta",
    size: "xl",
    children: "Get started now",
  },
};

/** White pill on purple gradient — workspace banner CTA */
export const BannerCta: Story = {
  render: () => (
    <div className="rounded-[20px] bg-gradient-to-br from-[#868CFF] to-brand-500 p-8">
      <Button variant="bannerCta" size="lg">
        Open Widget Editor
      </Button>
    </div>
  ),
};

export const LoadingBrand: Story = {
  args: { loading: true, children: "Signing in…" },
};

export const LoadingLightWithLeading: Story = {
  args: {
    variant: "light",
    loading: true,
    leading: (
      <svg aria-hidden viewBox="0 0 24 24" className="size-5">
        <circle cx="12" cy="12" r="10" fill="currentColor" />
      </svg>
    ),
    children: "Sign in with Google",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {(
        [
          "brand",
          "darkBrand",
          "lightBrand",
          "light",
          "outline",
          "ghost",
          "action",
          "setup",
          "destructive",
        "cta",
        "bannerCta",
        ] as const
      ).map((v) => (
        <Button key={v} variant={v} size={v === "cta" ? "xl" : "lg"}>
          {v}
        </Button>
      ))}
    </div>
  ),
};

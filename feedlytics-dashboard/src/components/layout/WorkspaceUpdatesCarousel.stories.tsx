import type { Meta, StoryObj } from "@storybook/nextjs";

import { workspaceUpdateSlides } from "@/app/(workspace)/workspaces/[publicId]/__components/workspace-updates.slides";

import { WorkspaceUpdatesCarousel } from "./WorkspaceUpdatesCarousel";

const demoSlides = workspaceUpdateSlides("demo-workspace");

const meta: Meta<typeof WorkspaceUpdatesCarousel> = {
  title: "Layout/WorkspaceUpdatesCarousel",
  component: WorkspaceUpdatesCarousel,
  args: {
    slides: demoSlides,
  },
  parameters: {
    layout: "padded",
    nextjs: {
      navigation: {
        pathname: "/workspaces/demo-workspace",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof WorkspaceUpdatesCarousel>;

export const Default: Story = {};

export const ExternalCta: Story = {
  args: {
    slides: demoSlides.map((s, i) =>
      i === 0 ? { ...s, href: "https://example.com/widget", id: `${s.id}-ext` } : s,
    ),
  },
};

import type { Preview } from "@storybook/nextjs";
import { initialize } from "msw-storybook-addon";

import { withProviders } from "./decorators/withProviders";
import { withRouter } from "./decorators/withRouter";
import { withMswLoader } from "./decorators/withMsw";

import "../src/app/globals.css";

initialize({
  onUnhandledRequest: "bypass",
});

const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: "Horizon light",
      values: [
        { name: "Horizon light", value: "#F4F7FE" },
        { name: "Horizon dark", value: "#0b1437" },
      ],
    },
  },
  globalTypes: {
    theme: {
      description: "Horizon theme",
      defaultValue: "light",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [withProviders, withRouter],
  loaders: [withMswLoader],
  tags: ["autodocs"],
};

export default preview;

import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  env: (config) => ({
    ...config,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID:
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ??
      "storybook-placeholder.apps.googleusercontent.com",
  }),
  stories: ["../src/**/*.stories.@(ts|tsx|mdx)"],
  addons: [
    "@storybook/addon-a11y",
  ],
  staticDirs: ["../public"],
  typescript: {
    check: false,
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
};

export default config;

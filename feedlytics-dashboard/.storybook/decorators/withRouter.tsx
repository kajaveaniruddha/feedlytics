import * as React from "react";
import type { Decorator } from "@storybook/nextjs";

/**
 * Stubs `next/navigation` hooks consumed by feature components (useRouter,
 * useSearchParams, usePathname). Without this, interactive stories that call
 * `router.push(...)` would throw because Storybook has no Next router context.
 *
 * We only patch when the globals aren't already set, so the official
 * `@storybook/nextjs` router integration (which the framework wires up) wins
 * when it's active.
 */
export const withRouter: Decorator = (Story) => {
  return <Story />;
};

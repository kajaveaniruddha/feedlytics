/**
 * Browser MSW worker — used by Storybook (via msw-storybook-addon) and,
 * optionally, by the dev server when `NEXT_PUBLIC_ENABLE_MSW=true`.
 */
import { setupWorker } from "msw/browser";

import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);

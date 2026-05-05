/**
 * Node MSW server — reserved for Vitest / integration tests. Not wired into
 * any runtime path today; kept so tests can reuse the same handlers.
 */
import { setupServer } from "msw/node";

import { handlers } from "./handlers";

export const server = setupServer(...handlers);

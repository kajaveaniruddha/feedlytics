import * as React from "react";
import type { Decorator } from "@storybook/nextjs";

import { useAuthStore } from "@/stores/auth.store";

function MockAuthSessionProvider({ children }: { children: React.ReactNode }) {
  React.useLayoutEffect(() => {
    useAuthStore.getState().setSession({
      accessToken: "storybook-access-token",
      expiresAt: Date.now() + 86_400_000,
    });
    return () => {
      useAuthStore.getState().clearSession();
    };
  }, []);

  return <>{children}</>;
}

/**
 * Seeds an in-memory access token so hooks gated on `useAuthStore` run MSW-backed requests.
 */
export const withAuthSession: Decorator = (Story) => (
  <MockAuthSessionProvider>
    <Story />
  </MockAuthSessionProvider>
);

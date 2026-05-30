import * as React from "react";
import type { Decorator } from "@storybook/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

import { createQueryClient } from "@/lib/query/queryClient";
import { Toaster } from "@/components/ui/sonner";
import { SessionBootstrapProvider } from "@/features/auth/context/session-bootstrap";

// Same registration path as app `providers.tsx` (barrel is side-effect-free).
import "@/lib/oauth/strategies-register";

/**
 * A fresh QueryClient per story so cached mutations/queries never leak across
 * stories. Pairs with MSW decorators to give each story a deterministic
 * network environment.
 */
function StoryProviders({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: string;
}) {
  const [queryClient] = React.useState<QueryClient>(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SessionBootstrapProvider>
        <ThemeProvider
          attribute="class"
          forcedTheme={theme}
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="min-h-full bg-bg p-6 text-navy-700 dark:text-white">
            {children}
            <Toaster richColors position="top-right" />
          </div>
        </ThemeProvider>
      </SessionBootstrapProvider>
    </QueryClientProvider>
  );
}

export const withProviders: Decorator = (Story, context) => {
  const theme = (context.globals.theme as string) ?? "light";
  return (
    <StoryProviders theme={theme}>
      <Story />
    </StoryProviders>
  );
};

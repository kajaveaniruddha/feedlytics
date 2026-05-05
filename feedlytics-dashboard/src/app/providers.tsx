"use client";

/**
 * Root providers wrapper. Bundles:
 *   - TanStack QueryClient (one per browser session)
 *   - React Query Devtools (stripped in prod by the tree-shaking import guard)
 *   - next-themes (class="dark" strategy to match Horizon's dark surfaces)
 *   - Sonner Toaster (Horizon-styled via the atom in components/ui/sonner.tsx)
 *   - OAuth strategies (side-effect import of a tiny module — not the `@/lib/oauth` barrel)
 */
import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";

import { createQueryClient } from "@/lib/query/queryClient";
import { Toaster } from "@/components/ui/sonner";
import { SessionBootstrapProvider } from "@/features/auth/context/session-bootstrap";

// Registers OAuth strategies; kept separate from `@/lib/oauth` index for Fast Refresh.
import "@/lib/oauth/strategies-register";

export function Providers({ children }: { children: React.ReactNode }) {
  // Preserve the QueryClient across renders without recreating it.
  const [queryClient] = React.useState<QueryClient>(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SessionBootstrapProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </SessionBootstrapProvider>
      {process.env.NODE_ENV === "development" ? (
        <ReactQueryDevtools initialIsOpen={false} />
      ) : null}
    </QueryClientProvider>
  );
}


/**
 * Two-column auth shell mirroring horizon-ui-chakra/src/layouts/auth/Default.
 * Left column: auth form (via `children`). Right column: Horizon's signature
 * brand gradient illustration panel with the app wordmark.
 *
 * All Tailwind utilities for layout live here. Consumers (login / signup
 * routes) only pass children.
 */
import * as React from "react";

import { Heading } from "@/components/ui/heading";
import { APP_NAME } from "@/constants/app.constants";

type AuthSplitPaneProps = {
  children: React.ReactNode;
  illustrationHeadline?: string;
  illustrationSubhead?: string;
};

export function AuthSplitPane({
  children,
  illustrationHeadline = "Welcome to Feedlytics",
  illustrationSubhead = "Every voice. One inbox. Ship better products.",
}: AuthSplitPaneProps) {
  return (
    <div className="relative flex min-h-screen w-full bg-bg">
      <section className="flex w-full flex-col justify-center px-6 py-10 md:px-12 lg:w-1/2 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-[420px]">{children}</div>
      </section>

      <aside
        aria-hidden="true"
        className="relative hidden overflow-hidden lg:flex lg:w-1/2 lg:rounded-bl-[10%]"
      >
        {/* bg-linear-to-r from-pink-500 via-red-500 to-orange-500 */}
        <div className="auth-illustration-mesh absolute inset-0" />
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-6 px-12 text-center text-white">
          <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-white/70">
            <span className="inline-block size-2 rounded-full bg-white" />
            {APP_NAME}
          </div>
          <Heading variant="secondary">{illustrationHeadline}</Heading>
          <p className="max-w-sm leading-relaxed text-white/75">
            {illustrationSubhead}
          </p>
        </div>
      </aside>
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

import { Spinner } from "@/components/ui/spinner";

function LoginPageFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner size={32} aria-label="Loading" />
    </div>
  );
}

/**
 * Client-only: mobile Chrome (and some hosts) inject attributes such as
 * `__gcruniqueid` onto forms before hydration. Skipping SSR avoids that mismatch.
 */
const LoginFormLazy = dynamic(
  () => import("./LoginForm").then((mod) => ({ default: mod.LoginForm })),
  { ssr: false, loading: () => <LoginPageFallback /> },
);

/** `Suspense` is required for `useSearchParams` inside `LoginForm`. */
export function LoginFormDynamic() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginFormLazy />
    </Suspense>
  );
}

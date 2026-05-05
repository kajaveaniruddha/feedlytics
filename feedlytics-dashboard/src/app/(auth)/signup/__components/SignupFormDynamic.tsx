"use client";

import dynamic from "next/dynamic";

import { Spinner } from "@/components/ui/spinner";

function SignupPageFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner size={32} aria-label="Loading" />
    </div>
  );
}

const SignupFormLazy = dynamic(
  () => import("./SignupForm").then((mod) => ({ default: mod.SignupForm })),
  { ssr: false, loading: () => <SignupPageFallback /> },
);

export function SignupFormDynamic() {
  return <SignupFormLazy />;
}

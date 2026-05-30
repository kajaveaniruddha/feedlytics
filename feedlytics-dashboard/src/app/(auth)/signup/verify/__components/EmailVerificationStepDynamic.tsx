"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const EmailVerificationStepLazy = dynamic(
  () => import("../../__components/EmailVerificationStep").then((mod) => ({ default: mod.EmailVerificationStep })),
  { ssr: false, loading: () => null },
);

export function EmailVerificationStepDynamic() {
  return (
    <Suspense fallback={null}>
      <EmailVerificationStepLazy />
    </Suspense>
  );
}

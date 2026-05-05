import { Suspense } from "react";

import {
  DashboardAuthGate,
  DashboardAuthGateFallback,
} from "@/components/layout/DashboardAuthGate";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<DashboardAuthGateFallback />}>
      <DashboardAuthGate>{children}</DashboardAuthGate>
    </Suspense>
  );
}

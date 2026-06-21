import { Suspense } from "react";

import {
  DashboardAuthGate,
  DashboardAuthGateFallback,
} from "@/components/layout/DashboardAuthGate";
import { NotificationRealtimeSubscriber } from "@/features/notifications/components/NotificationRealtimeSubscriber";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<DashboardAuthGateFallback />}>
      <DashboardAuthGate>
        <NotificationRealtimeSubscriber />
        {children}
      </DashboardAuthGate>
    </Suspense>
  );
}

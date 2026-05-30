"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Spinner } from "@/components/ui/spinner";
import { routes } from "@/config/routes";
import { useSessionBootstrap } from "@/features/auth/context/session-bootstrap";
import { useAuthStore } from "@/stores/auth.store";

export function DashboardAuthGateFallback() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center">
      <Spinner size={32} aria-label="Loading" />
    </div>
  );
}

export function DashboardAuthGate({ children }: { children: React.ReactNode }) {
  const bootstrapStatus = useSessionBootstrap();
  const isAuthenticated = useAuthStore((s) => !!s.accessToken);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const nextTarget = React.useMemo(() => {
    const search = searchParams.toString();
    return pathname + (search ? `?${search}` : "");
  }, [pathname, searchParams]);

  React.useEffect(() => {
    if (bootstrapStatus !== "resolved" || isAuthenticated) return;
    router.replace(`${routes.login}?next=${encodeURIComponent(nextTarget)}`);
  }, [bootstrapStatus, isAuthenticated, nextTarget, router]);

  if (bootstrapStatus !== "resolved") {
    return <DashboardAuthGateFallback />;
  }

  if (!isAuthenticated) {
    return <DashboardAuthGateFallback />;
  }

  return children;
}

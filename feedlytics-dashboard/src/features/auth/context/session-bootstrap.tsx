"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/queryKeys";
import { authService } from "@/services/auth/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { useUserStore } from "@/stores/user.store";

export type SessionBootstrapStatus = "loading" | "resolved";

type SessionBootstrapContextValue = {
  status: SessionBootstrapStatus;
};

const SessionBootstrapContext = React.createContext<SessionBootstrapContextValue | null>(
  null,
);

export function SessionBootstrapProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = React.useState<SessionBootstrapStatus>("loading");
  const qc = useQueryClient();
  const setSession = useAuthStore((s) => s.setSession);
  const setUserMirror = useAuthStore((s) => s.setUserMirror);
  const clearSession = useAuthStore((s) => s.clearSession);
  const setProfile = useUserStore((s) => s.setProfile);

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await authService.refresh();
        if (cancelled) return;
        setSession({
          accessToken: data.accessToken,
          expiresAt: Date.now() + data.expiresIn * 1000,
        });
        setUserMirror(data.user.publicId);
        qc.setQueryData(queryKeys.user.me(), data.user);
        setProfile({
          ...data.user,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } catch {
        if (cancelled) return;
        clearSession();
      } finally {
        if (!cancelled) setStatus("resolved");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [clearSession, qc, setProfile, setSession, setUserMirror]);

  const value = React.useMemo(() => ({ status }), [status]);

  return (
    <SessionBootstrapContext.Provider value={value}>{children}</SessionBootstrapContext.Provider>
  );
}

export function useSessionBootstrap(): SessionBootstrapStatus {
  const ctx = React.useContext(SessionBootstrapContext);
  if (!ctx) {
    throw new Error("useSessionBootstrap must be used within SessionBootstrapProvider");
  }
  return ctx.status;
}

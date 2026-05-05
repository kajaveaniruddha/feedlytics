"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { routes } from "@/config/routes";
import type { LogoutResponse } from "@/features/auth/types/auth.types";
import { authService } from "@/services/auth/auth.service";
import { ApiError } from "@/services/api/errors/ApiError";
import { useAuthStore } from "@/stores/auth.store";
import { useUserStore } from "@/stores/user.store";

export function useLogout() {
  const clearSession = useAuthStore((s) => s.clearSession);
  const setProfile = useUserStore((s) => s.setProfile);
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation<LogoutResponse, ApiError, void>({
    mutationFn: () => authService.logout(),
    // Clear client-side state regardless of whether the server responded — we
    // never want to strand the UI in a half-logged-out state.
    onSettled: () => {
      clearSession();
      setProfile(null);
      qc.clear();
      router.push(routes.login);
    },
  });
}

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { queryKeys } from "@/lib/query/queryKeys";
import { routes } from "@/config/routes";
import { authService } from "@/services/auth/auth.service";
import { ApiError } from "@/services/api/errors/ApiError";
import { useAuthStore } from "@/stores/auth.store";
import { useUserStore } from "@/stores/user.store";
import { resolveErrorMessage } from "@/constants/errors.constants";

import type { LoginRequest } from "@/features/auth/schemas/login.schema";
import type { AuthResponse } from "@/features/auth/types/auth.types";

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  const setUserMirror = useAuthStore((s) => s.setUserMirror);
  const setProfile = useUserStore((s) => s.setProfile);
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation<AuthResponse, ApiError, LoginRequest>({
    mutationFn: (dto) => authService.login(dto),
    onSuccess: (data) => {
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
      router.push(routes.workspaces);
    },
    onError: (err, variables) => {
      if (err.isValidationError()) return;

      if (err.code === "EMAIL_NOT_VERIFIED") {
        toast.info(resolveErrorMessage(err.code, err.message));
        const qs = new URLSearchParams({
          email: variables.email.trim(),
          resend: "1",
          nonce: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
        });
        router.push(`${routes.verifyEmail}?${qs.toString()}`);
        return;
      }

      toast.error(resolveErrorMessage(err.code, err.message));
    },
  });
}

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

import type { SignupRequest } from "@/features/auth/schemas/signup.schema";
import type {
  AuthResponse,
  RegisterResult,
} from "@/features/auth/types/auth.types";

function isAuthResponse(result: RegisterResult): result is AuthResponse {
  return "accessToken" in result;
}

export function useRegister() {
  const setSession = useAuthStore((s) => s.setSession);
  const setUserMirror = useAuthStore((s) => s.setUserMirror);
  const setProfile = useUserStore((s) => s.setProfile);
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation<RegisterResult, ApiError, SignupRequest>({
    mutationFn: (dto) => authService.register(dto),
    onSuccess: (data, variables) => {
      if (isAuthResponse(data)) {
        // Auto-verified via invite: backend already set the refresh cookie.
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
      } else {
        // Verification required: hand off to /signup/verify with email prefilled.
        const qs = new URLSearchParams({ email: variables.email });
        router.push(`${routes.verifyEmail}?${qs.toString()}`);
      }
    },
    onError: (err) => {
      if (!err.isValidationError()) {
        toast.error(resolveErrorMessage(err.code, err.message));
      }
    },
  });
}

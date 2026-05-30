"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { routes } from "@/config/routes";
import { authService } from "@/services/auth/auth.service";
import { ApiError } from "@/services/api/errors/ApiError";
import { resolveErrorMessage } from "@/constants/errors.constants";

import type {
  RegenerateEmailCodeRequest,
  VerifyEmailRequest,
} from "@/features/auth/schemas/verify-email.schema";

export function useVerifyEmail() {
  const router = useRouter();
  return useMutation<{ success: true; message: string }, ApiError, VerifyEmailRequest>({
    mutationFn: (dto) => authService.verifyEmail(dto),
    onSuccess: () => {
      toast.success("Email verified. You can sign in now.");
      router.push(routes.login);
    },
    onError: (err) => toast.error(resolveErrorMessage(err.code, err.message)),
  });
}

export function useRegenerateEmailCode() {
  return useMutation<
    { success: true; message: string },
    ApiError,
    RegenerateEmailCodeRequest
  >({
    mutationFn: (dto) => authService.regenerateEmailCode(dto),
    onSuccess: () => toast.success("New code sent. Check your inbox."),
    onError: (err) => toast.error(resolveErrorMessage(err.code, err.message)),
  });
}

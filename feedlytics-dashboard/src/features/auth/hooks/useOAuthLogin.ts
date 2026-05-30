"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { queryKeys } from "@/lib/query/queryKeys";
import { routes } from "@/config/routes";
import { ApiError } from "@/services/api/errors/ApiError";
import { OAuthFactory } from "@/lib/oauth";
import { useAuthStore } from "@/stores/auth.store";
import { useUserStore } from "@/stores/user.store";
import { resolveErrorMessage } from "@/constants/errors.constants";

import type { AuthResponse, OAuthProviderKey } from "@/features/auth/types/auth.types";

type OAuthLoginPayload = {
  provider: OAuthProviderKey;
  inviteToken?: string;
};

export function useOAuthLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  const setUserMirror = useAuthStore((s) => s.setUserMirror);
  const setProfile = useUserStore((s) => s.setProfile);
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation<AuthResponse, ApiError, OAuthLoginPayload>({
    mutationFn: ({ provider, inviteToken }) =>
      OAuthFactory.get(provider).authenticate(inviteToken),
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
    onError: (err) => toast.error(resolveErrorMessage(err.code, err.message)),
  });
}

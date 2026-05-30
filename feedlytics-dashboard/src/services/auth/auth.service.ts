/**
 * Thin transport layer over the Kotlin `/api/v1/auth/*` endpoints.
 * Services are React-free and Store-free; they only talk HTTP and return
 * narrow, typed shapes that hooks can cache with TanStack Query.
 */
import { apiClient } from "@/services/api/client";
import { endpoints } from "@/services/api/endpoints";

import type {
  AuthResponse,
  LogoutResponse,
  RegisterResult,
} from "@/features/auth/types/auth.types";
import type { LoginRequest } from "@/features/auth/schemas/login.schema";
import type { SignupRequest } from "@/features/auth/schemas/signup.schema";
import type {
  RegenerateEmailCodeRequest,
  VerifyEmailRequest,
} from "@/features/auth/schemas/verify-email.schema";

export interface AuthServiceContract {
  login(dto: LoginRequest): Promise<AuthResponse>;
  register(dto: SignupRequest): Promise<RegisterResult>;
  verifyEmail(dto: VerifyEmailRequest): Promise<{ success: true; message: string }>;
  regenerateEmailCode(
    dto: RegenerateEmailCodeRequest,
  ): Promise<{ success: true; message: string }>;
  refresh(): Promise<AuthResponse>;
  logout(): Promise<LogoutResponse>;
  oauthSignIn(
    provider: string,
    idToken: string,
    inviteToken?: string,
  ): Promise<AuthResponse>;
}

class AuthServiceImpl implements AuthServiceContract {
  async login(dto: LoginRequest): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>(endpoints.auth.login, dto);
    return res.data;
  }

  async register(dto: SignupRequest): Promise<RegisterResult> {
    const res = await apiClient.post<RegisterResult>(endpoints.auth.register, dto);
    return res.data;
  }

  async verifyEmail(
    dto: VerifyEmailRequest,
  ): Promise<{ success: true; message: string }> {
    const res = await apiClient.post<{ success: true; message: string }>(
      endpoints.auth.verifyEmail,
      dto,
    );
    return res.data;
  }

  async regenerateEmailCode(
    dto: RegenerateEmailCodeRequest,
  ): Promise<{ success: true; message: string }> {
    const res = await apiClient.post<{ success: true; message: string }>(
      endpoints.auth.regenerateEmailCode,
      dto,
    );
    return res.data;
  }

  async refresh(): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>(endpoints.auth.refresh);
    return res.data;
  }

  async logout(): Promise<LogoutResponse> {
    const res = await apiClient.post<LogoutResponse>(endpoints.auth.logout);
    return res.data;
  }

  async oauthSignIn(
    provider: string,
    idToken: string,
    inviteToken?: string,
  ): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>(
      endpoints.auth.oauth(provider),
      { idToken, inviteToken },
    );
    return res.data;
  }
}

export const authService: AuthServiceContract = new AuthServiceImpl();

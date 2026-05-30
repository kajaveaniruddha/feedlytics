/**
 * Response shapes returned by the Kotlin auth API.
 * Requests are derived from Zod schemas in `features/auth/schemas` — never
 * re-declare a request type here.
 */

export type UserInfo = {
  publicId: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  isEmailVerified: boolean;
};

export type JoinedWorkspaceInfo = {
  workspacePublicId: string;
  workspaceName: string;
  role: string;
};

export type AuthResponse = {
  success: boolean;
  accessToken: string;
  expiresIn: number;
  user: UserInfo;
  joinedWorkspace?: JoinedWorkspaceInfo | null;
};

/** `POST /api/v1/auth/logout` — cookie cleared via `Set-Cookie` on the wire. */
export type LogoutResponse = { success: true };

export type RegisterResponse = {
  success: boolean;
  message: string;
  userPublicId: string;
};

/**
 * `POST /register` returns *either* a RegisterResponse (email verification
 * required) with HTTP 201 and no refresh cookie, *or* an AuthResponse (auto
 * verified via invite) with HTTP 201 and a refresh cookie.
 * Callers must narrow on `accessToken`.
 */
export type RegisterResult = RegisterResponse | AuthResponse;

export type OAuthProviderKey = "google" | "github" | "apple";

import type { AuthResponse, RegisterResponse } from "@/features/auth/types/auth.types";

import { adaUser } from "./users.fixture";

export const authSuccess: AuthResponse = {
  success: true,
  accessToken: "stub-access-token",
  expiresIn: 900,
  user: adaUser,
  joinedWorkspace: null,
};

export const authInvalidCredentials = {
  success: false as const,
  error: {
    code: "INVALID_CREDENTIALS",
    message: "Invalid email or password",
  },
};

export const authValidationError = {
  success: false as const,
  error: {
    code: "VALIDATION_ERROR",
    message: "email: must be a well-formed email address",
  },
};

export const authEmailExists = {
  success: false as const,
  error: {
    code: "EMAIL_EXISTS",
    message: "Email already registered",
  },
};

export const registerNeedsVerification: RegisterResponse = {
  success: true,
  message: "Verification email sent.",
  userPublicId: "00000000-0000-4000-8000-0000000000ab",
};

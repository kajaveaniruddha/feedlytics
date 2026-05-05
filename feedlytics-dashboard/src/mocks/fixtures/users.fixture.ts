import type { UserInfo } from "@/features/auth/types/auth.types";
import type { UserProfile } from "@/features/user/types/user.types";

export const adaUser: UserInfo = {
  publicId: "00000000-0000-4000-8000-000000000001",
  email: "ada@feedlytics.com",
  name: "Ada Lovelace",
  avatarUrl: null,
  isEmailVerified: true,
};

export const adaProfile: UserProfile = {
  ...adaUser,
  createdAt: "2025-01-12T09:30:00Z",
  updatedAt: "2026-05-03T09:30:00Z",
};

export const unverifiedUser: UserInfo = {
  publicId: "00000000-0000-4000-8000-000000000002",
  email: "new@feedlytics.com",
  name: "Not Yet Verified",
  avatarUrl: null,
  isEmailVerified: false,
};

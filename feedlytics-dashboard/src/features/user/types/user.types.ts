export type UserProfile = {
  publicId: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UserProfileResponse = {
  success: boolean;
  user: UserProfile;
};

import { apiClient } from "@/services/api/client";
import { endpoints } from "@/services/api/endpoints";

import type { UserProfile, UserProfileResponse } from "@/features/user/types/user.types";

export interface UserServiceContract {
  getCurrentUser(): Promise<UserProfile>;
}

class UserServiceImpl implements UserServiceContract {
  async getCurrentUser(): Promise<UserProfile> {
    const res = await apiClient.get<UserProfileResponse>(endpoints.user.profile);
    return res.data.user;
  }
}

export const userService: UserServiceContract = new UserServiceImpl();

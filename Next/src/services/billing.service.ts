import { userRepository } from "@/repositories/user.repository";
import type { SelectUser } from "@/db/models/user";

export const billingService = {
  computeNewBillingPeriod() {
    const now = new Date();
    return {
      messageCount: 0,
      billingPeriodStart: now,
      billingPeriodEnd: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
    };
  },

  async resetBillingPeriodIfExpired(user: SelectUser): Promise<SelectUser> {
    if (user.billingPeriodEnd && new Date() > new Date(user.billingPeriodEnd)) {
      const newPeriod = this.computeNewBillingPeriod();
      await userRepository.updateById(user.id, newPeriod);
      return { ...user, ...newPeriod };
    }
    return user;
  },
};

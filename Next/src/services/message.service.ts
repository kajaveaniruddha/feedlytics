import { userRepository } from "@/repositories/user.repository";
import { billingService } from "./billing.service";
import { ApiError } from "@/lib/api-error";

export const messageService = {
  async sendFeedback(data: {
    username: string;
    stars: number;
    content: string;
    email?: string;
    name?: string;
  }) {
    let user = await userRepository.findByUsername(data.username);

    if (!user) {
      throw ApiError.notFound("User not found.");
    }

    if (!user.isAcceptingMessage) {
      throw ApiError.forbidden(`${data.username} is not accepting feedbacks.`);
    }

    // Reset billing period if expired
    user = await billingService.resetBillingPeriodIfExpired(user);

    if ((user.messageCount as number) >= (user.maxMessages as number)) {
      throw ApiError.badRequest(`${data.username} has reached their feedback limit.`);
    }

    if (!data.content || data.content.length <= 10) {
      throw ApiError.badRequest("Message too small.");
    }

    if (data.content.length > 400) {
      throw ApiError.badRequest("Message too large.");
    }

    // Increment message count optimistically
    await userRepository.incrementMessageCount(user.id);

    try {
      const queueResponse = await fetch(
        `${process.env.SERVICES_URL}/add-feedback`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: {
              userId: user.id,
              email: data.email,
              name: data.name,
              stars: data.stars,
              content: data.content,
              createdAt: new Date(),
            },
          }),
        }
      );

      if (!queueResponse.ok) {
        throw ApiError.internal("Failed to add job to the queue.");
      }

      return { messageCount: (user.messageCount as number) + 1 };
    } catch (error) {
      // Rollback message count on failure
      await userRepository.decrementMessageCount(user.id);
      if (error instanceof ApiError) throw error;
      throw ApiError.internal("Failed to process feedback.");
    }
  },
};

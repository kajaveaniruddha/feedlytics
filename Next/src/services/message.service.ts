import { userRepository } from "@/repositories/user.repository";
import { billingService } from "./billing.service";
import { ApiError } from "@/lib/api-error";

interface SendFeedbackInput {
  username: string;
  stars: number;
  content: string;
  email?: string;
  name?: string;
}

export const messageService = {
  async sendFeedback(input: SendFeedbackInput) {
    const { username, stars, content, email, name } = input;

    let user = await userRepository.findByUsername(username);
    if (!user) {
      throw ApiError.notFound("User not found.");
    }

    if (!user.isAcceptingMessage) {
      throw ApiError.forbidden(`${username} is not accepting feedbacks.`);
    }

    user = await billingService.resetBillingPeriodIfExpired(user);

    if ((user.messageCount as number) >= (user.maxMessages as number)) {
      throw ApiError.badRequest(`${username} has reached their feedback limit.`);
    }


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
              email,
              name,
              stars,
              content,
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
      if (error instanceof ApiError) throw error;
      await userRepository.decrementMessageCount(user.id);
      throw ApiError.internal("Failed to analyze sentiment.");
    }
  },
};

import { feedbackRepository } from "../repositories/feedback.repository";
import { workflowRepository } from "../repositories/workflow.repository";
import { llmService } from "./llm.service";
import { notificationService } from "./notification.service";
import type { FeedbackJobData } from "../types/feedback.types";
import { logger } from "../lib/logger";

export const feedbackService = {
  async processFeedback(data: FeedbackJobData) {
    const { userId, stars, content, email, name, createdAt } = data;

    const analysis = await llmService.analyzeSentiment(content);
    const { overall_sentiment: sentiment, feedback_classification: category } = analysis;

    await feedbackRepository.insert({
      userId,
      email: email ?? undefined,
      name: name ?? undefined,
      stars,
      content,
      sentiment,
      category,
      createdAt: new Date(createdAt || Date.now()),
    });

    logger.info({ userId, sentiment, category }, "Feedback persisted");

    const workflows = await workflowRepository.findActiveByUserAndCategories(userId, category);
    await notificationService.dispatchAll(workflows, {
      userId,
      stars,
      content,
      sentiment,
      category,
      createdAt: new Date(createdAt || Date.now()),
    });
  },
};

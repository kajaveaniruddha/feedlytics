import { llmService } from "./llm.service";
import { enqueueNotification } from "../queues/enqueue";
import { enqueueAnalysisCallbackItem } from "./ai-analysis-callback-batcher";
import type { FeedbackJobData } from "../types/feedback.types";
import { logger } from "../lib/logger";

function resolveCategoryName(
  aiName: string,
  workspaceCategoryNames: string[]
): string | null {
  const t = aiName.trim();
  if (t.toLowerCase() === "other") return null;
  const lower = t.toLowerCase();
  const found = workspaceCategoryNames.find((c) => c.trim().toLowerCase() === lower);
  return found ?? null;
}

export const feedbackService = {
  async processFeedback(data: FeedbackJobData) {
    const {
      feedbackId,
      content,
      workspaceCategoryNames,
      callbackBaseUrl,
      internalAuthToken,
      notificationWebhooks,
      rating,
      submittedAtEpochMs,
    } = data;

    const analysis = await llmService.analyzeFeedback(content, workspaceCategoryNames);

    const categoriesForCallback = analysis.categories
      .map((c) => {
        const resolved = resolveCategoryName(c.name, workspaceCategoryNames);
        if (!resolved) return null;
        return {
          categoryName: resolved,
          confidence: c.confidence ?? null,
        };
      })
      .filter((x): x is { categoryName: string; confidence: number | null } => x != null);

    enqueueAnalysisCallbackItem({
      feedbackId,
      sentiment: analysis.overall_sentiment,
      overallConfidence: analysis.sentiment_confidence,
      categories: categoriesForCallback,
      callbackBaseUrl,
      internalAuthToken,
    });

    const classificationLabels = [
      ...new Set([
        ...categoriesForCallback.map((c) => c.categoryName),
        ...(analysis.categories.some((c) => c.name.trim().toLowerCase() === "other") ? ["other"] : []),
      ]),
    ];

    const createdAt = new Date(submittedAtEpochMs || Date.now());

    for (const webhookUrl of notificationWebhooks ?? []) {
      if (!webhookUrl?.trim()) continue;
      try {
        await enqueueNotification({
          webhookUrl: webhookUrl.trim(),
          message: {
            stars: rating,
            content,
            sentiment: analysis.overall_sentiment,
            category: classificationLabels.length > 0 ? classificationLabels : ["other"],
            createdAt,
          },
        });
      } catch (err) {
        logger.warn({ err: String(err), webhookUrl }, "Failed to enqueue notification job");
      }
    }

    logger.info({ feedbackId, sentiment: analysis.overall_sentiment }, "Feedback analysis queued for batch callback");
  },
};

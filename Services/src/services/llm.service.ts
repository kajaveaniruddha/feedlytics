import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import Groq from "groq-sdk";
import type { SentimentAnalysisResult } from "../types/feedback.types";
import { logger } from "../lib/logger";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    overall_sentiment: z
      .enum(["positive", "neutral", "negative"])
      .describe("The overall sentiment of the review."),
    feedback_classification: z
      .array(
        z.enum(["bug", "request", "praise", "complaint", "suggestion", "question", "other"])
      )
      .describe("Categories applicable to the review."),
  })
);

const FALLBACK_RESULT: SentimentAnalysisResult = {
  overall_sentiment: "neutral",
  feedback_classification: ["other"],
};

const promptTemplate = PromptTemplate.fromTemplate(`
  Analyze the following review:
  Review: {review}
  Provide:
  - Overall sentiment (either positive, neutral, or negative)
  - Categories the review in all the applicable categories from the given list: bug, request, praise, complaint, suggestion, question, other.
  - Only return the requested formatted JSON.
  - No need for any explanations or other texts.
  Format response as JSON:
  {{
    "overall_sentiment": "<positive|neutral|negative>",
    "feedback_classification": ["<categories>"],
  }}
`);

export const llmService = {
  async analyzeSentiment(content: string): Promise<SentimentAnalysisResult> {
    const prompt = await promptTemplate.format({ review: content });

    try {
      const response = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.1-8b-instant",
        max_tokens: 1024,
        temperature: 0.3,
      });

      const raw = response.choices[0]?.message?.content?.trim();
      const parsed = await parser.parse(raw ?? "");
      logger.debug({ sentiment: parsed.overall_sentiment, categories: parsed.feedback_classification }, "LLM analysis complete");
      return parsed;
    } catch (error) {
      logger.error({ error: String(error) }, "LLM sentiment analysis failed, using fallback");
      return FALLBACK_RESULT;
    }
  },
};

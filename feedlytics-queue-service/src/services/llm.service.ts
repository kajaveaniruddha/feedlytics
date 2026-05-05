import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import Groq from "groq-sdk";
import type { SentimentAnalysisResult } from "../types/feedback.types";
import { logger } from "../lib/logger";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function buildParser() {
  return StructuredOutputParser.fromZodSchema(
    z.object({
      overall_sentiment: z
        .enum(["positive", "neutral", "negative"])
        .describe("The overall sentiment of the feedback text."),
      sentiment_confidence: z
        .number()
        .min(0)
        .max(1)
        .describe("Confidence score between 0 and 1 for the sentiment."),
      categories: z
        .array(
          z.object({
            name: z.string().describe("Category name from the allowed list or exactly 'other'."),
            confidence: z
              .number()
              .min(0)
              .max(1)
              .optional()
              .describe("Confidence for this category assignment."),
          })
        )
        .describe("Applicable categories from the allowed list; use 'other' if none apply."),
    })
  );
}

const FALLBACK_RESULT: SentimentAnalysisResult = {
  overall_sentiment: "neutral",
  sentiment_confidence: 0.5,
  categories: [{ name: "other" }],
};

const promptTemplate = PromptTemplate.fromTemplate(`
You classify user feedback.

Allowed workspace categories (use exact spelling when applicable, case-insensitive match allowed):
{allowedCategories}

If none of the categories fit, include a single entry with name "other".

Feedback text:
---
{review}
---

Return only valid JSON with:
- overall_sentiment: positive | neutral | negative
- sentiment_confidence: number 0-1
- categories: array of {{ name, confidence? }} where name is from the allowed list or "other"

{format_instructions}
`);

export const llmService = {
  async analyzeFeedback(content: string, workspaceCategoryNames: string[]): Promise<SentimentAnalysisResult> {
    const allowedLines =
      workspaceCategoryNames.length > 0
        ? workspaceCategoryNames.map((c) => `- ${c}`).join("\n")
        : "(no workspace categories configured — use only \"other\".)";

    const parser = buildParser();
    const prompt = await promptTemplate.format({
      review: content,
      allowedCategories: allowedLines,
      format_instructions: parser.getFormatInstructions(),
    });

    try {
      const response = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.1-8b-instant",
        max_tokens: 1024,
        temperature: 0.3,
      });

      const raw = response.choices[0]?.message?.content?.trim();
      const parsed = await parser.parse(raw ?? "");
      logger.debug(
        { sentiment: parsed.overall_sentiment, categories: parsed.categories },
        "LLM analysis complete"
      );
      return {
        overall_sentiment: parsed.overall_sentiment,
        sentiment_confidence: parsed.sentiment_confidence,
        categories: parsed.categories.map((c) => ({
          name: c.name,
          confidence: c.confidence,
        })),
      };
    } catch (error) {
      logger.error({ error: String(error) }, "LLM sentiment analysis failed, using fallback");
      return FALLBACK_RESULT;
    }
  },
};

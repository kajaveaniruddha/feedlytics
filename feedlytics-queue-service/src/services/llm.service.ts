import { z } from "zod";
import Groq from "groq-sdk";
import type { SentimentAnalysisResult } from "../types/feedback.types";
import { logger } from "../lib/logger";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const FALLBACK_RESULT: SentimentAnalysisResult = {
  overall_sentiment: "neutral",
  sentiment_confidence: 0.5,
  categories: [{ name: "other" }],
};

/** Shape we expect inside the model JSON (before strict category / sentiment checks). */
const llmJsonSchema = z.object({
  overall_sentiment: z.enum(["positive", "neutral", "negative"]),
  sentiment_confidence: z.number().min(0).max(1),
  categories: z.array(
    z.object({
      name: z.string(),
      confidence: z.number().min(0).max(1).optional(),
    }),
  ),
});

function extractJsonObjects(text: string): string[] {
  const out: string[] = [];
  const trimmed = text.trim();
  if (trimmed.length > 0) out.push(trimmed);

  for (const m of trimmed.matchAll(/```(?:json)?\s*([\s\S]*?)```/gi)) {
    const inner = m[1]?.trim();
    if (inner) out.push(inner);
  }

  let from = 0;
  while ((from = trimmed.indexOf("{", from)) !== -1) {
    let depth = 0;
    for (let i = from; i < trimmed.length; i++) {
      const ch = trimmed[i];
      if (ch === "{") depth++;
      else if (ch === "}") {
        depth--;
        if (depth === 0) {
          out.push(trimmed.slice(from, i + 1));
          break;
        }
      }
    }
    from++;
  }

  return [...new Set(out)];
}

function parseFirstValidPayload(
  raw: string,
): z.infer<typeof llmJsonSchema> | null {
  for (const chunk of extractJsonObjects(raw)) {
    try {
      const obj = JSON.parse(chunk) as unknown;
      const parsed = llmJsonSchema.safeParse(obj);
      if (parsed.success) return parsed.data;
    } catch {
      /* try next candidate */
    }
  }
  return null;
}

/**
 * Map category names to workspace spelling; require every name to be either
 * "other" or a case-insensitive match to an allowed category.
 */
function normalizeStrict(
  data: z.infer<typeof llmJsonSchema>,
  workspaceCategoryNames: string[],
): SentimentAnalysisResult | null {
  const allowedByLower = new Map(
    workspaceCategoryNames.map((n) => {
      const t = n.trim();
      return [t.toLowerCase(), t] as const;
    }),
  );

  const categories: { name: string; confidence?: number }[] = [];

  for (const c of data.categories) {
    const key = c.name.trim().toLowerCase();
    if (key === "other") {
      categories.push({ name: "other", confidence: c.confidence });
      continue;
    }
    if (workspaceCategoryNames.length === 0) {
      return null;
    }
    const canonical = allowedByLower.get(key);
    if (!canonical) return null;
    categories.push({ name: canonical, confidence: c.confidence });
  }

  if (categories.length === 0) return null;

  return {
    overall_sentiment: data.overall_sentiment,
    sentiment_confidence: data.sentiment_confidence,
    categories,
  };
}

function buildPrompt(content: string, workspaceCategoryNames: string[]): string {
  const allowedLines =
    workspaceCategoryNames.length > 0
      ? workspaceCategoryNames.map((c) => `- ${c.trim()}`).join("\n")
      : '(only "other" — no workspace categories configured)';

  return `Classify the feedback. Reply with a single JSON object only (no markdown, no code fences, no explanation, no reasoning).

Required keys:
- "overall_sentiment": one of "positive", "neutral", "negative"
- "sentiment_confidence": number between 0 and 1
- "categories": array of objects with "name" and optional "confidence" (0-1)

Each category "name" must be exactly one of the allowed names below (same spelling; matching is case-insensitive) or the word other.

Allowed category names:
${allowedLines}

Feedback:
${content}`;
}

function quietFallback(reason: string): SentimentAnalysisResult {
  logger.debug({ reason }, "LLM output invalid or unparsable; using neutral/other fallback");
  return FALLBACK_RESULT;
}

export const llmService = {
  async analyzeFeedback(
    content: string,
    workspaceCategoryNames: string[],
  ): Promise<SentimentAnalysisResult> {
    const prompt = buildPrompt(content, workspaceCategoryNames);

    let raw: string | undefined;
    try {
      const response = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.1-8b-instant",
        max_tokens: 256,
        temperature: 0.1,
        response_format: { type: "json_object" },
      });

      raw = response.choices[0]?.message?.content?.trim();
      if (!raw) {
        return quietFallback("empty_model_content");
      }

      const payload = parseFirstValidPayload(raw);
      if (!payload) {
        return quietFallback("json_parse_or_schema_mismatch");
      }

      const normalized = normalizeStrict(payload, workspaceCategoryNames);
      if (!normalized) {
        return quietFallback("category_or_sentiment_not_in_allowed_set");
      }

      logger.debug(
        { sentiment: normalized.overall_sentiment, categories: normalized.categories },
        "LLM analysis complete",
      );
      return normalized;
    } catch (error) {
      const message = String(error);
      if (
        message.includes("response_format") ||
        message.includes("json_object") ||
        message.includes("json mode")
      ) {
        try {
          const response = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.1-8b-instant",
            max_tokens: 256,
            temperature: 0.1,
          });
          raw = response.choices[0]?.message?.content?.trim();
          if (!raw) return quietFallback("empty_model_content_retry");
          const payload = parseFirstValidPayload(raw);
          if (!payload) return quietFallback("json_parse_or_schema_mismatch_retry");
          const normalized = normalizeStrict(payload, workspaceCategoryNames);
          if (!normalized) {
            return quietFallback("category_or_sentiment_not_in_allowed_set_retry");
          }
          logger.debug(
            { sentiment: normalized.overall_sentiment, categories: normalized.categories },
            "LLM analysis complete",
          );
          return normalized;
        } catch (retryErr) {
          logger.debug(
            { error: String(retryErr) },
            "LLM request failed after json_mode retry; using fallback",
          );
          return FALLBACK_RESULT;
        }
      }

      logger.debug({ error: message }, "LLM request failed; using fallback");
      return FALLBACK_RESULT;
    }
  },
};

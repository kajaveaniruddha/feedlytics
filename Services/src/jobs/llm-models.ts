import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import Groq from "groq-sdk";

export const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    overall_sentiment: z
      .enum(["positive", "neutral", "negative"])
      .describe("The overall sentiment of the review."),
    feedback_classification: z
      .array(
        z.enum([
          "bug",
          "request",
          "praise",
          "complaint",
          "suggestion",
          "question",
          "other",
        ])
      )
      .describe("Categories applicable to the review."),
  })
);

// import { Ollama } from "@langchain/ollama";
// let ollamaInstance: Ollama | null = null;

// export const getOllamaInstance = () => {
//   if (!ollamaInstance) {
//     ollamaInstance = new Ollama({
//       // model: "smollm2:1.7b",
//       // model: "tinyllama",
//       // model: "llama2",
//       // model: "llama3.2:1b",
//       model: "llama3.2:3b",
//       temperature: 0,
//       maxRetries: 2,
//     });
//   }
//   return ollamaInstance;
// };

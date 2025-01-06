import { PromptTemplate } from "@langchain/core/prompts";
import { parser, groq } from "./llm-models";

export const analyzeReview = async (content: string) => {
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

  const prompt = await promptTemplate.format({ review: content });

  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-8b-instant", // Ensure this model is available in your Groq account
      max_tokens: 1024,
      temperature: 0.3,
    });

    const responseData = response.choices[0]?.message?.content?.trim();
    const parsedResponse = await parser.parse(responseData ?? "");
    console.log(
      "--------------Parsed response---------------------\n",
      parsedResponse,
      "\n-------------------------"
    );
    return parsedResponse;
  } catch (error) {
    console.error("Error analyzing sentiment and classification:", error);
    return {
      overall_sentiment: "neutral",
      feedback_classification: ["other"],
      review: content,
    };
  }
};

// export const analyzeReview = async (content: string) => {
//   const ollama = getOllamaInstance();

//   const promptTemplate = PromptTemplate.fromTemplate(`
//       Analyze the following review:
//       Review: {review}

//       Provide:
//       - Overall sentiment (either positive or neutral or negative)
//       - Categories the review in all the applicable categories from the given list: bug, request, praise, complaint, suggestion, question, other.
//       - Only return the requested formatted JSON and no other texts as I want to parse your output directly into JSON object.
//       - No need for any explanations and other texts.
//       - No formatting texts like "\n".

//       Format response as JSON:
//       {{
//         "overall_sentiment": "<positive|neutral|negative>",
//         "feedback_classification": ["<categories>"],
//         "review":"{review}"
//       }}
//     `);

//   const prompt = await promptTemplate.format({ review: content });

//   try {
//     const response = await ollama.invoke(prompt, {
//       configurable: { caches: false },
//     });
//     console.log(
//       "--------------LLM response---------------------\n",
//       response,
//       "\n-------------------------"
//     );
//     const parsedResponse = await parser.parse(response); // Use the parser for structured output
//     return parsedResponse;
//   } catch (error) {
//     console.error("Error analyzing sentiment and classification:", error);
//     return {
//       overall_sentiment: "neutral",
//       feedback_classification: ["other"],
//       review: content,
//     };
//   }
// };

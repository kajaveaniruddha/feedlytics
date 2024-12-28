import { Ollama } from "@langchain/ollama";
import { PromptTemplate } from "@langchain/core/prompts";

export const analyzeReview = async (content: string) => {
  const ollama = new Ollama({
    model: "llama2", // Replace with the appropriate model name
    temperature: 0,
    maxRetries: 2,
  });

  const promptTemplate = PromptTemplate.fromTemplate(`
      Analyze the following review:
      Review: {review}
      
      Provide:
      - Overall sentiment (positive, neutral, negative)
      - Feedback categories from the list: bug, request, praise, complaint, suggestion, question, other.
      - Only return the formatted JSON.
  
      Format response as JSON:
      {{
        "overall_sentiment": "<positive|neutral|negative>",
        "feedback_classification": ["<categories>"]
      }}
    `);

  const prompt = await promptTemplate.format({ review: content });

  try {
    const response = await ollama.invoke(prompt);
    console.log(
      "--------------LLM response---------------------\n",
      response,
      "\n-------------------------"
    );
    const result = JSON.parse(response); // Parse the matched JSON
    return result;
  } catch (error) {
    console.error("Error analyzing sentiment and classification:", error);
    return null;
  }
};

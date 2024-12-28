import { Ollama } from "@langchain/ollama";

let ollamaInstance: Ollama | null = null;

export const getOllamaInstance = () => {
  if (!ollamaInstance) {
    ollamaInstance = new Ollama({
      model: "llama2",
      temperature: 0.3,
      maxRetries: 2,
    });
  }
  return ollamaInstance;
};

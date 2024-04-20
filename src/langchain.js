import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";

const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY;
const llm = new ChatOpenAI({ openAIApiKey });

export async function getStandaloneQuestion(userInput) {
  const standaloneQuestionTemplate =
    "Create a standalone question based on this user input: {userInput}";
  const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
    standaloneQuestionTemplate
  );

  const standaloneQuestionChain = standaloneQuestionPrompt.pipe(llm);

  const response = await standaloneQuestionChain.invoke({ userInput });

  console.log(response);
}

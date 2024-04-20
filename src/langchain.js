import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";

const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY;
const llm = new ChatOpenAI({ openAIApiKey });

export async function getStandaloneQuestion(userInput) {
  const standaloneQuestionTemplate =
    "Given a question, convert it to a standalone question. question: {userInput} standalone question:";
  const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
    standaloneQuestionTemplate
  );

  const standaloneQuestionChain = standaloneQuestionPrompt.pipe(llm);

  const response = await standaloneQuestionChain.invoke({ userInput });

  console.log(response);
}

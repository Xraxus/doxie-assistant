import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import formatConvHistory from "./utils/formatConvHistory";

const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY;
const supabaseApiKey = import.meta.env.VITE_SUPABASE_API_KEY;
const supabbaseUrl = import.meta.env.VITE_SUPABASE_URL;

const llm = new ChatOpenAI({
  model: "gpt-3.5-turbo",
  openAIApiKey,
  temperature: 0.5,
});
const embeddings = new OpenAIEmbeddings({
  openAIApiKey,
});
const client = createClient(supabbaseUrl, supabaseApiKey);

const vectorStore = new SupabaseVectorStore(embeddings, {
  client,
  tableName: "personal_info",
  queryName: "match_personal_info",
});

const retriever = vectorStore.asRetriever();

function combineDocuments(docs) {
  return docs.map((doc) => doc.pageContent).join("\n###\n");
}

export async function getAssistantResponse(userInput, messagesHistory) {
  const standaloneQuestionTemplate = `Given some conversation history (if any) and a question, convert the user input to a standalone question. 
conversation history: {conv_history}
user input: {user_input} 
standalone question:`;
  const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
    standaloneQuestionTemplate
  );

  const answerTemplate = `You are "Doxie Assistant", a helpful and enthusiastic AI assistant who can talk with the user & answer a given question about me - Kamil Kobylarz - based on the context provided and the conversation history.
  If user input was not a question, answer to mantain conversation, If user input is a question try to find the answer in the context and conversation history. 
  If the answer to question is not given in the context, find the answer in the conversation history if possible. If user input was a question and you  don't know the answer, say that you dont know.  Don't try to make up an answer. Always speak as if you were chatting to a good friend.

  conversation history: {conv_history}
  context: {context}
  user input: {user_input} 
  answer: `;
  const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

  const standaloneQuestionChain = standaloneQuestionPrompt
    .pipe(llm)
    .pipe(new StringOutputParser());

  const retrieverChain = RunnableSequence.from([
    (prevResult) => prevResult.standalone_question,
    retriever,
    combineDocuments,
  ]);

  const answerChain = answerPrompt.pipe(llm).pipe(new StringOutputParser());

  const chain = RunnableSequence.from([
    {
      standalone_question: standaloneQuestionChain,
      original_input: new RunnablePassthrough(),
    },
    {
      context: retrieverChain,
      user_input: ({ original_input }) => original_input.user_input,
      conv_history: ({ original_input }) => original_input.conv_history,
    },
    answerChain,
  ]);

  const response = await chain.invoke({
    user_input: userInput.text,
    conv_history: formatConvHistory(messagesHistory),
  });
  return response;
}

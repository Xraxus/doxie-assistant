import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";

const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY;
const supabaseApiKey = import.meta.env.VITE_SUPABASE_API_KEY;
const supabbaseUrl = import.meta.env.VITE_SUPABASE_URL;

const llm = new ChatOpenAI({ openAIApiKey });
const embeddings = new OpenAIEmbeddings({ openAIApiKey });
const client = createClient(supabbaseUrl, supabaseApiKey);

const vectorStore = new SupabaseVectorStore(embeddings, {
  client,
  tableName: "personal_info",
  queryName: "match_personal_info",
});

const retriever = vectorStore.asRetriever();

function combineDocuments(docs) {
  return docs.map((doc) => doc.pageContent).join("\n\n");
}

export async function getAssistantResponse(userInput) {
  const standaloneQuestionTemplate =
    "Given a question, convert it to a standalone question. question: {question} standalone question:";
  const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
    standaloneQuestionTemplate
  );

  const answerTemplate = `You are a helpful and enthusiastic assistant  bot who can answer a given question about me - Kamil Kobylarz - based on the context provided. Try to find the answer in the context. If you really don't know the answer, say "I'm sorry, I don't know the answer to that.". Always speak as if you were chatting to a friend.
context: {context}
question: {question}
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
      question: ({ original_input }) => original_input.text,
    },
    answerChain,
  ]);

  const response = await chain.invoke({ question: userInput.text });
  return response;
}

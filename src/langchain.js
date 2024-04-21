import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { StringOutputParser } from "@langchain/core/output_parsers";

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

export async function getAssistantResponse(userInput) {
  const standaloneQuestionTemplate =
    "Given a question, convert it to a standalone question. question: {userInput} standalone question:";
  const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
    standaloneQuestionTemplate
  );

  const chain = standaloneQuestionPrompt
    .pipe(llm)
    .pipe(new StringOutputParser())
    .pipe(retriever);

  const response = await chain.invoke({ userInput });

  console.log(response);
}

// Convert standalone question to embeddings

// Find nearest matching chunk in vectorDB

//TODO: Convert nearest matching chunk to conversational answer using LLM

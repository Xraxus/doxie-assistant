import { readFile } from "fs/promises";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import dotenv from "dotenv";

dotenv.config();

const sbApiKey = process.env.SUPABASE_API_KEY;
const sbUrl = process.env.SUPABASE_URL;
const openAIApiKey = process.env.OPENAI_API_KEY;

async function readFromFile(filePath) {
  try {
    const text = await readFile(filePath, "utf8");

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 100,
      separators: ["\n\n", "\n", " ", ""],
      chunkOverlap: 20,
    });

    const output = await splitter.createDocuments([text]);

    // Check if the environment variables are defined
    if (!sbApiKey || !sbUrl || !openAIApiKey) {
      throw new Error(
        "Supabase API Key, Supabase URL, and OpenAI API Key are required."
      );
    }

    const client = createClient(sbUrl, sbApiKey);

    await SupabaseVectorStore.fromDocuments(
      output,
      new OpenAIEmbeddings({ openAIApiKey }),
      {
        client,
        tableName: "personal_info",
      }
    );
  } catch (error) {
    console.error(error);
  }
}

readFromFile("personalInfo.txt");

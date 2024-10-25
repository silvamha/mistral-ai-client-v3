console.log("Vite is working!");
const app = document.getElementById("app");
app.innerHTML = `<h1>Hello, Vite!</h1>`;

// Import necessary modules
import { Mistral } from "@mistralai/mistralai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;

// Load the API key from environment variables
const apiKey = import.meta.env.VITE_MISTRAL_API_KEY_V3;

// Create a new Mistral client instance
const mistralClient = new Mistral({ apiKey: apiKey });

// Supabase
const supabase = createClient(supabaseUrl, supabaseKey);
console.log(supabase)



// 1. Getting the user input
const input = "December 25th is on a Sunday, do I get any extra time off to account for that?";

// 2. Creating an embedding of the input
const embedding = await createEmbedding(input);

// 3. Retrieving similar embeddings / text chunks (aka "context")
const context = await retrieveMatches(embedding);

console.log(context);
// 4. Combining the input and the context in a prompt 
// and using the chat API to generate a response 
// const response = await generateChatResponse(context, input);


async function createEmbedding(input) {
  const embeddingResponse = await mistralClient.embeddings.create({
      model: 'mistral-embed',
      inputs: [input]
  });
  return embeddingResponse.data[0].embedding;
}

async function retrieveMatches(embedding) {
  const { data } = await supabase.rpc('match_handbook_docs', {
      query_embedding: embedding,
      match_threshold: 0.78,
      match_count: 5
  });
  return data[0].content;
}


async function generateChatResponse(context, query) {

}

// Import necessary modules
import { Mistral } from "@mistralai/mistralai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// Load the API key from environment variables
const apiKey = import.meta.env.VITE_MISTRAL_API_KEY_V3;

// Create a new Mistral client instance
const client = new Mistral({ apiKey: apiKey });

// Asynchronous function to split a document into chunks
async function splitDocument(path) {
  // Fetch the document from the specified path
  const response = await fetch(path);
  // Extract the text content from the response
  const text = await response.text();
  // Create a new RecursiveCharacterTextSplitter instance with specified chunk size and overlap
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 250,
    chunkOverlap: 40,
  });
  // Split the text into documents using the splitter
  const output = await splitter.createDocuments([text]);
  // Extract the text content from each document
  const textArr = output.map((chunk) => chunk.pageContent);
  // Return the array of text chunks
  return textArr;
}

// Call splitDocument to get chunks from handbook.txt
const handbookChunks = await splitDocument("handbook.txt");

// Asynchronous function to create embeddings from text chunks
async function createEmbeddings(chunks) {
  try {
    // Create embeddings using the Mistral client with corrected parameter name 'inputs'
    const embeddings = await client.embeddings.create({
      model: "mistral-embed",
      inputs: chunks, // Corrected parameter name
    });
    // Log a specific embedding to the console for verification
    console.log(embeddings.data[12].embedding);
  } catch (error) {
    console.error("Error creating embeddings:", error);
  }
}

// Call createEmbeddings to generate embeddings from handbookChunks
// createEmbeddings(handbookChunks);

// Placeholder for other functions (if any)
// ...

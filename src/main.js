console.log("Vite is working!");
const app = document.getElementById("app");
app.innerHTML = `<h1>Hello, Vite!</h1>`;

// import { initializeMessages } from "../initialization";

// Importing Mistral Client from @mistralai/mistralai
import { Mistral } from "@mistralai/mistralai";

// Import LangChain
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// Load the API key from environment variables
const apiKey = import.meta.env.VITE_MISTRAL_API_KEY_V3;

// Create a new client instance
const client = new Mistral({ apiKey: apiKey });

const handbookText = "handbook.txt";
async function splitDocument(path) {
  const response = await fetch(path);
  const text = await response.text();
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 250,
    chunkOverlap: 40,
  });
  const output = await splitter.createDocuments([text]);
  const textArr = output.map((chunk) => chunk.pageContent);
  return textArr;

}



// const embeddingsResponse = await client.embeddings.create({
//   model: "mistral-embed",
//   inputs: [exampleChunk], 
// });
// console.log(await splitDocument('handbook.txt'));

// console.log(embeddingsResponse);

// Function to get a chat response from the Mistral model


async function getChatResponse() {
  try {
    const chatResponse = await client.chat.complete({
      model: "pixtral-12b-2409",
      messages: [
        {
          role: "system",
          content: "You are a coding assistant",
        },
        {
          role: "user",
          content: "Please give me an example of a callback function",
        },
      ],
      temperature: 0.87,
      response_format: {
        type: "json_object",
      },
    });

    // Log the response to the console
    // console.log("Chat:", chatResponse.choices[0].message.content);
  } catch (error) {
    console.error("Error fetching response:", error);
  }
}

// Call the function to fetch a chat response
// getChatResponse();

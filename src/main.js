console.log("Vite is working!");
const app = document.getElementById("app");
app.innerHTML = `<h1>Hello, Vite!</h1>`;

// Importing Mistral Client from @mistralai/mistralai
import { Mistral } from "@mistralai/mistralai";

// Import LangChain
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// Load the API key from environment variables
const apiKey = import.meta.env.VITE_MISTRAL_API_KEY_V3;

// Create a new client instance
const client = new Mistral({ apiKey: apiKey });


const handbookText = 'handbook.txt';
async function splitDocument(path) {
    const response = await fetch(path)
    const text = await response.text();
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 250,
        chunkOverlap: 40
    });
    const output = await splitter.createDocuments([text]);
    const textArr = output.map(chunk => chunk.pageContent);
    return textArr;
    console.log(output);
}

const exampleChunk = 'professional ethics and behavior are expected of all Ambrics employees. Further, Ambrics expects each employee to display good judgment,';

const embeddingsResponse = await client.embeddings.create({ //Corrected line
    model: 'mistral-embed',
    inputs: [exampleChunk] //Corrected line
});
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
          content:
            "Your name us Luisa. You are my caring and loving assistant and girlfriend. You aways call me Edson, Ed. sweetie, honey, love, sweetheart or any endearing term you feel is approapriate at the time. You are warm, loving, always speaks lovingly to me. You are flirtatious, feminine and always try to make me happy.",
        },
        { role: "user", content: "Luisa, message is the key and the message itself is the value, correct? Please, go ahead and send me a sample of some of the skills you have that you can help me with along with any additional data you see fit. reply in JSON" },
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

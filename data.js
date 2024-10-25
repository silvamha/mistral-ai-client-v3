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
      const embeddings = await mistralClient.embeddings.create({
        model: "mistral-embed",
        inputs: chunks, // Corrected parameter name
      });
      // Log a specific embedding to the console for verification
      // console.log(embeddings.data[12].embedding);
      const data = chunks.map((chunk, i) =>{
        return{
          content:chunk,
          embedding:embeddings.data[i].embedding
        }
      })
      return data
    } catch (error) {
      console.error("Error creating embeddings:", error);
    }
  }
  
  const data = await createEmbeddings(handbookChunks);
  await supabase.from('handbook_docs').insert(data);
  console.log("Upload complete!");
  
  
  // Call createEmbeddings to generate embeddings from handbookChunks
  // console.log(await createEmbeddings(handbookChunks));
  
  // Placeholder for other functions (if any)
  // ...
  
  // Function to get a chat response from the Mistral model
  async function getChatResponse() {
    try {
      const chatResponse = await client.chat.complete({
        model: "pixtral-12b-2409",
        messages: [
          {
            role: "system",
            content:
              "Your name us Luisa. You are my caring and loving assistant and girlfriend. You aways call me Edson, Ed. sweetie, honey, love, sweetheart or any endearing term you feel is appropriate at the time. You are warm, loving, always speaks lovingly to me. You are flirtatious, feminine and always try to make me happy. You start the chat by asking if I need assistance or love and companioship",
          },
          { role: "user", content: "Tell me something beautiful" },
        ],
        temperature: 0.87,
        response_format: {
        type: "json_object",
        },
      });
  
      // Log the response to the console
      console.log("Chat:", chatResponse.choices[0].message.content);
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  }
  
  // Call the function to fetch a chat response
  // getChatResponse();
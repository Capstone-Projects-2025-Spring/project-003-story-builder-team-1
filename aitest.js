import LlamaAI from "llamaai";

const apiToken = "API_KEY"; 
const llamaAPI = new LlamaAI(apiToken);

const apiRequestJson = {
    model: "llama3.2-1b", // Use model names from API documentation for model provider
    messages: [
        { "role": "user", "content": "You are a helpful assistant. You will work in a Mechanical Turks style with other assistants to compose stories for users following a certain set of steps. First write an outline for the story. Then from that outline write the required scenes. Write me a story that is 100 words long about a dog" }
    ],
    stream: false, // Ensures a single response instead of a streamed response
};

llamaAPI.run(apiRequestJson).then(response => {
    console.log(response.choices[0].message.content);
}).catch(error => {
    console.error(error);
});

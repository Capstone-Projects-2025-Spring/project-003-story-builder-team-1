import LlamaAI from "llamaai";
const llamaAPI = new LlamaAI(process.env.API_KEY);

const apiRequestJson = {
    "model": "llama3.1-8b",
    "messages": [
        {"role": "system", "content": "You are a helpful assistant. Your role will be to write stories in a Mechanical Turks format." },
        {"role": "user", "content": "Write a 100 word story about a dog."},
    ],
    "stream": false,
};
console.log("Sending prompt:", apiRequestJson);
await llamaAPI.run(apiRequestJson)    
    .then(response => {
        console.log(JSON.stringify(response, null, 2));
        console.log(response.choices[0].message.content);
        console.log("API call successful");
    })
    .catch(error => {
        console.error("API call failed:", error.response ? error.response.data : error.message);
    });


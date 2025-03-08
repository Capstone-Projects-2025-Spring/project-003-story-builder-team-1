import LlamaAI from "llamaai";
const llamaAPI = new LlamaAI(process.env.API_KEY);

console.log("LlamaAI instance created:", llamaAPI);
var conversation = [];

while(1) {
    console.log("Waiting for prompt...");
    const prompt = await new Promise(resolve => {
        process.stdin.once('data', data => resolve(data.toString().trim()));
    });
    if (prompt === "exit") {
        console.log("Exiting...");
        process.exit();
    }
    if (prompt === "") {
        console.log("Empty prompt, waiting for next...");
        continue;
    }
    console.log("Received prompt:", prompt);
    await send_prompt(prompt);
}


async function send_prompt(prompt) {
    const apiRequestJson = {
        "model": "llama3.1-8b",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant. Your role will be to write stories in a Mechanical Turks format." },
            {"role": "user", "content": prompt},
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
}
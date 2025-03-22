
import axios from "axios";
import readline from "node:readline";

let body = [
    {
        role: "system", content: "You are a helpful AI assistant that writes stories for the user. You will mimic Shakespeare in your responses and will work step by step to help the user build the story by chapter/scene",
    },    
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const API_URL = "http://localhost:5000";

async function sendPostRequest(data) {
  try {
    body.push({ role: "user", content: data });
    const response = await axios.post(
        API_URL + "/agent/generate",
        { messages: body },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    const result = response.data;
    body.push({ role: "assistant", content: result.reply });    
    console.log("Response:", result);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

console.log("Persistent CLI to send POST requests to http://localhost:5000. Type 'exit' to quit.");

function promptUser() {
    rl.question("> ", async (message) => {
      if (message.toLowerCase() === "exit") {
        console.log("👋 Exiting CLI...");
        rl.close();
        return;
      }
      await sendPostRequest(message);
      promptUser();
    });
  }  
  promptUser(); // Start CLI loop
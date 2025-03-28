
import axios from "axios";
import readline from "node:readline";
import { create_summarize_payload } from "./agent_container/tools/summarize.js";
import { create_gen_chapter_payload } from "./agent_container/tools/gen_chapter.js";
import { get_function_list } from "./agent_container/tools/function_list.js";
import { draft } from "../promptformatter.js";

let body = [
    {
        role: "system", content: "You are a helpful AI assistant that writes stories for the user. You will write the first chapter. Make sure to use a markdown format when returning the chapter. Dont ever ask any questions and dont ever say anything besides the actual chapter response",
    },    
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const API_URL = "http://localhost:5000";

async function sendFunctionList() {
	  try {
	let function_list_payload = get_function_list();
	let function_list_response = await axios.post(
	  API_URL + "/agent/functions",
	  function_list_payload,
	  {
		headers: { "Content-Type": "application/json" },
	  },
	);
	console.log("Function List Response:", function_list_response.data);
  } catch (error) {
	console.error("Error:", error.message);
  }
}

async function sendPostRequest(data) {
  try {
    //body.push({ role: "user", content: data });
	let generate_payload = create_gen_chapter_payload(data);
    let chapter_response = await axios.post(
        API_URL + "/agent/generate",
		generate_payload,
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    let result = chapter_response.data;
    //body.push({ role: "assistant", content: result.reply });
    console.log("Response:", chapter_response.data);
	let summarize_payload = create_summarize_payload(result.reply);
	let summarize_response = await axios.post(
		API_URL + "/agent/generate",
		summarize_payload,
		{
			headers: { "Content-Type": "application/json" },
		},
	);
	console.log("Summarize Response:", summarize_response.data);
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
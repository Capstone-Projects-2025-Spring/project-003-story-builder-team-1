import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

// Function to call Llama 3 API
async function queryLlama3(prompt) {
    const response = await fetch("http://localhost:PORT/courier/story_call", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "llama3.1-8b",
            messages: [
                { role: "system", content: "You are an AI assistant." },
                { role: "user", content: prompt }
            ],
            stream: false
        }),
    });

    if (!response.ok) {
        throw new Error(`Llama3 API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content; // Adjust based on your API response format
}

// Define a tool for searching (example)
const search = tool(async ({ query }) => {
    if (query.toLowerCase().includes("sf") || query.toLowerCase().includes("san francisco")) {
        return "It's 60 degrees and foggy.";
    }
    return "It's 90 degrees and sunny.";
}, {
    name: "search",
    description: "Call to surf the web.",
    schema: z.object({
        query: z.string().describe("The query to use in your search."),
    }),
});

// Create the agent with Llama3 as the LLM
const agent = createReactAgent({
    llm: {
        invoke: async ({ messages }) => {
            const userMessage = messages.find(msg => msg.role === "user")?.content;
            if (!userMessage) throw new Error("No user message found!");
            return await queryLlama3(userMessage);
        }
    },
    tools: [search],
});

// Invoke the agent with a test message
const result = await agent.invoke({
    messages: [{ role: "user", content: "What is the weather in SF?" }]
});

// Output the response
console.log("Llama 3 Response:", result);

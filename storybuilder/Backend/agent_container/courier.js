import express from "express";
import llama from "./llama_service.js"; // Import the LlamaAI instance
const router = express.Router();

// Set up the API endpoint for chat
router.post("/story_call", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    console.log("Received API request:", message);
    const response = await send_prompt(message);
    res.status(200).json(response);

  } catch (error) {
    console.error("Error in API call:", error);
    res.status(500).json({ error: "Failed to get response from AI agent" });
  }
});

// Function to send a prompt to the AI model and get a response
async function send_prompt(prompt) {
  const apiRequestJson = {
    model: "llama3.1-8b",
    messages: [
      { role: "system", content: "You are a helpful AI assistant that writes stories for the user. You will mimic Shakespeare in your responses and will work step by step to help the user build the story by chapter/scene" },
      { role: "user", content: prompt},
    ],
    stream: false,
  };

  try {
    const response = await llama.run(apiRequestJson);
    conversationHistory.push({ role: "user", content: prompt });
    // Add the AI's response to the conversation history
    conversationHistory.push({ role: "assistant", content: response.choices[0].message.content });
    console.log("AI response:", response.choices[0].message.content);
    return response.choices[0].message.content;
  } catch (error) {
    console.error("API call failed:", error.message);
    throw error;
  }
}

export default router;

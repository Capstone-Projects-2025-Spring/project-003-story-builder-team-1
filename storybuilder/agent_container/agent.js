import express from "express";
import LlamaAI from "llamaai";

const llama = new LlamaAI(process.env.API_KEY);
const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    console.log("Received API request:", message);
    const response = await send_prompt(message);
    res.json({ reply: response });

  } catch (error) {
    console.error("Error in API call:", error);
    res.status(500).json({ error: "Failed to get response from AI agent" });
  }
});

async function send_prompt(prompt) {
  const apiRequestJson = {
    model: "llama3.1-8b",
    messages: [
      { role: "system", content: "You are a helpful AI assistant." },
      { role: "user", content: prompt },
    ],
    stream: false,
  };

  try {
    const response = await llama.run(apiRequestJson);
    return response.choices[0].message.content;
  } catch (error) {
    console.error("API call failed:", error.message);
    throw error;
  }
}

export default router;

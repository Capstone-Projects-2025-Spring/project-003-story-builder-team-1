import express from "express";

export default function courier_routes(llama) {
  const router = express.Router();

// Set up the API endpoint for chat
router.post("/generate", async (req, res) => {
  try {
    if (!req.body.messages) {
      return res.status(400).json({ error: "Message is required" });
    }
    console.log("Received API request:", req.body.messages);
    const response = await send_prompt(req);
    res.status(200).json({ reply: response });

  } catch (error) {
    console.error("Error in API call:", error);
    res.status(500).json({ error: "Failed to get response from LLM" });
  }
});

// Function to send a prompt to the AI model and get a response
async function send_prompt(prompt) {

  // const apiRequestJson = {
  //   model: "llama3.1-8b",
  //   messages: prompt.body.messages,
  //   stream: false,
  // };

  try {
    const response = await llama.run(prompt.body);
    console.log("AI response:", response.choices[0].message.content);
    return response.choices[0].message.content;
  } catch (error) {
    console.error("API call failed:", error.message);
    throw error;
  }
}

return router;
}
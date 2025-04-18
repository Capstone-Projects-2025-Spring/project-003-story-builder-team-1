import express from "express";
import { stream_handler } from "../stream_handler.js";
import { BaseCallbackHandler } from "@langchain/core/callbacks/base";
import { ChatDeepSeek } from "@langchain/deepseek";
import { outline_agent } from "../scratchwork/agents.js"

export default function courier_routes(llm) {
  const router = express.Router();

// Set up the API endpoint for chat
router.post("/generate", async (req, res) => {
  try {
    if (!req.body.messages) {
      return res.status(400).json({ error: "Message is required" });
    }
    console.log("Received API request:", req.body);
    const response = await send_prompt(req);
    res.status(200).json({ response });

  } catch (error) {
    console.error("Error in API call:", error);
    res.status(500).json({ error: "Failed to get response from LLM" });
  }
});

router.post("/stream", async (req, res) => {
  if (!req.body.messages) {
    return res.status(400).json({ error: "Messages are required" });
  }

  // Build the SSE handler
  const sse_handler = stream_handler(res);

  // Patch the prototype so it never errors
  ChatDeepSeek.prototype.getNumTokens = async function (text) {
    // crude approximation, no errors
    return Math.ceil(text.length / 4);
  };

  // Instantiate DeepSeek with streaming enabled
  const model = new ChatDeepSeek({
    apiKey: process.env.API_KEY,
    model: "deepseek-chat",
    streaming: true,    
    callbacks: [sse_handler],
    tool_calls: "auto"
  });

  // Invoke (internally consumes the stream and fires callbacks)D
  try {
    await model.invoke(req.body.messages);
    res.end(); // End the response when done
  } catch (err) {
    // If something goes wrong *before* handleLLMEnd, end the stream here
    console.error("Invocation error:", err);
    // If you haven’t already ended:
    if (!res.writableEnded) {
      res.write(`data: ERROR: ${err.message}\n\n`);
      res.status(500).json({ error: "Failed to get response from LLM" });
    }
  }
  // try {
  //   // 1️⃣ get the stream (this actually kicks off the request)
  //   const stream = await model.invoke(req.body.messages, {
  //     callbacks: [sse_handler],
  //   });

  //   // 2️⃣ iterate it to keep it alive & fire callbacks
  //   for await (const _chunk of stream) {
  //     // no-op: your sseHandler already wrote each token
  //   }
  // } catch (err) {
  //   console.error("Stream invocation error:", err);
  //   if (!res.writableEnded) {
  //     res.write(`data: ERROR: ${err.message}\n\n`);
  //     res.end();
  //   }
  // }
});

router.post("/stream_graph", async (req, res) => {
  if (!req.body.messages) {
    return res.status(400).json({ error: "Messages are required" });
  }
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const outline_agent_graph = outline_agent;

  try {
    const agent_response = await outline_agent_graph.stream({messages: req.body.messages}, {callbacks: [stream_handler(res)]});
    while (!agent_response.done) {
      // Wait for the next chunk of data
      await new Promise(resolve => setTimeout(resolve, 100)); // Adjust delay as needed
    }
    console.log("Agent response:", agent_response);
    res.end(); // End the response when done
  } catch (err) {
    console.error(err);
    if (!res.writableEnded) {
      res.write(`data: ERROR: ${err.message}\n\n`);
      res.end();
    }
  }
});

router.post("/stream-agent", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const handler = new stream_handler(res);

  try {
    await agent_executor.invoke({
      input: req.body.prompt,
    }, {
      callbacks: [handler],
    });
  } catch (err) {
    console.error(err);
    if (!res.writableEnded) {
      res.write(`data: ERROR: ${err.message}\n\n`);
      res.end();
    }
  }
});

// Function to send a prompt to the AI model and get a response
async function send_prompt(prompt) {

  try {
    const response = await llm.run(prompt.body);
    console.log("AI response:", response?.choices[0]);
    return response?.choices[0]?.message?.content;
  } catch (error) {
    console.error("API call failed:", error.message);
    throw error;
  }
}

return router;
}
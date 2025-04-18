import express from "express";
import { stream_handler } from "../stream_handler.js";
import { BaseCallbackHandler } from "@langchain/core/callbacks/base";
import { ChatDeepSeek } from "@langchain/deepseek";
import { generate_outline_agent, critique_outline_agent, vote_critique_outline_agent, revise_outline_agent, first_chapter_agent, next_chapter_agent, critique_chapter_agent, vote_critique_chapter_agent, rewrite_chapter_agent, vote_chapter_agent, outline_supervisor_graph, chapter_supervisor_graph } from "../scratchwork/agents.js"
import { isEqualsGreaterThanToken } from "typescript";

export default function agent_routes(llm) {
  const router = express.Router();

//function to use later to clean a lot of duplicate code, wanna make sure the endpoints work by themselves first
/*

async function send_off(agent_graph, message, stream_handler) {
  try {
    const agent_response = await agent_graph.stream({messages: message}, {callbacks: [stream_handler(res)]});
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
}

*/

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

router.post("/generate_outline", async (req, res) => {
  if (!req.body.messages) {
    return res.status(400).json({ error: "Messages are required" });
  }
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const outline_agent_graph = generate_outline_agent;

  const input = {
    persona: req.body.persona,
    prompt_info: req.body.prompt_info
};

  try {
    const agent_response = await outline_agent_graph.stream({messages: input}, {callbacks: [stream_handler(res)]});
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

router.post("/generate_critique_outline", async (req, res) => {
  if (!req.body.messages) {
    return res.status(400).json({ error: "Messages are required" });
  }
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const outline_agent_graph = critique_outline_agent;

  const input = {
    persona: req.body.persona,
    prompt_info: req.body.prompt_info,
    outline: req.body.outline
};

  try {
    const agent_response = await outline_agent_graph.stream({messages: input}, {callbacks: [stream_handler(res)]});
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


router.post("/vote_critique_outline", async (req, res) => {
  if (!req.body.messages) {
    return res.status(400).json({ error: "Messages are required" });
  }
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const outline_agent_graph = vote_critique_outline_agent;

  const input = {
    persona: req.body.persona,
    outline: req.body.outline,
    critique: req.body.critiques
};

  try {
    const agent_response = await outline_agent_graph.stream({messages: input}, {callbacks: [stream_handler(res)]});
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


router.post("/rewrite_outline", async (req, res) => {
  if (!req.body.messages) {
    return res.status(400).json({ error: "Messages are required" });
  }
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const outline_agent_graph = revise_outline_agent;

  const input = {
    persona: req.body.persona,
    critique: req.body.critiques,
    prompt_info: req.body.prompt_info,
    outline: req.body.outline,
};



  try {
    const agent_response = await outline_agent_graph.stream({messages: input}, {callbacks: [stream_handler(res)]});
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

router.post("/first_chapter", async (req, res) => {
  if (!req.body.messages) {
    return res.status(400).json({ error: "Messages are required" });
  }
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const chapter_agent_graph = first_chapter_agent;

  const input = {
    persona: req.body.persona,
    prompt_info: req.body.prompt_info,
    outline: req.body.outline,
};

  try {
    const agent_response = await chapter_agent_graph.stream({messages: input}, {callbacks: [stream_handler(res)]});
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

router.post("/next_chapter", async (req, res) => {
  if (!req.body.messages) {
    return res.status(400).json({ error: "Messages are required" });
  }
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const chapter_agent_graph = next_chapter_agent;

  const input = {
    persona: req.body.persona,
    prompt_info: req.body.prompt_info,
    chapter: req.body.chapter,
    outline: req.body.outline,
};

  try {
    const agent_response = await chapter_agent_graph.stream({messages: input}, {callbacks: [stream_handler(res)]});
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

router.post("/critique_chapter", async (req, res) => {
  if (!req.body.messages) {
    return res.status(400).json({ error: "Messages are required" });
  }
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const chapter_agent_graph = critique_chapter_agent;

  const input = {
    persona: req.body.persona,
    prompt_info: req.body.prompt_info,
    chapter: req.body.chapter,
    outline: req.body.outline,
};

  try {
    const agent_response = await chapter_agent_graph.stream({messages: input}, {callbacks: [stream_handler(res)]});
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

router.post("/vote_critique_chapter", async (req, res) => {
  if (!req.body.messages) {
    return res.status(400).json({ error: "Messages are required" });
  }
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const chapter_agent_graph = vote_critique_chapter_agent;

  const input = {
    persona: req.body.persona,
    prompt_info: req.body.prompt_info,
    critique_bank: req.body.critique_bank
};

  try {
    const agent_response = await chapter_agent_graph.stream({messages: input}, {callbacks: [stream_handler(res)]});
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

router.post("/rewrite_chapter", async (req, res) => {
  if (!req.body.messages) {
    return res.status(400).json({ error: "Messages are required" });
  }
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const chapter_agent_graph = rewrite_chapter_agent;

  const input = {
    persona: req.body.persona,
    prompt_info: req.body.prompt_info,
    critique: req.body.critique,
    outline: req.body.outline,
    chapter: req.body.chapter,
};

  try {
    const agent_response = await chapter_agent_graph.stream({messages: input}, {callbacks: [stream_handler(res)]});
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

router.post("/vote_chapter", async (req, res) => {
  if (!req.body.messages) {
    return res.status(400).json({ error: "Messages are required" });
  }
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const chapter_agent_graph = vote_chapter_agent;

  const input = {
    persona: req.body.persona,
    prompt_info: req.body.prompt_info,
    chapter_bank: req.body.chapter_bank
};

  try {
    const agent_response = await chapter_agent_graph.stream({messages: input}, {callbacks: [stream_handler(res)]});
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
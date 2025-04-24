import express from "express";
import { stream_handler } from "../stream_handler.js";
import { BaseCallbackHandler } from "@langchain/core/callbacks/base";
import { generate_outline_agent, vote_generate_outline_agent, critique_outline_agent, vote_critique_outline_agent, revise_outline_agent, vote_revise_outline_agent, first_chapter_agent, vote_first_chapter_agent, next_chapter_agent, vote_next_chapter_agent, critique_chapter_agent, vote_critique_chapter_agent, rewrite_chapter_agent, vote_rewrite_chapter_agent} from "../scratchwork/agents.js"
import { ToolInputParsingException } from "@langchain/core/tools";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import outline_tools from "../tools/zod_out_tools.js";
import chapter_tools from "../tools/zod_chapter_tools.js";


export default function agent_routes(llm) {
  const router = express.Router();

  const outline_tools_list = outline_tools(llm);
  const chapter_tools_list = chapter_tools(llm);
//function to use later to clean a lot of duplicate code, wanna make sure the endpoints work by themselves first
/*

async function stream_send_off(agent_graph, message, stream_handler) {
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

async function structured_send_off(agent_graph, message) {

    try {
      const agent_response = await outline_agent_graph.invoke({
        messages: formatted_input
      }, {callbacks: []});

      
      const tool_message = agent_response.messages.find(
        msg => msg.constructor?.name === "ToolMessage"
      );

      if (!tool_message) {
        return res.status(500).json({ error: "No tool_message found" });
      }
      const raw_content = tool_message.lc_kwargs?.content;
      if (!raw_content) {
        return res.status(500).json({ error: "No content in tool_message" });
      }
      
      let parsed;
    
      try {
        parsed = JSON.parse(raw_content);
        //console.log("PARSED\n\n" + parsed);
        return parsed;
      } catch (err) {
        console.error("Failed to parse tool_message content:", raw_content);
        return res.status(500).json({ error: "Invalid tool_message content" });
      }




}
*/





//global storybuilder prompt for agent sendoff
  const storybuilder_prompt = ChatPromptTemplate.fromTemplate(`
   You are an imaginative author planning and developing a story. You have access to the following creative tools - After using a tool you will reflect on the output and decide what to do next.

  {tools}
    
  Use this structure to guide your thinking:
  
  Goal: the current task you're trying to accomplish

  Thought: reflect on what the story needs next  
  
  Final Reflection: Act as if you are an author reflecting on their work. Dont ever return the exact response of a tool, if anything give a short summary of your thoughts on the output of said tool. After this you are done with the current task and can complete
  
  IT IS IMPERATIVE YOU NEVER RETURN THE EXACT CONTENT OF A TOOL CALL AS THEY ARE ALREADY STREAMED TO THE USER. YOU ARE NEVER TO PROCEED WITH A NEXT STEP, ONLY EVER DO ONE STEP AND THEN STOP.

  -------  Begin!  --------
  
  Goal: {input}  
  `);


// Set up the API endpoint for chat


//outline endpoints


  router.post("/generate_outline", async (req, res) => {
    if (!req.body.messages) {
      return res.status(400).json({ error: "Messages are required" });
    }
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const outline_agent_graph = generate_outline_agent;

    const input = {persona: req.body.messages.persona, input: `prompt_info: ${req.body.messages.prompt_info}`, tools: outline_tools_list[0]};


    const formatted_input = await storybuilder_prompt.formatMessages(input);
    console.log("formatted generate outline input: \n" + formatted_input);
    try {
      const agent_response = await outline_agent_graph.stream({messages: formatted_input}, {callbacks: [stream_handler(res)]});
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

  router.post("/vote_generate_outline", async (req, res) => {
    if (!req.body.messages) {
      return res.status(400).json({ error: "Messages are required" });
    }
    console.log("In vote generate");
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const outline_agent_graph = vote_generate_outline_agent;

    const input = {persona: req.body.messages.persona, input: `prompt_info: ${req.body.messages.prompt_info} \n\noutline_bank: ${req.body.messages.vote_bank}`, tools: outline_tools_list[1]};
    
    const prompted_input = await storybuilder_prompt.formatMessages(input);
    const formatted_input = Array.isArray(prompted_input) ? prompted_input : [prompted_input];

    try {
      let parsed = await structured_send_off(outline_agent_graph, formatted_input);
      console.log("Structured output function output: \n\n " + JSON.stringify(parsed));
      res.write(JSON.stringify({
        winning_index: parsed.winning_index,
        vote_value: parsed.vote_value,
      }));
      res.end();
    } catch (err) {
      console.error(err);
        res.write(`data: ERROR: ${err.message}\n\n`);
        res.end();
    }
  });

  router.post("/critique_outline", async (req, res) => {
    if (!req.body.messages) {
      return res.status(400).json({ error: "Messages are required" });
    }
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const outline_agent_graph = critique_outline_agent;

    const input = {persona: req.body.messages.persona, input: `prompt_info: ${req.body.messages.prompt_info} \n\noutline: ${req.body.messages.outline}`, tools: outline_tools_list[2]};

    const formatted_input = await storybuilder_prompt.formatMessages(input);

    try {
      const agent_response = await outline_agent_graph.stream({messages: formatted_input}, {callbacks: [stream_handler(res)]});
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

    const input = {persona: req.body.messages.persona, input: `prompt_info: ${req.body.messages.prompt_info} \n\ncritique_bank: ${req.body.messages.vote_bank}`, tools: outline_tools_list[3]};

    const formatted_input = await storybuilder_prompt.formatMessages(input);

    try {
      let parsed = await structured_send_off(outline_agent_graph, formatted_input);
      console.log("Structured output function output: \n\n " + JSON.stringify(parsed));
      res.write(JSON.stringify({
        winning_index: parsed.winning_index,
        vote_value: parsed.vote_value,
      }));
      res.end();
    } catch (err) {
      console.error(err);
        res.write(`data: ERROR: ${err.message}\n\n`);
        res.end();
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

    const input = {persona: req.body.messages.persona, input: `critique: ${req.body.messages.prompt_info} \n\nprompt_info: ${req.body.messages.prompt_info} \n\noutline: ${req.body.messages.outline}`, tools: outline_tools_list[4]};

    const formatted_input = await storybuilder_prompt.formatMessages(input);

    try {
      const agent_response = await outline_agent_graph.stream({messages: formatted_input}, {callbacks: [stream_handler(res)]});
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

  router.post("/vote_rewrite_outline", async (req, res) => {
    if (!req.body.messages) {
      return res.status(400).json({ error: "Messages are required" });
    }
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const outline_agent_graph = vote_revise_outline_agent;

    const input = {persona: req.body.messages.persona, input: `prompt_info: ${req.body.messages.prompt_info} \n\noutline_bank: ${req.body.messages.vote_bank}`, tools: outline_tools_list[5]};

    const formatted_input = await storybuilder_prompt.formatMessages(input);

    try {
      let parsed = await structured_send_off(outline_agent_graph, formatted_input);
      console.log("Structured output function output: \n\n " + JSON.stringify(parsed));
      res.write(JSON.stringify({
        winning_index: parsed.winning_index,
        vote_value: parsed.vote_value,
      }));
      res.end();
    } catch (err) {
      console.error(err);
        res.write(`data: ERROR: ${err.message}\n\n`);
        res.end();
    }
  });


  
  //chapter endpoints 



  router.post("/generate_first_chapter", async (req, res) => {
    if (!req.body.messages) {
      return res.status(400).json({ error: "Messages are required" });
    }
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const chapter_agent_graph = first_chapter_agent;

    const input = {persona: req.body.messages.persona, input: `prompt_info: ${req.body.messages.prompt_info} \n\noutline: ${req.body.outline}`, tools: chapter_tools_list[0]};
  
    const formatted_input = await storybuilder_prompt.formatMessages(input);

    try {
      const agent_response = await chapter_agent_graph.stream({messages: formatted_input}, {callbacks: [stream_handler(res)]});
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

  router.post("/vote_generate_first_chapter", async (req, res) => {
    if (!req.body.messages) {
      return res.status(400).json({ error: "Messages are required" });
    }
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const chapter_agent_graph = vote_first_chapter_agent;

    const input = {persona: req.body.messages.persona, input: `prompt_info: ${req.body.messages.prompt_info} \n\nchapter_bank: ${req.body.vote_bank}`, tools: chapter_tools_list[1]};

    const formatted_input = await storybuilder_prompt.formatMessages(vote_first_chapter_agent.tools, input);
    try {
      let parsed = await structured_send_off(chapter_agent_graph, formatted_input);
      console.log("Structured output function output: \n\n " + JSON.stringify(parsed));
      res.write(JSON.stringify({
        winning_index: parsed.winning_index,
        vote_value: parsed.vote_value,
      }));
      res.end();
    } catch (err) {
      console.error(err);
        res.write(`data: ERROR: ${err.message}\n\n`);
        res.end();
    }
  });


  router.post("/generate_next_chapter", async (req, res) => {
    if (!req.body.messages) {
      return res.status(400).json({ error: "Messages are required" });
    }
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const chapter_agent_graph = next_chapter_agent;
    
    const input = {persona: req.body.messages.persona, input: `prompt_info: ${req.body.messages.prompt_info} \n\nchapter: ${req.body.messages.chapter} \n\noutline: ${req.body.messages.outline}`, tools: chapter_tools_list[4]};
 
    const formatted_input = await storybuilder_prompt.formatMessages(next_chapter_agent.tools, input);
    try {
      const agent_response = await chapter_agent_graph.stream({messages: formatted_input}, {callbacks: [stream_handler(res)]});
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

  router.post("/vote_generate_next_chapter", async (req, res) => {
    if (!req.body.messages) {
      return res.status(400).json({ error: "Messages are required" });
    }
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const chapter_agent_graph = vote_next_chapter_agent;

    const input = {persona: req.body.messages.persona, input: `prompt_info: ${req.body.messages.prompt_info} \n\nchapter_bank: ${req.body.vote_bank}`, tools: chapter_tools_list[3]};

    const formatted_input = await storybuilder_prompt.formatMessages(vote_next_chapter_agent.tools, input);
    try {
      let parsed = await structured_send_off(chapter_agent_graph, formatted_input);
      console.log("Structured output function output: \n\n " + JSON.stringify(parsed));
      res.write(JSON.stringify({
        winning_index: parsed.winning_index,
        vote_value: parsed.vote_value,
      }));
      res.end();
    } catch (err) {
      console.error(err);
        res.write(`data: ERROR: ${err.message}\n\n`);
        res.end();
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

    
   

    const input = {persona: req.body.messages.persona, input: `prompt_info: ${req.body.messages.prompt_info} \n\nchapter: ${req.body.messages.chapter} \n\noutline: ${req.body.messages.outline}`, tools: chapter_tools_list[4]};

    const formatted_input = await storybuilder_prompt.formatMessages(critique_chapter_agent.tools, input);
    try {
      const agent_response = await chapter_agent_graph.stream({messages: formatted_input}, {callbacks: [stream_handler(res)]});
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

    const input = {persona: req.body.messages.persona, input: `prompt_info: ${req.body.messages.prompt_info} \n\ncritique_bank: ${req.body.messages.vote_bank}`, tools: chapter_tools_list[5]};

    const formatted_input = await storybuilder_prompt.formatMessages(vote_critique_chapter_agent.tools, input);
    try {
      let parsed = await structured_send_off(chapter_agent_graph, formatted_input);
      console.log("Structured output function output: \n\n " + JSON.stringify(parsed));
      res.write(JSON.stringify({
        winning_index: parsed.winning_index,
        vote_value: parsed.vote_value,
      }));
      res.end();
    } catch (err) {
      console.error(err);
        res.write(`data: ERROR: ${err.message}\n\n`);
        res.end();
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


    const input = {persona: req.body.messages.persona, input: `prompt_info: ${req.body.messages.prompt_info} \n\ncritique: ${req.body.messages.critique} \n\noutline: ${req.body.messages.outline} \n\nchapter: ${req.body.messages.chapter}`, tools: chapter_tools_list[6]};

    const formatted_input = await storybuilder_prompt.formatMessages(rewrite_chapter_agent.tools, input);

    try {
      const agent_response = await chapter_agent_graph.stream({messages: formatted_input}, {callbacks: [stream_handler(res)]});
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

  router.post("/vote_rewrite_chapter", async (req, res) => {
    if (!req.body.messages) {
      return res.status(400).json({ error: "Messages are required" });
    }
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const chapter_agent_graph = vote_rewrite_chapter_agent;

    const input = {persona: req.body.messages.persona, input: `prompt_info: ${req.body.messages.prompt_info} \n\nchapter_bank: ${req.body.messages.vote_bank}`, tools: chapter_tools_list[7]};

    const formatted_input = await storybuilder_prompt.formatMessages(vote_rewrite_chapter_agent.tools, input);
    try {
      let parsed = await structured_send_off(chapter_agent_graph, formatted_input);
      console.log("Structured output function output: \n\n " + JSON.stringify(parsed));
      res.write(JSON.stringify({
        winning_index: parsed.winning_index,
        vote_value: parsed.vote_value,
      }));
      res.end();
    } catch (err) {
      console.error(err);
        res.write(`data: ERROR: ${err.message}\n\n`);
        res.end();
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

async function structured_send_off(agent_graph, message) {

  try {
    const agent_response = await agent_graph.invoke({
      messages: message
    }, {callbacks: []});

    
    const tool_message = agent_response.messages.find(
      msg => msg.constructor?.name === "ToolMessage"
    );

    if (!tool_message) {
      console.log("No tool_message found");
    }
    const raw_content = tool_message.lc_kwargs?.content;
    if (!raw_content) {
      console.log("No content in tool_message");
    }
    
    let parsed;
  
    try {
      parsed = JSON.parse(raw_content);
      console.log("PARSED\n\n" + parsed);
      return parsed;
    } catch (err) {
      console.error("Failed to parse tool_message content:", raw_content);
      return;
    }
}
  catch (err) {
    console.error(err);
    return;
  }
}
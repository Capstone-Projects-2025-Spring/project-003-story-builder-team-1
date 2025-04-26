import express from "express";
import { stream_handler } from "../stream_handler.js";
import { BaseCallbackHandler } from "@langchain/core/callbacks/base";
<<<<<<< Updated upstream
import { ChatDeepSeek } from "@langchain/deepseek";
=======
<<<<<<< HEAD
>>>>>>> Stashed changes
import { generate_outline_agent, vote_generate_outline_agent, critique_outline_agent, vote_critique_outline_agent, revise_outline_agent, vote_revise_outline_agent, first_chapter_agent, vote_first_chapter_agent, next_chapter_agent, vote_next_chapter_agent, critique_chapter_agent, vote_critique_chapter_agent, rewrite_chapter_agent, vote_rewrite_chapter_agent} from "../scratchwork/agents.js"
import outline_tools from "../tools/zod_out_tools.js";
import chapter_tools from "../tools/zod_chap_tools.js";
import { ToolInputParsingException } from "@langchain/core/tools";
import { ChatPromptTemplate } from "@langchain/core/prompts";
<<<<<<< Updated upstream
=======
import outline_tools from "../tools/zod_out_tools.js";
import chapter_tools from "../tools/zod_chapter_tools.js";
=======
import { ChatDeepSeek } from "@langchain/deepseek";
import { generate_outline_agent, vote_generate_outline_agent, critique_outline_agent, vote_critique_outline_agent, revise_outline_agent, vote_revise_outline_agent, first_chapter_agent, vote_first_chapter_agent, next_chapter_agent, vote_next_chapter_agent, critique_chapter_agent, vote_critique_chapter_agent, rewrite_chapter_agent, vote_rewrite_chapter_agent} from "../scratchwork/agents.js"
import outline_tools from "../tools/zod_out_tools.js";
import chapter_tools from "../tools/zod_chap_tools.js";
import { ToolInputParsingException } from "@langchain/core/tools";
import { ChatPromptTemplate } from "@langchain/core/prompts";
>>>>>>> courier_logic_into_frontend
>>>>>>> Stashed changes


export default function agent_routes(llm) {
  const router = express.Router();
<<<<<<< Updated upstream
  const outline_tools_list = outline_tools(llm);
  const chapter_tools_list = chapter_tools(llm);
=======
<<<<<<< HEAD

  const outline_tools_list = outline_tools(llm);
  const chapter_tools_list = chapter_tools(llm);
=======
  const outline_tools_list = outline_tools(llm);
  const chapter_tools_list = chapter_tools(llm);
>>>>>>> Stashed changes
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


/*



*/
<<<<<<< Updated upstream
=======
>>>>>>> courier_logic_into_frontend
>>>>>>> Stashed changes

//global storybuilder prompt for agent sendoff
  const storybuilder_prompt = ChatPromptTemplate.fromTemplate(`
   You are an imaginative author planning and developing a story. You have access to the following creative tools - After using a tool you will reflect on the output and decide what to do next.

  {tools}
    
  Use this structure to guide your thinking:
  
  Goal: the current task you're trying to accomplish

  Thought: reflect on what the story needs next  
  
  Final Reflection: Act as if you are an author reflecting on their work. Dont ever return the exact response of a tool, if anything give a short summary of your thoughts on the output of said tool. After this you are done with the current task and can complete
  
  IT IS IMPERATIVE YOU NEVER RETURN THE EXACT CONTENT OF A TOOL CALL AS THEY ARE ALREADY STREAMED TO THE USER. YOU ARE NEVER TO PROCEED WITH A NEXT STEP, ONLY EVER DO ONE STEP AND THEN STOP.

<<<<<<< Updated upstream
  -------  Begin!  --------
=======
<<<<<<< HEAD

  -------  Begin!  -------
>>>>>>> Stashed changes
  
  Goal: {input}  
  `);


// Set up the API endpoint for chat

const chaptoolList = chapter_tools_list
  .map((t) => `- ${t.name}: ${t.description ?? ""}`);
const chaptoolNames = chapter_tools_list.map((t) => t.name);

<<<<<<< Updated upstream
const outlineToolList = outline_tools_list
  .map((t) => `- ${t.name}: ${t.description ?? ""}`);
const outlineToolNames = outline_tools_list.map((t) => t.name);
=======
=======
  -------  Begin!  --------
  
  Goal: {input}  
  `);


// Set up the API endpoint for chat

const chaptoolList = chapter_tools_list
  .map((t) => `- ${t.name}: ${t.description ?? ""}`);
const chaptoolNames = chapter_tools_list.map((t) => t.name);

const outlineToolList = outline_tools_list
  .map((t) => `- ${t.name}: ${t.description ?? ""}`);
const outlineToolNames = outline_tools_list.map((t) => t.name);
>>>>>>> courier_logic_into_frontend
>>>>>>> Stashed changes
//outline endpoints


  router.post("/generate_outline", async (req, res) => {
    if (!req.body.messages) {
      return res.status(400).json({ error: "Messages are required" });
    }
<<<<<<< Updated upstream
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    console.log(req.body)
=======
<<<<<<< HEAD
>>>>>>> Stashed changes
    const outline_agent_graph = generate_outline_agent;

    const input = {
      persona: req.body.messages.persona,
      input: `prompt_info: ${req.body.messages.prompt_info}`,
      tools: outlineToolList[0]
    };
    console.log("reginput", input);
    const formatted_input = await storybuilder_prompt.formatMessages(input);
<<<<<<< Updated upstream
=======
    await stream_send_off({
      res,
      agent_graph: outline_agent_graph,
      formatted_input,
    });
=======
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    console.log(req.body)
    const outline_agent_graph = generate_outline_agent;

    const input = {
      persona: req.body.messages.persona,
      input: `prompt_info: ${req.body.messages.prompt_info}`,
      tools: outlineToolList[0]
    };
    console.log("reginput", input);
    const formatted_input = await storybuilder_prompt.formatMessages(input);
>>>>>>> Stashed changes
    console.log("Formatted input: ", formatted_input);
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
<<<<<<< Updated upstream
=======
>>>>>>> courier_logic_into_frontend
>>>>>>> Stashed changes
  });

  router.post("/vote_generate_outline", async (req, res) => {
    if (!req.body.messages) {
      return res.status(400).json({ error: "Messages are required" });
    }
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const outline_agent_graph = vote_generate_outline_agent;

<<<<<<< Updated upstream
    const input = {
      persona: req.body.persona,
      input: `prompt_info:${req.body.prompt_info}\noutline_bank: ${req.body.vote_bank}`,
      tools: outlineToolList[1]
  };
    const formatted_input = await storybuilder_prompt.formatMessages(vote_generate_outline_agent.tools, input);
=======
<<<<<<< HEAD
    const vote_bank = req.body.messages.vote_bank.map(m => m.data);
    const input = {input: `persona: ${req.body.messages.persona} \n\nprompt_info: ${req.body.messages.prompt_info} \n\noutline_bank: ${vote_bank}`, tools: out_tools_list[1]};
    
    const prompted_input = await storybuilder_prompt.formatMessages(input);
    const formatted_input = Array.isArray(prompted_input) ? prompted_input : [prompted_input];

>>>>>>> Stashed changes
    try {
      const agent_response = await outline_agent_graph.stream({messages: formatted_input}, {callbacks: []});
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
    const formatted_input = await storybuilder_prompt.formatMessages(JSON.stringify(critique_outline_agent.tools), JSON.stringify(input));

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

<<<<<<< Updated upstream
  router.post("/vote_generate_critique_outline", async (req, res) => {
=======
  router.post("/vote_critique_outline", async (req, res) => {
=======
    const input = {
      persona: req.body.persona,
      input: `prompt_info:${req.body.prompt_info}\noutline_bank: ${req.body.vote_bank}`,
      tools: outlineToolList[1]
  };
    const formatted_input = await storybuilder_prompt.formatMessages(vote_generate_outline_agent.tools, input);
    try {
      const agent_response = await outline_agent_graph.stream({messages: formatted_input}, {callbacks: []});
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
    const formatted_input = await storybuilder_prompt.formatMessages(JSON.stringify(critique_outline_agent.tools), JSON.stringify(input));

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

  router.post("/vote_generate_critique_outline", async (req, res) => {
>>>>>>> courier_logic_into_frontend
>>>>>>> Stashed changes
    if (!req.body.messages) {
      return res.status(400).json({ error: "Messages are required" });
    }
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const outline_agent_graph = vote_critique_outline_agent;

<<<<<<< Updated upstream
    const input = {
      persona: req.body.persona,
      outline: req.body.outline,
      critique_bank: req.body.vote_bank
  };
    const formatted_input = await storybuilder_prompt.formatMessages(vote_critique_outline_agent.tools, input);
=======
<<<<<<< HEAD
    const vote_bank = req.body.messages.vote_bank.map(m => m.data);

    const input = {input: `persona: ${req.body.messages.persona} \n\nprompt_info: ${req.body.messages.prompt_info} \n\ncritique_bank: ${vote_bank}`, tools: out_tools_list[3]};

    const formatted_input = await storybuilder_prompt.formatMessages(input);

>>>>>>> Stashed changes
    try {
      const agent_response = await outline_agent_graph.stream({messages: formatted_input}, {callbacks: []});
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
<<<<<<< Updated upstream
      }
=======
=======
    const input = {
      persona: req.body.persona,
      outline: req.body.outline,
      critique_bank: req.body.vote_bank
  };
    const formatted_input = await storybuilder_prompt.formatMessages(vote_critique_outline_agent.tools, input);
    try {
      const agent_response = await outline_agent_graph.stream({messages: formatted_input}, {callbacks: []});
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
>>>>>>> courier_logic_into_frontend
>>>>>>> Stashed changes
    }
  });

  router.post("/rewrite_outline", async (req, res) => {
    if (!req.body.messages) {
      return res.status(400).json({ error: "Messages are required" });
    }
<<<<<<< Updated upstream
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();
=======
<<<<<<< HEAD
>>>>>>> Stashed changes

    const outline_agent_graph = revise_outline_agent;

    const input = {
      persona: req.body.persona,
      critique: req.body.critique,
      prompt_info: req.body.prompt_info,
      outline: req.body.outline,
  };

    const formatted_input = await storybuilder_prompt.formatMessages(revise_outline_agent.tools, input);

<<<<<<< Updated upstream
=======
    await stream_send_off({
      res,
      agent_graph: outline_agent_graph,
      formatted_input,
    });
=======
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const outline_agent_graph = revise_outline_agent;

    const input = {
      persona: req.body.persona,
      critique: req.body.critique,
      prompt_info: req.body.prompt_info,
      outline: req.body.outline,
  };

    const formatted_input = await storybuilder_prompt.formatMessages(revise_outline_agent.tools, input);

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
>>>>>>> courier_logic_into_frontend
>>>>>>> Stashed changes
  });

  router.post("/vote_rewrite_outline", async (req, res) => {
    if (!req.body.messages) {
      return res.status(400).json({ error: "Messages are required" });
    }
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

<<<<<<< Updated upstream
    const chapter_agent_graph = vote_revise_outline_agent;
=======
<<<<<<< HEAD
    const outline_agent_graph = vote_revise_outline_agent;

    const vote_bank = req.body.messages.vote_bank.map(m => m.data);
    
    const input = {input: `persona: ${req.body.messages.persona} \n\nprompt_info: ${req.body.messages.prompt_info} \n\noutline_bank: ${vote_bank}`, tools: out_tools_list[5]};

    const formatted_input = await storybuilder_prompt.formatMessages(input);
>>>>>>> Stashed changes

    const input = {
      persona: req.body.persona,
      prompt_info: req.body.prompt_info,
      outline_bank: req.body.vote_bank
  };
    const formatted_input = await storybuilder_prompt.formatMessages(vote_revise_outline_agent.tools, input);
    try {
      const agent_response = await chapter_agent_graph.stream({messages: formatted_input}, {callbacks: []});
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
<<<<<<< Updated upstream
      }
=======
=======
    const chapter_agent_graph = vote_revise_outline_agent;

    const input = {
      persona: req.body.persona,
      prompt_info: req.body.prompt_info,
      outline_bank: req.body.vote_bank
  };
    const formatted_input = await storybuilder_prompt.formatMessages(vote_revise_outline_agent.tools, input);
    try {
      const agent_response = await chapter_agent_graph.stream({messages: formatted_input}, {callbacks: []});
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
>>>>>>> courier_logic_into_frontend
>>>>>>> Stashed changes
    }
  });


  
  //chapter endpoints 



  router.post("/generate_first_chapter", async (req, res) => {
    if (!req.body.messages) {
      return res.status(400).json({ error: "Messages are required" });
    }
<<<<<<< Updated upstream
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const chapter_agent_graph = first_chapter_agent;

=======
<<<<<<< HEAD

    const chapter_agent_graph = first_chapter_agent;

    const input = {input: `persona: ${req.body.messages.persona} \n\nprompt_info: ${req.body.messages.prompt_info} \n\noutline: ${req.body.messages.outline}`, tools: chap_tools_list[0]};
  
    const formatted_input = await storybuilder_prompt.formatMessages(input);

    await stream_send_off({
      res,
      agent_graph: chapter_agent_graph,
      formatted_input,
    });
=======
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const chapter_agent_graph = first_chapter_agent;

>>>>>>> Stashed changes
    const input = {
      persona: req.body.persona,
      prompt_info: req.body.prompt_info,
      outline: req.body.outline,
  };
    const formatted_input = await storybuilder_prompt.formatMessages(first_chapter_agent.tools, input);
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
<<<<<<< Updated upstream
=======
>>>>>>> courier_logic_into_frontend
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
    //console.log("Vote generate tool: " + JSON.stringify(chapter_tools_list[1]));
    const vote_bank = req.body.messages.vote_bank.map(m => m.data);
    const input = {input: `persona: ${req.body.messages.persona} \n\nprompt_info: ${req.body.messages.prompt_info} \n\nchapter_bank: ${vote_bank}`, tools: chap_tools_list[1]};
>>>>>>> Stashed changes

    const input = {
      persona: req.body.persona,
      prompt_info: req.body.prompt_info,
      chapter_bank: req.body.vote_bank
  };
    const formatted_input = await storybuilder_prompt.formatMessages(vote_first_chapter_agent.tools, input);
    try {
      const agent_response = await chapter_agent_graph.stream({messages: formatted_input}, {callbacks: []});
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
<<<<<<< Updated upstream
      }
=======
=======

    const input = {
      persona: req.body.persona,
      prompt_info: req.body.prompt_info,
      chapter_bank: req.body.vote_bank
  };
    const formatted_input = await storybuilder_prompt.formatMessages(vote_first_chapter_agent.tools, input);
    try {
      const agent_response = await chapter_agent_graph.stream({messages: formatted_input}, {callbacks: []});
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
>>>>>>> courier_logic_into_frontend
>>>>>>> Stashed changes
    }
  });


  router.post("/generate_next_chapter", async (req, res) => {
    if (!req.body.messages) {
      return res.status(400).json({ error: "Messages are required" });
    }
<<<<<<< Updated upstream
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const chapter_agent_graph = next_chapter_agent;
=======
<<<<<<< HEAD

    const chapter_agent_graph = next_chapter_agent;
    
    const input = {input: `persona: ${req.body.messages.persona} \n\nprompt_info: ${req.body.messages.prompt_info} \n\nchapter: ${req.body.messages.chapter} \n\noutline: ${req.body.messages.outline}`, tools: chap_tools_list[2]};
 
    const formatted_input = await storybuilder_prompt.formatMessages(input);
    await stream_send_off({
      res,
      agent_graph: chapter_agent_graph,
      formatted_input,
    });
=======
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const chapter_agent_graph = next_chapter_agent;
>>>>>>> Stashed changes

    const input = {
      persona: req.body.persona,
      prompt_info: req.body.prompt_info,
      chapter: req.body.chapter,
      outline: req.body.outline,
  };
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
<<<<<<< Updated upstream
=======
>>>>>>> courier_logic_into_frontend
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
    const input = {
      persona: req.body.persona,
      prompt_info: req.body.prompt_info,
      chapter_bank: req.body.vote_bank
  };
    const formatted_input = await storybuilder_prompt.formatMessages(vote_next_chapter_agent.tools, input);
=======
<<<<<<< HEAD
    const vote_bank = req.body.messages.vote_bank.map(m => m.data);
    const input = {input: `persona: ${req.body.messages.persona} \n\nprompt_info: ${req.body.messages.prompt_info} \n\nchapter_bank: ${vote_bank}`, tools: chap_tools_list[3]};

    const formatted_input = await storybuilder_prompt.formatMessages(input);
>>>>>>> Stashed changes
    try {
      const agent_response = await chapter_agent_graph.stream({messages: formatted_input}, {callbacks: []});
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
<<<<<<< Updated upstream
      }
=======
=======
    const input = {
      persona: req.body.persona,
      prompt_info: req.body.prompt_info,
      chapter_bank: req.body.vote_bank
  };
    const formatted_input = await storybuilder_prompt.formatMessages(vote_next_chapter_agent.tools, input);
    try {
      const agent_response = await chapter_agent_graph.stream({messages: formatted_input}, {callbacks: []});
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
>>>>>>> courier_logic_into_frontend
>>>>>>> Stashed changes
    }
  });

  router.post("/critique_chapter", async (req, res) => {
    if (!req.body.messages) {
      return res.status(400).json({ error: "Messages are required" });
    }
<<<<<<< Updated upstream
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

=======
<<<<<<< HEAD
    const chapter_agent_graph = critique_chapter_agent;
   
    const input = {input: `persona: ${req.body.messages.persona} \n\nprompt_info: ${req.body.messages.prompt_info} \n\nchapter: ${req.body.messages.chapter} \n\noutline: ${req.body.messages.outline}`, tools: chap_tools_list[4]};

    const formatted_input = await storybuilder_prompt.formatMessages(input);
    await stream_send_off({
      res,
      agent_graph: chapter_agent_graph,
      formatted_input,
    });
=======
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

>>>>>>> Stashed changes
    const chapter_agent_graph = critique_chapter_agent;

    const input = {
      persona: req.body.persona,
      prompt_info: req.body.prompt_info,
      chapter: req.body.chapter,
      outline: req.body.outline,
  };
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
<<<<<<< Updated upstream
=======
>>>>>>> courier_logic_into_frontend
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
    const vote_bank = req.body.messages.vote_bank.map(m => m.data);
    const input = {input: `persona: ${req.body.messages.persona} \n\nprompt_info: ${req.body.messages.prompt_info} \n\ncritique_bank: ${vote_bank}`, tools: chap_tools_list[5]};
>>>>>>> Stashed changes

    const input = {
      persona: req.body.persona,
      prompt_info: req.body.prompt_info,
      critique_bank: req.body.vote_bank
  };
    const formatted_input = await storybuilder_prompt.formatMessages(vote_critique_chapter_agent.tools, input);
    try {
      const agent_response = await chapter_agent_graph.stream({messages: formatted_input}, {callbacks: []});
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
<<<<<<< Updated upstream
      }
=======
=======

    const input = {
      persona: req.body.persona,
      prompt_info: req.body.prompt_info,
      critique_bank: req.body.vote_bank
  };
    const formatted_input = await storybuilder_prompt.formatMessages(vote_critique_chapter_agent.tools, input);
    try {
      const agent_response = await chapter_agent_graph.stream({messages: formatted_input}, {callbacks: []});
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
>>>>>>> courier_logic_into_frontend
>>>>>>> Stashed changes
    }
  });

  router.post("/rewrite_chapter", async (req, res) => {
    if (!req.body.messages) {
      return res.status(400).json({ error: "Messages are required" });
    }
<<<<<<< Updated upstream
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

=======
<<<<<<< HEAD
>>>>>>> Stashed changes
    const chapter_agent_graph = rewrite_chapter_agent;

    const input = {
      persona: req.body.persona,
      prompt_info: req.body.prompt_info,
      critique: req.body.critique,
      outline: req.body.outline,
      chapter: req.body.chapter,
  };

    const formatted_input = await storybuilder_prompt.formatMessages(rewrite_chapter_agent.tools, input);

<<<<<<< Updated upstream
=======
    await stream_send_off({
      res,
      agent_graph: chapter_agent_graph,
      formatted_input,
    });
=======
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

    const formatted_input = await storybuilder_prompt.formatMessages(rewrite_chapter_agent.tools, input);

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
>>>>>>> courier_logic_into_frontend
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
    const vote_bank = req.body.messages.vote_bank.map(m => m.data);
    const input = {input: `persona: ${req.body.messages.persona} \n\nprompt_info: ${req.body.messages.prompt_info} \n\nchapter_bank: ${vote_bank}`, tools: chap_tools_list[7]};
>>>>>>> Stashed changes

    const input = {
      persona: req.body.persona,
      prompt_info: req.body.prompt_info,
      chapter_bank: req.body.vote_bank
  };
    const formatted_input = await storybuilder_prompt.formatMessages(vote_rewrite_chapter_agent.tools, input);
    try {
      const agent_response = await chapter_agent_graph.stream({messages: formatted_input}, {callbacks: []});
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
      await agent_executor.stream({
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
<<<<<<< Updated upstream

  return router;
}
=======
}
=======

    const input = {
      persona: req.body.persona,
      prompt_info: req.body.prompt_info,
      chapter_bank: req.body.vote_bank
  };
    const formatted_input = await storybuilder_prompt.formatMessages(vote_rewrite_chapter_agent.tools, input);
    try {
      const agent_response = await chapter_agent_graph.stream({messages: formatted_input}, {callbacks: []});
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
      await agent_executor.stream({
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
>>>>>>> courier_logic_into_frontend
>>>>>>> Stashed changes

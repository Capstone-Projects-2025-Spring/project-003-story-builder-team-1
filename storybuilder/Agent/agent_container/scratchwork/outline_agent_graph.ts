import {
    StateGraph, Annotation, MessageGraph,
    MessagesAnnotation,
  } from "@langchain/langgraph";
import { ToolNode, createReactAgent } from "@langchain/langgraph/prebuilt";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ChatDeepSeek } from "@langchain/deepseek";
import { stream_handler } from "../stream_handler.js";
import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts";
import { concat } from "@langchain/core/utils/stream";
import { AIMessageChunk, 
         HumanMessage,
         BaseMessage, 
         AIMessage} from '@langchain/core/messages';
import outline_tools from "../tools/zod_out_tools.js";
import * as fs from 'fs';
import { pull } from "langchain/hub";
import { model } from "mongoose";
import { ChatOpenAI } from "@langchain/openai";

const prompt = await pull<PromptTemplate>("hwchase17/react");


    

// 1) Define the exact shape you want:
const outline_schema = z.object({
    chapters: z.array(
      z.object({
        title: z.string().describe("The title of the chapter in markdown format."),
        summary: z.string().describe("A brief summary of the chapter's content in markdown format."),
      })
    ),
    totalChapters: z.number(),
});

const outline_prompt = ChatPromptTemplate.fromTemplate(`
    You are a helpful assistant that creates story outlines.
    Create a detailed outline where you decide the number of chapters based on the following idea:

    "{promptinfo}"
`);

const callbacks = [stream_handler()];

// Patch the prototype so it never errors
ChatDeepSeek.prototype.getNumTokens = async function (_text) {
    // crude approximation, no errors
    return Math.ceil(_text.length / 4);
};

// const llm = new ChatDeepSeek({
//     streaming: true,
//     apiKey: process.env.DEEPSEEK_API_KEY,
//     modelName: "deepseek-chat",
//     callbacks: callbacks,
// });

const openai = new ChatOpenAI({
    streaming: true,
    openAIApiKey: process.env.OPENAI_API_KEY,
    model: "gpt-4o-mini",
});

const tools = outline_tools(openai);


const storybuilder_prompt = ChatPromptTemplate.fromTemplate(`
    You are an imaginative author planning and developing a story. You have access to the following creative tools:
    
    {tools}
    
    Each tool helps with a different part of your storytelling process.
    
    Use this structure to guide your thinking:
    
    Goal: the current task you're trying to accomplish (e.g., write an outline, critique an outline, revise the outline based on critique)  
    Thought: reflect on what the story needs next  
    --- repeat this only one time needed ---
    
    Final Reflection: conclude what you’ve accomplished, or what the next steps are

    After the revision step the process is over. Do not say anything else to the user.
    
    Begin!
    
    Goal: {input}  
    Thought:{agent_scratchpad}
`);

const AnnotationWithReducer = Annotation.Root({
    input: Annotation<string>,
    outline: Annotation<string>,
    critique: Annotation<string>,
    last_tool_call: Annotation<string>,
    messages: Annotation<BaseMessage[]>({
      // Different types are allowed for updates
      reducer: (left: BaseMessage[], right: BaseMessage | BaseMessage[]) => {
        if (Array.isArray(right)) {
          return left.concat(right);
        }
        return left.concat([right]);
      },
      default: () => [],
    }),
});

const input_prompt = ChatPromptTemplate.fromTemplate(`
    You are a helpful assistant that creates story outlines.
    Create a detailed outline where you decide the number of chapters based on the following idea:
    
    
    "{input}"    
    
    The outline should be in the following format:
    
    - Chapter 1: [Chapter Title]
    - Chapter 2: [Chapter Title]
    - Chapter 3: [Chapter Title]
    - Chapter 4: [Chapter Title]
    - Chapter 5: [Chapter Title]

    Increase or reduce the number of chapters based on the story idea.
    `);

const llm_with_tools = openai.bindTools(tools, {tool_choice :"auto"});



const structured_llm = openai.withStructuredOutput(outline_schema);

//const output = structured_llm.invoke("Write a short story outline about a princess");

const graph_builder = new StateGraph(AnnotationWithReducer);

const my_tool_node = new ToolNode(tools);
const outline_node = new ToolNode([tools[0]]);
const critique_node = new ToolNode([tools[1]]);
const revise_node = new ToolNode([tools[2]]);

const react_agent = createReactAgent(
    {
        tools: tools,
        llm: openai,
    },
)

const call_model = async (state: typeof MessagesAnnotation.State) => {
    const input = state.messages[0]; // Temporary cast to bypass type error
      // get the last tool call (if any)
    const lastToolCall = (state as any).last_tool_call
    const toolName = lastToolCall?.name;

    // build up the new state updates
    const updates: any = {
        lastToolCall,
        input,
    };
    const response = await llm_with_tools.invoke(await storybuilder_prompt.formatMessages({
        input: input,
        agent_scratchpad: state.messages,
        tools: tools.map(t => `- ${t.name}`).join("\n"),
        tool_names: tools.map(tool => tool.name).join(", "),
    }));
    console.log("LC KWARGS: ", response.lc_kwargs.additional_kwargs);
    updates.messages = [...state.messages, response]; // Append the new tool call message to the messages array

  return updates;
};

// 4. Improved Conditional Edges
const should_continue = (state: typeof MessagesAnnotation.State) => {
    const { messages } = state;
    const lastMessage = messages[messages.length - 1];
    if ("tool_calls" in lastMessage && Array.isArray(lastMessage.tool_calls) && lastMessage.tool_calls?.length) {
        const lastToolCall = lastMessage.tool_calls[lastMessage.tool_calls.length - 1];

        if (lastToolCall.tool_name === "revise_outline") {
            //return "__end__";
        }
        return "tools";
    }
    return "__end__";
}

const graph = graph_builder
    .addNode("agent", call_model)
    .addNode("tools", my_tool_node)
    .addEdge("__start__", "agent")
    .addConditionalEdges("agent", should_continue)
    .addEdge("tools", "agent")
    .addEdge("agent", "__end__")
    .compile();

// const graph = graph_builder
//     .addNode("agent", call_model)
//     .addNode("outline_tool", outline_node)
//     .addNode("critique_tool", critique_node)
//     .addNode("revise_tool", revise_node)
//     .addEdge("__start__", "agent")
//     .addConditionalEdges("agent", should_continue)
//     .addEdge("outline_tool", "agent")
//     .addEdge("critique_tool", "agent")
//     .addEdge("revise_tool", "agent")
//     .addEdge("agent", "__end__")
//     .compile();

const graphviz = await graph.getGraphAsync();

const dot = graphviz.drawMermaid();

console.log(dot);

const formatted = await storybuilder_prompt.formatMessages(
    {
        input: "Write a superrrrrrr short story about a princress",
        agent_scratchpad: [],
        tools: tools.map(t => `- ${t.name}`).join("\n"),
        tool_names: tools.map(tool => tool.name).join(", "),
    }
)

//const response = await graph.stream({messages: formatted}, {callbacks: callbacks});

export { graph };



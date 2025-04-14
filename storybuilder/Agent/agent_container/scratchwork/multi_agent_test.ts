import { Annotation, StateGraph } from "@langchain/langgraph";
import { ToolNode, createReactAgent } from "@langchain/langgraph/prebuilt";
import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import { ChatDeepSeek } from "@langchain/deepseek";
import { z } from "zod";
import outline_tools from "../tools/zod_out_tools.ts";
import { stream_handler } from "../stream_handler.js";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const callbacks = [stream_handler()];

// Patch the prototype so it never errors
ChatDeepSeek.prototype.getNumTokens = async function (_text) {
    // crude approximation, no errors
    return Math.ceil(_text.length / 4);
};

const llm = new ChatDeepSeek({
    streaming: true,
    apiKey: process.env.DEEPSEEK_API_KEY,
    modelName: "deepseek-chat",
    callbacks: callbacks,
});

const tools = outline_tools(llm);

const llm_with_tools = llm.bindTools(tools, {tool_choice :"required"});

const storybuilder_prompt = ChatPromptTemplate.fromTemplate(`
    You are an imaginative author planning and developing a story. You have access to the following creative tools:
    
    {tools}
    
    Each tool helps with a different part of your storytelling process.
    
    Use this structure to guide your thinking:
    
    Goal: the current task you're trying to accomplish (e.g., write an outline, critique an outline, revise the outline based on critique)  
    Thought: reflect on what the story needs next  
    Decision: which tool will help you most right now? Choose one from [{tool_names}]  
    Tool Input: what you’ll give the tool to help it do its job  
    Result: the tool’s output  
    --- repeat this only one time needed ---
    
    Write a very short conclusion mimicing an author reflecting on their work.
    An example of a conclusion: "I have created a detailed outline for the story. I will now move on to the next step."

    
    Begin!
    
    Goal: {input}  
    Thought:{agent_scratchpad}
`);

const AnnotationWithReducer = Annotation.Root({
    input: Annotation<string>,
    outline: Annotation<string>,
    critique: Annotation<string>,
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
    last_tool_output: Annotation<string>,
});

const graph_builder = new StateGraph(AnnotationWithReducer);

// Define the prompt for the supervisor to reflect on the agent's output
const supervisorPrompt = ChatPromptTemplate.fromMessages([
    ["system", "You're a thoughtful author reflecting on your writing process."],
    [
      "human",
      `You just performed a tool-assisted action with the following result:\n\n{tool_output}\n\nReflect on what happened and decide what to do next.`,
    ],
]);



  // Define the React Agent
const reactAgent = await createReactAgent({
    llm: llm_with_tools,  // Define your LLM (like DeepSeek here)
    tools: tools,      // Bind your creative tools (outline, critique, revise, etc.)
    prompt: storybuilder_prompt,       // Set up the prompt template for React agent interaction
  });
  
  // Create a LangGraph node that will invoke the agent
const react_agent_node =  async (state) => {
    const input = {
      input: state.input,
      outline: state.outline ?? "",
      critique: state.critique ?? "",
      agent_scratchpad: state.messages ?? [],
      tools: tools.map((t) => `- ${t.name}`).join("\n"), // List available tools
      tool_names: tools.map((tool) => tool.name).join(", "), // Comma-separated tool names
    };

    const output = await reactAgent.invoke(input as any); // Cast to 'any' to bypass type mismatch
  
    // Return state with updated messages and tool output
    return {
      messages: [...state.messages, output],
      last_tool_output: output,  // Record tool output for supervisor reflection
    };
};
  
  // Define the Supervisor node
  const supervisor_node = async (state) => {
    const reflection = await llm.invoke(
      await supervisorPrompt.format({
        tool_output: state.last_tool_output ?? "Nothing yet.",
      })
    );
  
    // Return updated state with the supervisor's reflection and narrative
    return {
      messages: [...state.messages, reflection],
      supervisor_thought: reflection.content, // Record supervisor's thoughts for possible output
    };
};

const react_agent = createReactAgent({
    tools: tools,
    llm: llm,
});

const inputs = await storybuilder_prompt.format({
    input: "Write a story about a dragon and a princess.",
    tools: tools.map(tool => tool.name).join(", "),
    tool_names: tools.map(tool => tool.name).join(", "),
    agent_scratchpad: "I need to write a story about a dragon and a princess. I will start with an outline.",
})

const graph = graph_builder
    .addNode("react_agent", react_agent_node)
    .addNode("supervisor", supervisor_node)
    .addEdge("__start__", "react_agent")
    .addConditionalEdges("react_agent", (state) => {
        const { messages } = state;
        const lastMessage = messages[messages.length - 1];
        if ("tool_calls" in lastMessage && Array.isArray(lastMessage.tool_calls) && lastMessage.tool_calls?.length) {
            return "supervisor";
        }
        return "__end__";
    }
    )
    .addEdge("supervisor", "react_agent")
    .addEdge("react_agent", "__end__")
    .compile();

const result = await graph.invoke({
    input: inputs,
    messages: [],
    last_tool_output: "",
});

import { createSupervisor } from "@langchain/langgraph-supervisor";
import { createReactAgent, ToolNode } from "@langchain/langgraph/prebuilt";
import { ChatDeepSeek } from "@langchain/deepseek";
import { Annotation, StateGraph } from "@langchain/langgraph";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import axios from "axios";
import { stream_handler } from "../stream_handler.js";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import outline_tools from "../tools/zod_out_tools.js";
import chapter_tools from "../tools/zod_chap_tools.js";
import { BaseMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { model } from "mongoose";
import { ChatOpenAI } from "@langchain/openai";
import { StructuredOutputParser } from "langchain/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

const callbacks = [stream_handler()];

// 1) Define the exact shape you want:

/*
const outline_schema = z.object({
    outline: z.array(
      z.object({
        title: z.string(),
        summary: z.string(),
      })
    ),
    totalChapters: z.number(),
});

const chapter_schema = z.object({
  chapters: z.array(
    z.object({
      title: z.string(),
      content: z.string(),
    })
  ),
  totalChapters: z.number(),
});

*/


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

//chatGPT LLM used by agents
const llm = new ChatOpenAI({
    streaming: true,
    openAIApiKey: process.env.OPENAI_API_KEY,
    model: "gpt-4o-mini",
    temperature: 0.1,
});

const outline_tools_list = outline_tools(llm);

const chapter_tools_list = chapter_tools(llm);

const tools = [outline_tools_list[0], outline_tools_list[1], outline_tools_list[2], outline_tools_list[3], outline_tools_list[4], outline_tools_list[5], chapter_tools_list[0], chapter_tools_list[1],  chapter_tools_list[2],  chapter_tools_list[3],  chapter_tools_list[4],  chapter_tools_list[5], chapter_tools_list[6],  chapter_tools_list[7]]; 

//LLM Tools to be used outside of agentic work (potentially)
/*
const outline_llm = llm.bindTools([outline_tools_list], {tool_choice :"auto"});

const generate_outline_llm = llm.bindTools([outline_tools_list[0]], {tool_choice :"auto"});
const critique_outline_llm = llm.bindTools([outline_tools_list[1]], {tool_choice :"auto"});
const vote_outline_critique_llm = llm.bindTools([outline_tools_list[2]], {tool_choice :"auto"});
const revise_llm = llm.bindTools([outline_tools_list[3]], {tool_choice :"auto"});

const chapter_llm = llm.bindTools([chapter_tools_list], {tool_choice :"auto"});

const first_chapter_llm = llm.bindTools([chapter_tools_list[0]], {tool_choice :"auto"});
const next_chapter_llm = llm.bindTools([chapter_tools_list[1]], {tool_choice :"auto"});
const critique_chapter_llm = llm.bindTools([chapter_tools_list[2]], {tool_choice :"auto"});
const vote_critique_chapter_llm = llm.bindTools([chapter_tools_list[3]], {tool_choice :"auto"});
const rewrite_chapter_llm = llm.bindTools([chapter_tools_list[4]], {tool_choice :"auto"});
const vote_chapter_llm = llm.bindTools([chapter_tools_list[5]], {tool_choice :"auto"});

*/



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

//Nodes to be used for agents
//const my_tools_node = new ToolNode(tools);
const generate_outline_node = new ToolNode([outline_tools_list[0]]);
const vote_generate_outline_node = new ToolNode([outline_tools_list[1]]);
const critique_outline_node = new ToolNode([outline_tools_list[2]])
const vote_critique_outline_node = new ToolNode([outline_tools_list[2]])
const revise_outline_node = new ToolNode([outline_tools_list[3]]);
const vote_revise_outline_node = new ToolNode([outline_tools_list[4]])

const first_chapter_node = new ToolNode([chapter_tools_list[0]]);
const vote_first_chapter_node = new ToolNode([chapter_tools_list[1]]);
const next_chapter_node = new ToolNode([chapter_tools_list[2]]);
const vote_next_chapter_node = new ToolNode([chapter_tools_list[3]]);
const rewrite_chapter_node = new ToolNode([chapter_tools_list[4]]);
const vote_rewrite_chapter_node = new ToolNode([chapter_tools_list[5]]);
const critique_chapter_node = new ToolNode([chapter_tools_list[6]]);
const vote_critique_chapter_node = new ToolNode([chapter_tools_list[7]]);



//Creates list of tools to search through 
const toolsList = tools.map((t) => `- ${t.name}: ${t.description ?? ""}`).join("\n");
const toolNames = tools.map((t) => t.name).join(", ");

<<<<<<< Updated upstream
const chaptoolList = chapter_tools_list
=======
<<<<<<< HEAD
const chaptoolsList = chapter_tools_list
>>>>>>> Stashed changes
  .map((t) => `- ${t.name}: ${t.description ?? ""}`);
const chaptoolNames = chapter_tools_list.map((t) => t.name);

const outlineToolList = outline_tools_list
  .map((t) => `- ${t.name}: ${t.description ?? ""}`);
const outlineToolNames = outline_tools_list.map((t) => t.name);

=======
const chaptoolList = chapter_tools_list
  .map((t) => `- ${t.name}: ${t.description ?? ""}`);
const chaptoolNames = chapter_tools_list.map((t) => t.name);

const outlineToolList = outline_tools_list
  .map((t) => `- ${t.name}: ${t.description ?? ""}`);
const outlineToolNames = outline_tools_list.map((t) => t.name);

>>>>>>> courier_logic_into_frontend


const boundPrompt = await storybuilder_prompt.partial({
  tools: toolsList,
  //tool_names: toolNames,
});


//Create agents & supervisors with previously-made tool-bound LLMs and nodes

const generate_outline_agent = createReactAgent({
    llm: llm,
    tools: generate_outline_node,
    name: "generate_outline_agent",
});

const vote_generate_outline_agent = createReactAgent({
  llm: llm,
  tools: vote_generate_outline_node,
  name: "vote_generate_outline_agent",
});

const critique_outline_agent = createReactAgent({
    llm: llm,
    tools: critique_outline_node,
    name: "critique_outline_agent",
});

const vote_critique_outline_agent = createReactAgent({
  llm: llm,
  tools: vote_critique_outline_node,
  name: "vote_critique_outline_agent",
});

const revise_outline_agent = createReactAgent({
  llm: llm,
  tools: revise_outline_node,
  name: "revise_outline_agent",
});

const vote_revise_outline_agent = createReactAgent({
  llm: llm,
  tools: vote_revise_outline_node,
  name: "vote_revise_outline_agent",
});

//chapters

const first_chapter_agent = createReactAgent({
    llm: llm,
    tools: first_chapter_node,
    name: "first_chapter_agent",
});

const vote_first_chapter_agent = createReactAgent({
  llm: llm,
  tools: vote_first_chapter_node,
  name: "vote_first_chapter_agent",
});

const next_chapter_agent = createReactAgent({
  llm: llm,
  tools: next_chapter_node,
  name: "next_chapter_agent",
});

const vote_next_chapter_agent = createReactAgent({
  llm: llm,
  tools: vote_next_chapter_node,
  name: "vote_next_chapter_agent",
});

const critique_chapter_agent = createReactAgent({
  llm: llm,
  tools: critique_chapter_node,
  name: "critique_chapter_agent",
});

const vote_critique_chapter_agent = createReactAgent({
  llm: llm,
  tools: vote_critique_chapter_node,
  name: "vote_critique_chapter_agent",
});

const rewrite_chapter_agent = createReactAgent({
  llm: llm,
  tools: rewrite_chapter_node,
  name: "rewrite_chapter_agent",
});

const vote_rewrite_chapter_agent = createReactAgent({
  llm: llm,
  tools: vote_rewrite_chapter_node,
  name: "vote_rewrite_chapter_agent",
});


//supervisors

const outline_supervisor = createSupervisor({
    agents: [generate_outline_agent, critique_outline_agent, vote_critique_outline_agent, revise_outline_agent],
    llm: llm,
    tools: outline_tools_list,
});

const chapter_supervisor = createSupervisor({
    agents: [first_chapter_agent, vote_first_chapter_agent, next_chapter_agent, vote_next_chapter_agent, critique_chapter_agent, vote_critique_chapter_agent, rewrite_chapter_agent, vote_rewrite_chapter_agent],
    llm: llm,
    tools: chapter_tools_list,
});


//Creates final graph
const outline_supervisor_graph = outline_supervisor.compile();
const chapter_supervisor_graph = chapter_supervisor.compile();

const whiskersoutline = `
**Outline for "Whiskers' Whimsical Flight"**

**Prologue: The Dream of Flight**
- Introduce Whiskers, a feline of curious heart and restless spirit.
- Present his longing to soar amidst the clouds, a dream that dances in his mind.
- Set the stage for the adventure, hinting at the trials and triumphs that await.

---

**Chapter 1: The Call of the Sky**
- Whiskers gazes upon the heavens, where birds do flit and frolic.
- He encounters a wise old owl, perched upon a gnarled branch, who speaks of dreams.
- The owl imparts wisdom: “To fly, thou must first believe in thine own wings.”
- Whiskers resolves to seek the means to take to the air.

---

**Chapter 2: The Mischievous Squirrel**
- Whiskers ventures into the woods, where he meets a sprightly squirrel named Nutty.
- Nutty, with a twinkle in his eye, offers to teach Whiskers the art of agility.
- Through playful antics and daring leaps, Whiskers learns the value of courage.
- A challenge arises: a race to the top of the tallest tree, testing Whiskers’ resolve.

---

**Chapter 3: The Dance of the Wind**
- Upon reaching the tree’s summit, Whiskers encounters a friendly bird named Lark.
- Lark shares tales of the wind’s embrace and the freedom it bestows.
- Whiskers, inspired, attempts to mimic Lark’s flight, only to tumble down.
- In his fall, he learns that failure is but a step upon the path to success.

---

**Chapter 4: The Trials of the Heart**
- Whiskers, disheartened, retreats to a quiet glade, pondering his dreams.
- He reflects upon the nature of friendship and the strength it lends.
- The wise owl returns, offering solace and reminding Whiskers of his inner strength.
- A moment of introspection leads to a renewed determination to rise again.

---

**Chapter 5: The Gathering of Allies**
- Whiskers calls upon his newfound friends: Nutty and Lark, to aid in his quest.
- Together, they devise a plan to create wings from leaves and twigs.
- The camaraderie blossoms, illustrating the power of unity in pursuit of dreams.
- They craft a contraption, a whimsical creation that embodies their hopes.

---

**Chapter 6: The First Flight**
- With hearts aflame, Whiskers dons his leafy wings and ascends the hilltop.
- The moment of truth arrives; he stands upon the precipice, trembling yet resolute.
- With a leap of faith, he launches into the air, feeling the wind beneath him.
- A moment of soaring bliss, followed by a swift descent, teaches him the art of perseverance.

---

**Chapter 7: The Lesson of the Skies**
- Whiskers, bruised yet unbroken, learns that flight is not merely a destination.
- He reflects upon the journey, the friends who stood by him, and the lessons learned.
- The wise owl reappears, affirming that true flight lies in the heart’s belief.
- Whiskers embraces his dreams anew, understanding that the sky is but a canvas.

---

**Epilogue: The Spirit of Flight**
- Whiskers, now a symbol of courage and friendship, shares his tale with others.
- He inspires fellow creatures to chase their dreams, no matter how lofty.
- The story concludes with Whiskers gazing at the sky, a twinkle in his eye, forever dreaming.
- A final reflection on the beauty of believing in oneself and the bonds of friendship.

---

Thus, dear reader, this whimsical tale unfolds, a tapestry woven with threads of dreams, courage, and the sweet embrace of friendship. Each chapter a step upon the path, leading to the skies w
here Whiskers shall find his wings.`;


const input = {
    input: whiskersoutline,
<<<<<<< Updated upstream
    tools: chaptoolList[0],
=======
<<<<<<< HEAD
    tools: chaptoolsList[0],
=======
    tools: chaptoolList[0],
>>>>>>> courier_logic_into_frontend
>>>>>>> Stashed changes
};

const config = {
  configurable: {
    thread_id: "your-thread-id", // Useful for memory management
    // Add other configuration options as needed
  },
};


// Define the human message
//const formatted_input = await storybuilder_prompt.formatMessages(input);
//console.log(formatted_input);
//const response = await supervisor_graph.invoke({messages: formatted_input}, {configurable: config, callbacks: callbacks});
//const response = await outline_agent.invoke({messages: formatted_input}, {configurable: config, callbacks: callbacks})
//const response = await first_chapter_agent.invoke({messages: formatted_input}, {configurable: config, callbacks: callbacks});

export {generate_outline_agent, vote_generate_outline_agent, critique_outline_agent, vote_critique_outline_agent, revise_outline_agent, vote_revise_outline_agent, first_chapter_agent, vote_first_chapter_agent, next_chapter_agent, vote_next_chapter_agent, critique_chapter_agent, vote_critique_chapter_agent, rewrite_chapter_agent, vote_rewrite_chapter_agent, outline_supervisor_graph, chapter_supervisor_graph};

//console.log(response.messages.slice(-1).map(m => m.content).join("\n\n"));
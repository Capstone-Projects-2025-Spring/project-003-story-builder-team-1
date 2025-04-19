import { createSupervisor } from "@langchain/langgraph-supervisor";
import { createReactAgent, ToolNode } from "@langchain/langgraph/prebuilt";
import { ChatDeepSeek } from "@langchain/deepseek";
import { Annotation } from "@langchain/langgraph";
import { z } from "zod";
import { stream_handler } from "../stream_handler.js";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import outline_tools from "../tools/zod_out_tools.js";
import chapter_tools from "../tools/zod_chap_tools.js";
import { ChatOpenAI } from "@langchain/openai";
const callbacks = [stream_handler()];
// 1) Define the exact shape you want:
const outline_schema = z.object({
    chapters: z.array(z.object({
        title: z.string(),
        summary: z.string(),
    })),
    totalChapters: z.number(),
});
const storybuilder_prompt = ChatPromptTemplate.fromTemplate(`
  You are an imaginative author planning and developing a story. You have access to the following creative tools - Do not ever repeat back the exact tool responses, just use them:

  {tools}
  
  Each tool helps with a different part of your storytelling process.
  
  Use this structure to guide your thinking:
  
  Goal: the current task you're trying to accomplish (e.g., write, critique, revise the based on critique)  
  Thought: reflect on what the story needs next  
  Decision: Use the {tool_names} tools to help you with your task then move on to Final Reflection.
  
  Final Reflection: conlude as an author would what might be done next
  
  Begin!
  
  Goal: {input}  
  Thought:{agent_scratchpad}
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
const llm = new ChatOpenAI({
    streaming: true,
    openAIApiKey: process.env.OPENAI_API_KEY,
    model: "gpt-4o-mini",
    temperature: 0.1,
});
const tools = outline_tools(llm);
const chapter_tools_list = chapter_tools(llm);
const llm_with_tools = llm.bindTools(tools, { tool_choice: "auto" });
const outline_llm = llm.bindTools([tools[0]], { tool_choice: "auto" });
const critique_llm = llm.bindTools([tools[1]], { tool_choice: "auto" });
const revise_llm = llm.bindTools([tools[2]], { tool_choice: "auto" });
const AnnotationWithReducer = Annotation.Root({
    input: (Annotation),
    outline: (Annotation),
    critique: (Annotation),
    messages: Annotation({
        // Different types are allowed for updates
        reducer: (left, right) => {
            if (Array.isArray(right)) {
                return left.concat(right);
            }
            return left.concat([right]);
        },
        default: () => [],
    }),
    last_tool_output: (Annotation),
});
const outline_tool = tools[0];
const critique_tool = tools[1];
const revise_tool = tools[2];
const my_tools_node = new ToolNode(tools);
const outline_node = new ToolNode([tools[0]]);
const critique_node = new ToolNode([tools[1]]);
const revise_node = new ToolNode([tools[2]]);
const chapter_tools_node = new ToolNode(chapter_tools_list);
const chapter_draft_node = new ToolNode([chapter_tools_list[0]]);
const chapter_critique_node = new ToolNode([chapter_tools_list[1]]);
const chapter_revise_node = new ToolNode([chapter_tools_list[2]]);
const toolsList = tools
    .map((t) => `- ${t.name}: ${t.description ?? ""}`)
    .join("\n");
const toolNames = tools.map((t) => t.name).join(", ");
const chaptoolsList = chapter_tools_list
    .map((t) => `- ${t.name}: ${t.description ?? ""}`)
    .join("\n");
const chaptoolNames = chapter_tools_list.map((t) => t.name).join(", ");
const outline_step_agent = createReactAgent({
    llm: llm,
    tools: my_tools_node,
    name: "outline_step_agent",
});
const chapter_step_agent = createReactAgent({
    llm: llm,
    tools: chapter_tools_node,
    name: "chapter_step_agent",
});
const chapter_draft_agent = createReactAgent({
    llm: llm,
    tools: chapter_draft_node,
    name: "chapter_draft_agent",
});
const outline_agent = createReactAgent({
    llm: llm,
    tools: outline_node,
    name: "outline_agent",
});
const critique_agent = createReactAgent({
    llm: llm,
    tools: critique_node,
    name: "critique_agent",
    prompt: storybuilder_prompt,
});
const revise_agent = createReactAgent({
    llm: llm,
    tools: revise_node,
    name: "revise_agent",
});
const outline_supervisor = createSupervisor({
    agents: [outline_step_agent],
    llm: llm,
    tools: tools,
});
const chapter_supervisor = createSupervisor({
    agents: [chapter_step_agent],
    llm: llm,
    tools: chapter_tools_list,
});
const supervisor_graph = chapter_supervisor.compile();
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
    input: "A story about a cat who learns to fly",
    tools: tools[0].name + " - " + tools[0].description,
    tool_names: tools[0].name,
    outline: whiskersoutline,
    critique: "",
    agent_scratchpad: "",
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
//const response = await chapter_draft_agent.invoke({messages: formatted_input}, {configurable: config, callbacks: callbacks});
export { outline_agent, critique_agent, revise_agent, chapter_draft_agent, outline_step_agent, chapter_step_agent, supervisor_graph };
//console.log(response.messages.slice(-1).map(m => m.content).join("\n\n"));

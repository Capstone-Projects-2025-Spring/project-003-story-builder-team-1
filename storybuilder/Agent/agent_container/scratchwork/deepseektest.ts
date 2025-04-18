// test-deepseek-streaming.js
import { ChatDeepSeek } from "@langchain/deepseek";
import { AIMessageChunk } from '@langchain/core/messages';
import { concat } from '@langchain/core/utils/stream';
import { HumanMessage } from "@langchain/core/messages";
import { stream_handler } from "../stream_handler.js";
import tools from "../tools/outline_tools.js";

const handler = stream_handler();

const chat = new ChatDeepSeek({
    model: "deepseek-chat",
    streaming: true,
    temperature: 0.7,
});

chat.bindTools(tools, {tool_choice :"required"});

console.log(chat);

const input = "Write a story about a dragon and a princess.";

const full = await chat.invoke([new HumanMessage(input)]);

// const stream = await chat.stream([new HumanMessage(input)]);
// let full: AIMessageChunk | undefined;
// for await (const chunk of stream) {
//     full = !full ? chunk : concat(full, chunk);
//     process.stdout.write(chunk.text);
// }  

console.log("\n---\nFull Response:\n", full);
  
console.log("\n---\nFinal response:\n", full.content);

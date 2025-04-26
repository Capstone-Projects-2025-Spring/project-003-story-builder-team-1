import { ChatOpenAI } from "@langchain/openai";
const llm = new ChatOpenAI({
    streaming: true,
    openAIApiKey: process.env.OPENAI_API_KEY,
    model: "gpt-4o-mini",
    temperature: 0.1,
});
export default llm; // Export the chat instance for use in other modules

import { ChatDeepSeek } from "@langchain/deepseek";
const chat = new ChatDeepSeek({
    model: "deepseek-chat",
    streaming: false,
    apiKey: process.env.DEEPSEEK_API_KEY,
});
export default chat; // Export the chat instance for use in other modules

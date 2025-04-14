import { ChatDeepSeek } from "@langchain/deepseek";
const chat = new ChatDeepSeek({
    model: "deepseek-chat",
    streaming: false,

});
export default chat; // Export the chat instance for use in other modules

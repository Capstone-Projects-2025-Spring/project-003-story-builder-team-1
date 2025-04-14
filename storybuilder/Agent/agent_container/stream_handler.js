import { BaseCallbackHandler } from "@langchain/core/callbacks/base";

const stream_handler = (res = null) => BaseCallbackHandler.fromMethods({
  handleLLMNewToken: async (t) => {
    if(res) res.write(`data: ${t}\n\n`);
    process.stdout.write(t);
  },
  handleChainStart: async (c) => {
    if(res)  res.write(`data: [chain start: ${c.messages}]\n\n`);
    process.stdout.write(`Chain started: ${c.messages}\n`);
  },
  handleAgentAction: async (a) => {
    if(res) res.write(`data: [action: ${a.tool} -> ${a.toolInput}]\n\n`);
    process.stdout.write(`Agent action: ${a.tool} -> ${a.toolInput}\n`);
  },
  handleToolEnd: async (o) => {
    if(res) res.write(`data: [tool output: ${o.mesages}]\n\n`);
    process.stdout.write(`Tool output: ${o.message}\n`);
  },
  handleChainEnd: async (o) => {
    if(res) res.write(`data: [chain end]\n\n`);
    process.stdout.write(`Chain ended: ${o.messages}\n`);
  },
  handleLLMEnd: async () => {
    if(res) res.write(`data: [DONE]\n\n`);
    process.stdout.write("\n");
  },
  handleLLMError: async (e) => {
    if(res) res.write(`data: ERROR: ${e.message}\n\n`);
    process.stdout.write(`Error: ${e.message}\n`);
  },
});
export { stream_handler }; // Export the stream handler for use in other modules

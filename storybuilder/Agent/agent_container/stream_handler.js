import { BaseCallbackHandler } from "@langchain/core/callbacks/base";

const stream_handler = (res = null, tool_call) => BaseCallbackHandler.fromMethods({
  handleLLMNewToken: async (t, runId, parentRunId, ...rest) => {
    if (tool_call)
      t = "tool_call: " + t; // Prefix with tool call if in progress
    if (res) res.write(`data: ${t}\n\n`);
  },
  handleChainStart: async (c, runId, parentRunId, ...rest) => {
    //if (res) res.write(`data: [chain start: ${JSON.stringify(c)}]\n\n`);
    process.stdout.write(`Chain started: ${JSON.stringify(parentRunId)}\n`);
  },
  handleAgentAction: async (a, runId, parentRunId, ...rest) => {
    //if (res) res.write(`data: [action: ${a.tool} -> ${JSON.stringify(a.toolInput)}]\n\n`);
    process.stdout.write(`Agent action: ${a.tool} -> ${JSON.stringify(a.toolInput)}\n`);
  },
  handleToolStart: async (t, runId, parentRunId, ...rest) => {
    //if (res) res.write(`data: [tool start: ${t.name}]\n\n`);
    process.stdout.write(`Tool started: ${t.name}\n`);
    tool_call = true; // Set the flag to indicate a tool call is in progress
    process.stdout.write("\n");
  },
  handleToolEnd: async (o, runId, parentRunId, ...rest) => {
    //if (res) res.write(`data: [tool output: ${JSON.stringify(o)}]\n\n`);
    process.stdout.write(`Tool output: ${JSON.stringify(o)}\n`);
    tool_call = false; // Reset the flag after tool call ends
    process.stdout.write("\n");
  },
  handleChainEnd: async (o, runId, parentRunId, ...rest) => {
    //if (res) res.write(`data: [chain end: ${JSON.stringify(parentRunId)}]\n\n`);
    if (!parentRunId) {
      if(res)
        res.end(); // End the stream for the outermost run
      console.log('\nAgent invocation completed.\n');
    }
    process.stdout.write("\n");
  },
  handleLLMEnd: async (output, runId, parentRunId, ...rest) => {
    // Only end the stream if this is the outermost run (agent invocation)
    if (!parentRunId) {
      res.write("data: LLM Done\n\n");
    }
  },
  handleLLMError: async (e) => {
    if (res) res.write(`data: ERROR: ${e.message}\n\n`);
    process.stdout.write(`Error: ${e.message}\n`);
  },
});

export { stream_handler }; // Export the stream handler for use in other modules
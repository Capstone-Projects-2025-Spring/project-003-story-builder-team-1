import { BaseCallbackHandler } from "@langchain/core/callbacks/base";

const stream_handler = (res = null) => BaseCallbackHandler.fromMethods({
  parentRunId: null, // Store the parent run ID to determine if this is the outermost run

  handleLLMNewToken: async (t) => {
    if (res) res.write(`data: ${t}\n\n`);
    process.stdout.write(t);
  },
  // handleChainStart: async (c) => {
  //   if (res) res.write(`data: [chain start: ${JSON.stringify(c)}]\n\n`);
  //   process.stdout.write(`Chain started: ${JSON.stringify(c)}\n`);
  // },
  // handleAgentAction: async (a) => {
  //   if (res) res.write(`data: [action: ${a.tool} -> ${JSON.stringify(a.toolInput)}]\n\n`);
  //   process.stdout.write(`Agent action: ${a.tool} -> ${JSON.stringify(a.toolInput)}\n`);
  // },
  // handleToolEnd: async (o) => {
  //   if (res) res.write(`data: [tool output: ${JSON.stringify(o)}]\n\n`);
  //   process.stdout.write(`Tool output: ${JSON.stringify(o)}\n`);
  // },
  handleChainEnd: async (o, runId, parentRunId, ...rest) => {
    //if (res) res.write(`data: [chain end: ${JSON.stringify(parentRunId)}]\n\n`);
    //process.stdout.write(`Chain ended: ${JSON.stringify(parentRunId)}\n`);
    if (!parentRunId) {
      res.end(); // End the stream for the outermost run
      console.log('\n');
    }
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
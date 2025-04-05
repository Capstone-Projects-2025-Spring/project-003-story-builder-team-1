const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    agent_prompt: { type: String, required: true } //could be prompt used to build the agent with the LLM
});

module.exports = mongoose.model('Agent', agentSchema);
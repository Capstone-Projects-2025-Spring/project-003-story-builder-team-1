const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    agent_prompt: { type: String, required: true } //could be prompt used to build the agent with the LLM
});

// Virtual property to generate the URL for an agent
agentSchema.virtual("url").get(function () {
    return `/agent/${this._id}`;
    // This URL can be used in templates or API responses to link to the agent's details page.
});

module.exports = mongoose.model('Agent', agentSchema);
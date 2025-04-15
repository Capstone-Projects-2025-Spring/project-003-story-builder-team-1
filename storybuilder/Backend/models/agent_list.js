// for admin use to create new agents based on an author
const mongoose = require('mongoose');

const agentListSchema = new mongoose.Schema({
    name: { type: String, required: true },
    agent_info: { type: String }
});

// Virtual property to generate the URL for an agent
agentListSchema.virtual("url").get(function () {
    return `/agent/${this._id}`;
    // This URL can be used in templates or API responses to link to the agent's details page.
});

module.exports = mongoose.model('Agent_List', agentListSchema);
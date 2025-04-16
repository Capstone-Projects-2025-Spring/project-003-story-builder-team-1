const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    agent_prompt: {
        story_details: { type: String, required: true },
        extra_details: { type: String, default: null },
        chapter_count: { type: Number, required: true },
    },
    agent_responses: [{
        response: { type: String, required: true },
        story_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Story', required: true },
    }]
});

// Virtual property to generate the URL for an agent
agentSchema.virtual("url").get(function () {
    return `/agent/${this._id}`;
    // This URL can be used in templates or API responses to link to the agent's details page.
});

module.exports = mongoose.model('Agent', agentSchema);
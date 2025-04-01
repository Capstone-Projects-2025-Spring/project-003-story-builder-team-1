const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    story_name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    prompt: { type: String, required: true },
    chapters: [{
        chapter_number: { type: Number },
        content: { type: String },
        agent_chapter_versions: [{
            agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
            agent_chapter_version_content: { type: String }, // Store agent-specific version of the chapter
            votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vote' }],
            critiques: { type: String, required: true }
        }]
    }]
}, { timestamps: true });

// Virtual property to generate the URL for a story
storySchema.virtual("url").get(function () {
  return `/story/${this._id}`;
  // This allows us to easily generate a link to view the full story.
});

// Virtual function to generate a URL for a specific agent's version of a chapter
storySchema.virtual("chapterUrl").get(function () {
  return (chapterNumber, agentId) => `/story/${this._id}/chapter/${chapterNumber}/agent/${agentId}`;
  // This function allows dynamically generating URLs to specific chapter versions created by different agents.
});

module.exports = mongoose.model('Story', storySchema);
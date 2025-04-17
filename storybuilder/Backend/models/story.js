const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    story_name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    prompt: {
      story_details: { type: String, required: true },
      extra_details: { type: String, default: null },
      chapter_count: { type: Number, required: true },
    },
    outline: { type: String },
    critiques: [{
        chapter_number: { type: Number, required: true },
        critique: { type: String, required: true },
    }],
    story_content: [{
        story_chapter_number: { type: Number, required: true },
        text: { type: String, required: true }
    }],
    agents: [{
        agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
        agent_name: { type: String, required: true },
        outline: { type: String },
        chapters: [{
            chapter_number: { type: Number },
            content: { type: String },
            votes: { type: Number, default: 0 },
            critique: { type: String }
        }]
    }],
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
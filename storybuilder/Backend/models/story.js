const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    story_name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    prompt_id: { type: String, required: true },
    chapters: [{
        chapter_number: { type: String },
        content: { type: String },
        agent_chapter_versions: [{
            agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
            chapter_version: { type: String }, // Store agent-specific version of the chapter
            votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vote' }],
            critiques: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Critique' }]
        }]
    }]
}, { timestamps: true });

module.exports = mongoose.model('Story', storySchema);
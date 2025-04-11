const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    story_name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    prompt: { type: String, required: true },
    story_content: [{
        chapter_number: { type: Number, required: true },
        text: { type: String, required: true }
    }],    
    agents: [ 
    {
        agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
        chapters: [{
            chapter_number: { type: Number },
            content: { type: String },
            agent_chapter_versions: [{
                agent_chapter_version_content: { type: String }, // Store agent-specific version of the chapter
                votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vote' }],
                critiques: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Critique' }]
            }]
        }]
    }],
}, { timestamps: true });

module.exports = mongoose.model('Story', storySchema);
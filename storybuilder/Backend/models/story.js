const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  prompt_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Prompt', required: false },
  chapters: [{
    title: { type: String },
    content: { type: String },
    agents: [{
      agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
      chapterVersion: { type: String }, // Store agent-specific version of the chapter
      votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vote' }],
      critiques: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Critique' }]
    }]
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Story', storySchema);
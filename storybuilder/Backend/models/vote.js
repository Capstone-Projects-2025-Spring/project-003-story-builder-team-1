const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    agentVersion: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true }, // The agent's version of the chapter
    chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Story.chapter', required: true }, // The chapter being voted on
    vote: { type: Boolean, required: true }, // true for like, false for dislike
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vote', voteSchema);

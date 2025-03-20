const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true }, // The agent casting the vote
    chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Story.chapter', required: true }, // The chapter being voted on
    votedChapterVersion: { type: mongoose.Schema.Types.ObjectId, ref: 'Story.agent_chapter_versions.agent', required: true } // The agent's chapter version being voted for
});

module.exports = mongoose.model('Vote', voteSchema);
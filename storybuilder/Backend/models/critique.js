const mongoose = require('mongoose');

const critiqueSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The user who made the critique
    agentVersion: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true }, // The agent's version of the chapter being critiqued
    chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Story.chapter', required: true }, // The chapter being critiqued
    critiqueText: { type: String, required: true }, // The critique text
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Critique', critiqueSchema);

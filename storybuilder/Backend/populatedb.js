#! /usr/bin/env node

console.log(
    'This script populates some test users, stories, agents, and critiques into your database. Specify the database as an argument - e.g.: node populatedb "mongodb+srv://youruser:yourpassword@yourcluster.mongodb.net/yourdb?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const User = require("./models/user");
const Story = require("./models/story");
const Agent = require("./models/agent");
// const Critique = require("./models/critique");

const users = [];
const stories = [];
const agents = [];
// const critiques = [];

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
    console.log("Debug: Connecting to database");
    await mongoose.connect(mongoDB);
    console.log("Debug: Connected to database");

    await createUsers();
    await createAgents();
    await createStories();
    // await createCritiques();

    console.log("Debug: Closing mongoose connection");
    mongoose.connection.close();
}

async function createUser(index, username, password) {
    const user = new User({ username, password });
    await user.save();
    users[index] = user;
    console.log(`Added user: ${username}`);
}

async function createAgent(index, name, agent_prompt) {
    const agent = new Agent({ name, agent_prompt });
    await agent.save();
    agents[index] = agent;
    console.log(`Added agent: ${name}`);
}

async function createStory(index, story_name, user, prompt) {
    const story = new Story({ story_name, user, prompt, chapters: [] });
    await story.save();
    stories[index] = story;
    console.log(`Added story: ${story_name}`);
}

// async function createCritique(index, user, agentVersion, chapter, critiqueText) {
//     const critique = new Critique({ user, agentVersion, chapter, critiqueText });
//     await critique.save();
//     critiques[index] = critique;
//     console.log(`Added critique by user ${user.username}`);
// }

async function createUsers() {
    console.log("Adding users");
    await Promise.all([
    createUser(0, "test_user1", "password123"),
    createUser(1, "test_user2", "password456"),
    ]);
}

async function createAgents() {
    console.log("Adding agents");
    await Promise.all([
    createAgent(0, "Agent A", "Prompt for Agent A"),
    createAgent(1, "Agent B", "Prompt for Agent B"),
    ]);
}

async function createStories() {
    console.log("Adding stories");
    await Promise.all([
    createStory(0, "Story One", users[0]._id, "Once upon a time..."),
    createStory(1, "Story Two", users[1]._id, "In a land far away..."),
    ]);
}

// async function createCritiques() {
//     console.log("Adding critiques");
//     await Promise.all([
//     createCritique(0, users[0]._id, agents[0]._id, stories[0]._id, "Great start!"),
//     createCritique(1, users[1]._id, agents[1]._id, stories[1]._id, "Needs more detail."),
//     ]);
// }

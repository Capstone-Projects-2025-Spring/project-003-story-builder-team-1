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
const chapters = [];
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
    await createStoriesAndChapters();

    console.log("Debug: Closing mongoose connection");
    mongoose.connection.close();
}

async function createUser(index, username, password) {
    const existingUser = await User.findOne({ username });
    
    if (existingUser) {
        console.log(`User with username ${username} already exists. Skipping.`);
        users[index] = existingUser; // Use the existing user
    } else {
        const user = new User({ username, password });
        await user.save();
        users[index] = user;
        console.log(`Added user: ${username}`);
    }
}

async function createAgent(index, name, agent_prompt) {
    const agent = new Agent({ name, agent_prompt });
    await agent.save();
    agents[index] = agent;
    console.log(`Added agent: ${name}`);
}

async function createUsers() {
    console.log("Adding users");
    await Promise.all([
        createUser(0, "test_user3", "password123"),
        createUser(1, "test_user4", "password456"),
    ]);
}

async function createAgents() {
    console.log("Adding agents");
    await Promise.all([
        createAgent(0, "Agent C", {
            chapter_count: 5,
            story_details: "Agent A specializes in fantasy story arcs and character development."
        }),
        createAgent(1, "Agent D", {
            chapter_count: 3,
            story_details: "Agent B prefers mystery narratives with plot twists."
        }),
    ]);
}

// 🔧 Combined and updated for new schema
async function createStoriesAndChapters() {
    console.log("Adding stories with chapters and agents");
    const storyData = [
    {
        story_name: "Story 3",
        user: users[0]._id,
        prompt: {
        story_details: "Once upon a time...",
        extra_details: null,
        chapter_count: 3
        },
        story_content: [
        { story_chapter_number: 1, text: "The beginning of an adventure..." }
        ],
        agents: [
        {
            agent: agents[0]._id,
            chapters: [
            {
                chapter_number: 1,
                content: "Agent A's version of Chapter 1",
                votes: 0,
                critique: null // critiques left empty for now
                // votes and critiques left empty for now
            }
            ]
        },
        {
            agent: agents[1]._id,
            chapters: [
            {
                chapter_number: 1,
                content: "Agent B's version of Chapter 1",
                votes: 0,
                critique: null // critiques left empty for now
            }
            ]
        }
        ]
    },
    {
        story_name: "Story 4",
        user: users[1]._id,
        prompt: {
        story_details: "In a land far away...",
        extra_details: null,
        chapter_count: 4
        },
        story_content: [
        { story_chapter_number: 1, text: "A new land full of mysteries..." }
        ],
        agents: [
        {
            agent: agents[0]._id,
            chapters: [
            {
                chapter_number: 1,
                content: "Agent A's version of Chapter 1",
                votes: 0,
                critique: null // critiques left empty for now
            }
            ]
        },
        {
            agent: agents[1]._id,
            chapters: [
            {
                chapter_number: 1,
                content: "Agent B's version of Chapter 1",
                votes: 0,
                critique: null // critiques left empty for now                
            }
            ]
        }
        ]
    }
    ];

    for (let i = 0; i < storyData.length; i++) {
    const story = new Story(storyData[i]);
    await story.save();
    stories[i] = story;
    console.log(`Added story: ${story.story_name}`);
    }
}
    

// async function createCritiques() {
//     console.log("Adding critiques");
//     await Promise.all([
//     createCritique(0, users[0]._id, agents[0]._id, stories[0]._id, "Great start!"),
//     createCritique(1, users[1]._id, agents[1]._id, stories[1]._id, "Needs more detail."),
//     ]);
// }

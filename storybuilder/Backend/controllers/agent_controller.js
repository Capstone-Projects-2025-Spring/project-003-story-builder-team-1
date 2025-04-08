const Agent = require("../models/agent");
const Agent_List = require("../models/agent_list");
const Story = require("../models/story");
const asyncHandler = require("express-async-handler");

// Return a list of agents
exports.agent_list = asyncHandler(async (req, res, next) => {
    const agents = await Agent.find().exec();
    res.json(agents);
});

exports.agent_detail = asyncHandler(async (req, res, next) => {
    const agent = await Agent.findOne({ name: req.params.name }).exec();
    if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
    }
    res.json(agent);
});

// Handle Agent create on POST, inserts a new document into MongoDB.
exports.agent_create_post = asyncHandler(async (req, res, next) => {
    const { name, agent_prompt} = req.body;

    if (!name || !agent_prompt) {
        return res.status(400).json({ error: "Name prompt, and story are required" });
    }

    const newAgent = new Agent({ name, agent_prompt });
    await newAgent.save();

    res.status(200).json({ message: "Agent created", agent: newAgent });
});

// Handle Agent delete on POST, removes a document from MongoDB.
exports.agent_delete_post = asyncHandler(async (req, res, next) => {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
    }
    await Agent.findByIdAndDelete(req.params.id);
    res.json({ message: "Agent deleted successfully" });
});

// Handle Agent update on POST, finds an agent by ID and updates its fields.
exports.agent_update_post = asyncHandler(async (req, res, next) => {
    const { name, agent_prompt } = req.body;

    const agent = await Agent.findById(req.params.id).exec();
    if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
    }

    if (name) agent.name = name;
    if (agent_prompt) agent.agent_prompt = agent_prompt;

    await agent.save();
    res.json({ message: "Agent updated", agent });
});

exports.agent_update_last_response_post = asyncHandler(async (req, res, next) => {
    const { agent_id, story_id } = req.params;
    const { response } = req.body;

    const agent = await Agent.findById(agent_id).exec();
    if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
    }

    if (!response) {
        return res.status(400).json({ error: "Response is required" });
    }

    agent.agent_responses.push({ response, story_id: story_id });
    await agent.save();

    res.json({ message: "Last response updated", agent });
});

exports.agent_get_last_response = asyncHandler(async (req, res, next) => {
    const { agent_id, story_id } = req.params;

    console.log(`📥 Fetching last response for agent: ${agent_id} in story: ${story_id}`);

    // Find agent by ID
    const agent = await Agent.findById(agent_id);
    if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
    }

    // Filter responses belonging to the specific story_id
    const storyResponses = agent.agent_responses.filter(
        (resp) => resp.story_id && resp.story_id.toString() === story_id

    );

    if (storyResponses.length === 0) {
        return res.status(404).json({ error: "No responses found for this story" });
    }

    // Get the last response (based on array order)
    const lastResponse = storyResponses[storyResponses.length - 1];

    res.status(200).json({ response: lastResponse });
});

// AGENT LIST
exports.agent_list = asyncHandler(async (req, res, next) => {
    const agents = await Agent_List.find().exec();
    res.status(200).json(agents);
});
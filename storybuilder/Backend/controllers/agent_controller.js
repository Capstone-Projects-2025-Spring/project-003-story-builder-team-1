const Agent = require("../models/agent");
const Story = require("../models/story");
const asyncHandler = require("express-async-handler");

// Display list of all Agents
exports.agent_list = asyncHandler(async (req, res, next) => {
    const agents = await Agent.find().exec();
    res.json(agents);
});

// Display detail page for a specific Agent
exports.agent_detail = asyncHandler(async (req, res, next) => {
    const agent = await Agent.findById(req.params.id).exec();
    if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
    }
    res.json(agent);
});

// Handle Agent create on POST, inserts a new document into MongoDB.
exports.agent_create_post = asyncHandler(async (req, res, next) => {
    const { name, agent_prompt } = req.body;

    if (!name || !agent_prompt) {
        return res.status(400).json({ error: "Name and prompt are required" });
    }

    const newAgent = new Agent({ name, agent_prompt });
    await newAgent.save();

    res.status(201).json({ message: "Agent created", agent: newAgent });
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

const Agent = require("../models/agent");
const asyncHandler = require("express-async-handler");

// Display list of all Agents
exports.agent_list = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Agent list");
});

// Display detail page for a specific Agent
exports.agent_detail = asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: Agent detail: ${req.params.id}`);
});

// Display Agent create form on GET
exports.agent_create_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Agent create GET");
});

// Handle Agent create on POST
exports.agent_create_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Agent create POST");
});

// Display Agent delete form on GET
exports.agent_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Agent delete GET");
});

// Handle Agent delete on POST
exports.agent_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Agent delete POST");
});

// Display Agent update form on GET
exports.agent_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Agent update GET");
});

// Handle Agent update on POST
exports.agent_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Agent update POST");
});

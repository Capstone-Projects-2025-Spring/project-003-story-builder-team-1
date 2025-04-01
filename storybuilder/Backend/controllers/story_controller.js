const Story = require("../models/story");
const asyncHandler = require("express-async-handler");

// Display list of all Stories
exports.story_list = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Story list");
});

// Display detail page for a specific Story
exports.story_detail = asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: Story detail: ${req.params.id}`);
});

// Display Story create form on GET
exports.story_create_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Story create GET");
});

// Handle Story create on POST
exports.story_create_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Story create POST");
});

// Display Story delete form on GET
exports.story_delete_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Story delete GET");
});

// Handle Story delete on POST
exports.story_delete_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Story delete POST");
});

// Display Story update form on GET
exports.story_update_get = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Story update GET");
});

// Handle Story update on POST
exports.story_update_post = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Story update POST");
});

const Story = require("../models/story");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");

// Display list of all Stories
exports.story_list = asyncHandler(async (req, res, next) => {
    const stories = await Story.find().populate("user").exec();
    res.json(stories);
});

// Display detail page for a specific Story
exports.story_detail = asyncHandler(async (req, res, next) => {
    const story = await Story.findById(req.params.id).populate("user").exec();
    if (!story) {
        return res.status(404).json({ error: "Story not found" });
    }
    res.json(story);    
});

// Handle Story create on POST
exports.story_create_post = asyncHandler(async (req, res, next) => {
    const { story_name, user, prompt } = req.body;

    if (!story_name || !user || !prompt) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const newStory = new Story({ story_name, user, prompt, chapters: [] });
    await newStory.save();

    await User.findByIdAndUpdate(user, { $push: { stories: newStory._id } });

    res.status(201).json({ message: "Story created", story: newStory });
});

// Handle Story delete on POST
exports.story_delete_post = asyncHandler(async (req, res, next) => {
    await Story.findByIdAndDelete(req.params.id);
    res.json({ message: "Story deleted" });
});

// Handle Story update on POST
exports.story_update_post = asyncHandler(async (req, res, next) => {
    const { story_name, prompt } = req.body;

    const story = await Story.findById(req.params.id).exec();
    if (!story) {
        return res.status(404).json({ error: "Story not found" });
    }

    if (story_name) story.story_name = story_name;
    if (prompt) story.prompt = prompt;

    await story.save();
    res.json({ message: "Story updated", story });
});

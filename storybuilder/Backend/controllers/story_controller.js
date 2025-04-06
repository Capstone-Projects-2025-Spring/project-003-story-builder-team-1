const Story = require("../models/story");
const User = require("../models/user");
const Agent = require("../models/agent"); 
const asyncHandler = require("express-async-handler");

// Handle Story create on POST
exports.story_create_post = asyncHandler(async (req, res, next) => {
    const { story_name, user, prompt, agents } = req.body;

    if (!story_name || !user || !prompt || !prompt.story_details || !prompt.extra_details || !prompt.chapter_count || !agents) {
        return res.status(404).json({ error: "All fields are required" });
    }

    const agents_exist = await Agent.find({ 'name': { $in: agents } });

    // If any agent doesn't exist, return an error
    if (agents_exist.length !== agents.length) {
        return res.status(404).json({ error: "One or more agents do not exist" });
    }

    // Create the array of agents for the story
    const agent_objects = agents.map(agent_name => {
        const agent = agents_exist.find(a => a.name === agent_name);
        return { agent: agent._id, chapters: [] };
    });

    const newStory = new Story({ story_name, user, prompt, story_content: [], agents: agent_objects});
    await newStory.save();

    await User.findByIdAndUpdate(user, { $push: { stories: newStory._id } });

    res.status(200).json({ message: "Story created", story: newStory });
});

// Handle Story list get on GET
exports.user_stories_list = asyncHandler(async (req, res, next) => {
    const { user_id } = req.params;

    if (!user_id) {
        return res.status(404).json({ error: "User not found" });
    }

    const stories = await Story.find({ user: user_id }).select('story_name story_content').exec();

    res.status(200).json({ stories });
});

// Handle Story get on GET
exports.story_detail = asyncHandler(async (req, res, next) => {
    const { user_id, story_id } = req.params;
    // Find the story by story_id and check if the user_id matches
    const story = await Story.findOne({ _id: story_id, user: user_id }).select('story_name story_content').exec();

    if (!story) {
        return res.status(404).json({ error: "Story not found or user does not have access to this story" });
    }

    res.json(story);
});

exports.story_delete_post = asyncHandler(async (req, res, next) => {
    const { user_id, story_id } = req.params;

    // Find the story by story_id and check if the user_id matches
    const story = await Story.findOne({ _id: story_id, user: user_id });

    if (!story) {
        return res.status(404).json({ error: "Story not found or user does not have access to this story" });
    }

    // Remove the story_id from the user's stories array
    await User.findByIdAndUpdate(user_id, { $pull: { stories: story_id } });

    // Remove the agent responses for this story
    await Agent.updateMany(
        { 'agent_responses.story': story_id },  // Find agents with responses for this story
        { $pull: { agent_responses: { story: story_id } } }  // Remove the specific response from the agent's responses
    );

    // Proceed with deletion if the story exists and the user_id matches
    await Story.findByIdAndDelete(story_id);

    res.json({ message: "Story and associated agent responses deleted" });
});

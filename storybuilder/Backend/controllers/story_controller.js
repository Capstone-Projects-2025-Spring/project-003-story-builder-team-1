const Story = require("../models/story");
const User = require("../models/user");
const Agent = require("../models/agent"); 
const asyncHandler = require("express-async-handler");

// Handle Story create on POST
exports.story_create_post = asyncHandler(async (req, res, next) => {
    const { story_name, prompt, agents } = req.body;
    const { user_id } = req.params; 

    if (!story_name || !prompt || !prompt.story_details || !prompt.extra_details || !prompt.chapter_count || !agents) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // check if user exists
    const user_exists = await User.findById(user_id);
    if (!user_exists) {
        return res.status(404).json({ error: "User does not exist" });
    }

    // check if agents exist
    const agents_exist = await Agent.find({ name: { $in: agents } });
    if (agents_exist.length !== agents.length) {
        return res.status(404).json({ error: "One or more agents do not exist" });
    }

    // create array of agent objects
    const agent_objects = agents.map(agent_name => {
        const agent = agents_exist.find(a => a.name === agent_name);
        return { agent: agent._id, chapters: [] };
    });

    // create and save new story
    const new_story = new Story({ story_name, user: user_id, prompt, story_content: [], agents: agent_objects });
    await new_story.save();

    // update user's stories array
    await User.findByIdAndUpdate(user_id, { $push: { stories: new_story._id } });

    res.status(200).json({ message: "Story created", story: new_story });
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

// Get final version of a specific chapter from story_content
exports.story_chapter_detail = asyncHandler(async (req, res, next) => {
    const { user_id, story_id, chapter_number } = req.params;

    // Find the story and check if the user_id matches the story's user
    const story = await Story.findOne({ _id: story_id, user: user_id }).exec();

    if (!story) {
        return res.status(404).json({ error: "Story not found or user does not have access to this story" });
    }

    const chapter = story.story_content.find(
        (ch) => ch.story_chapter_number === Number(chapter_number)
    );
   
    if (!chapter) {
        return res.status(404).json({ error: "Chapter not found" });
    }

    // Respond with the chapter details
    res.json(chapter);
});

// Handle Story update on POST
exports.story_update_post = asyncHandler(async (req, res, next) => {
    const { story_name, prompt } = req.body;
    const { user_id, story_id } = req.params;

    const user = await User.findById(user_id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const story = await Story.findById(story_id);
    if (!story) {
        return res.status(404).json({ error: "Story not found" });
    }

    if (story.user.toString() !== user_id) {
        return res.status(403).json({ error: "You do not have permission to update this story" });
    }

    if (story_name) story.story_name = story_name;
    if (prompt) story.prompt = prompt;

    await story.save();

    res.status(200).json({ message: "Story updated successfully", story: { story_name: story.story_name, prompt: story.prompt } });
});
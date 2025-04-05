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

    const newStory = new Story({ story_name, user, prompt, story_content: [], agents: [] });
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

// Get final version of a specific chapter from story_content
exports.story_chapter_detail = asyncHandler(async (req, res, next) => {
    const { id, chapter_number } = req.params;

    const story = await Story.findById(id).exec();
    if (!story) {
        return res.status(404).json({ error: "Story not found" });
    }

    const chapter = story.story_content.find(
        (ch) => ch.story_chapter_number === Number(chapter_number)
    );
    

    if (!chapter) {
        return res.status(404).json({ error: "Chapter not found" });
    }

    res.json(chapter);
});


// Edit chapter in final story_content (not agent version)
exports.story_chapter_edit_post = asyncHandler(async (req, res, next) => {
    const { id, chapter_number } = req.params;
    const { text } = req.body;

    const story = await Story.findById(id).exec();
    if (!story) {
        return res.status(404).json({ error: "Story not found" });
    }

    let chapter = story.story_content.find(
        (ch) => ch.story_chapter_number === Number(chapter_number)
    );
    
    if (!chapter) {
        story.story_content.push({ story_chapter_number: Number(chapter_number), text });
    } else {
        chapter.text = text;
    }    

    await story.save();
    res.json({ message: "Chapter content updated", story_content: story.story_content });
});


// Promote an agent's chapter version to final story_content
exports.story_chapter_veto_post = asyncHandler(async (req, res, next) => {
    const { id, chapter_number, agent_id } = req.params;

    const story = await Story.findById(id).exec();
    if (!story) return res.status(404).json({ error: "Story not found" });

    const agent = story.agents.find(a => a.agent.toString() === agent_id);
    if (!agent) return res.status(404).json({ error: "Agent not found" });

    const agentChapter = agent.chapters.find(
        (ch) => ch.chapter_number === Number(chapter_number)
    );

    if (!agentChapter) return res.status(404).json({ error: "Agent chapter not found" });

    const existingFinal = story.story_content.find(
        (ch) => ch.story_chapter_number === Number(chapter_number)
    );
    
    if (existingFinal) {
        existingFinal.text = agentChapter.content;
    } else {
        story.story_content.push({ story_chapter_number: Number(chapter_number), text: agentChapter.content });
    }

    await story.save();
    res.json({ message: "Agent version promoted to final chapter", story_content: story.story_content });
});

// Create outline for a story (initialize chapter numbers and agents if needed)
exports.story_outline_create_post = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { chapter_numbers, agents } = req.body;

    const story = await Story.findById(id).exec();
    if (!story) return res.status(404).json({ error: "Story not found" });

    if (!Array.isArray(chapter_numbers) || !Array.isArray(agents)) {
        return res.status(400).json({ error: "chapter_numbers and agents must be arrays" });
    }

    story.agents = agents.map(agentId => ({
        agent: agentId,
        chapters: chapter_numbers.map(num => ({ chapter_number: num, content: "", votes: [], critiques: [] }))
    }));

    await story.save();
    res.status(201).json({ message: "Outline created with agents and chapter slots", agents: story.agents });
});


// Get summary outline for a story
exports.story_outline = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const story = await Story.findById(id).exec();
    if (!story) return res.status(404).json({ error: "Story not found" });

    const outline = story.story_content.map((chapter) => ({
        chapter_number: chapter.story_chapter_number,
        summary: chapter.text.slice(0, 100)
    }));
    
    res.json({ outline });
});

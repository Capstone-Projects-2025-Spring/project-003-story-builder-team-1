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

// Handle getting the number of chapters in a Story
exports.story_get_number_of_chapters = asyncHandler(async (req, res, next) => {
    const { user_id, story_id } = req.params;

    // Find the user and ensure they exist
    const user = await User.findById(user_id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    // Find the story and check if the user is the owner
    const story = await Story.findById(story_id);
    if (!story) {
        return res.status(404).json({ error: "Story not found" });
    }

    if (story.user.toString() !== user_id) {
        return res.status(403).json({ error: "You do not have permission to access this story" });
    }

    // Get the number of chapters in the story_content array
    const number_of_chapters = story.story_content.length;

    res.status(200).json({ number_of_chapters });
});

// Add chapter to agent-specfic version
exports.story_add_agent_chapter_post = asyncHandler(async (req, res, next) => {
    const { user_id, story_id } = req.params; // Story ID and UserID
    const { agentId, chapter_number, content } = req.body;

    if (!agentId || chapter_number == null || !content) {
        return res.status(400).json({ error: "agentId, chapter_number, and content are required." });
    }

    // Find the user and ensure they exist
    const user = await User.findById(user_id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    // Find the story
    const story = await Story.findById(story_id);
    if (!story) return res.status(404).json({ error: "Story not found" });

    // Find the agent in the agents array
    const agentEntry = story.agents.find(agentObj => agentObj.agent.toString() === agentId);
    
    if (agentEntry) {
        // Check if chapter_number already exists
        const chapterExists = agentEntry.chapters.some(ch => ch.chapter_number === chapter_number);
        if (chapterExists) {
            return res.status(400).json({ error: `Chapter number ${chapter_number} already exists for this agent.` });
        }
        
        // Append the chapter to this agent's chapters
        agentEntry.chapters.push({ chapter_number, content });
    } else {
        // If agent not found, add a new agent with the chapter
        story.agents.push({
            agent: agentId,
            chapters: [{ chapter_number, content }]
        });
    }

    // Save the updated story
    await story.save();

    res.status(200).json({ message: "Chapter added successfully", story });
});


exports.story_add_critique_post = asyncHandler(async (req, res, next) => {
    const { user_id, story_id, agent_id, chapter_number } = req.params; // Story ID and User ID and Chapter ID
    const { critique } = req.body;

    if (!critique) {
        return res.status(400).json({ error: "Critique is required." });
    }

    // Find the user and ensure they exist
    const user = await User.findById(user_id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    
    // Find the story
    const story = await Story.findById(story_id);
    if (!story) {
        return res.status(404).json({ error: "Story not found" });
    }
    
    // Log all agent IDs in the story for debugging
    const agentIdsInStory = story.agents.map(agentObj => agentObj.agent.toString());
    
    const agentEntry = story.agents.find(agentObj => agentObj.agent.toString() === agent_id);
    // console.log(`Checking agent in story: ${agentObj.agent.toString()}`);
    if (!agentEntry) {
        return res.status(404).json({ error: "Agent not found in this story" });
    }
    
    // Find the chapter in the agent's chapters
    const chapter = agentEntry.chapters.find(ch => ch.chapter_number === Number(chapter_number));
    if (!chapter) {
        return res.status(404).json({ error: "Chapter not found" });
    }
    
    // Check if the critique already exists
    const existingCritique = chapter.critique;
    if (existingCritique) {
        return res.status(400).json({ error: "Critique already exists for this chapter" });
    }  

    // Add critique to the chapter
    chapter.critique = critique;
    

    // Save the updated story
    await story.save();

    res.status(200).json({ message: "Critique added successfully", story });
});

exports.story_get_critique = asyncHandler(async (req, res, next) => {
    const { user_id, story_id, agent_id, chapter_number } = req.params; // Story ID and User ID and Chapter ID

    // Find the user and ensure they exist
    const user = await User.findById(user_id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    
    // Find the story
    const story = await Story.findById(story_id);
    if (!story) {
        return res.status(404).json({ error: "Story not found" });
    }
    
    // Find the agent in the agents array
    const agentEntry = story.agents.find(agentObj => agentObj.agent.toString() === agent_id);
    if (!agentEntry) {
        return res.status(404).json({ error: "Agent not found in this story" });
    }
    
    // Find the chapter in the agent's chapters
    const chapter = agentEntry.chapters.find(ch => ch.chapter_number === Number(chapter_number));
    if (!chapter) {
        return res.status(404).json({ error: "Chapter not found" });
    }

    res.status(200).json({ critique: chapter.critique });
});

exports.story_agent_chapter_votes = asyncHandler(async (req, res, next) => {
    const { user_id, story_id, agent_id, chapter_number } = req.params; // Story ID and User ID and Chapter ID

    // Find the user and ensure they exist
    const user = await User.findById(user_id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    
    // Find the story
    const story = await Story.findById(story_id);
    if (!story) {
        return res.status(404).json({ error: "Story not found" });
    }
    
    // Find the agent in the agents array
    const agentEntry = story.agents.find(agentObj => agentObj.agent.toString() === agent_id);
    if (!agentEntry) {
        return res.status(404).json({ error: "Agent not found in this story" });
    }
    
    // Find the chapter in the agent's chapters
    const chapter = agentEntry.chapters.find(ch => ch.chapter_number === Number(chapter_number));
    if (!chapter) {
        return res.status(404).json({ error: "Chapter not found" });
    }

    res.status(200).json({ votes: chapter.votes });
});

exports.story_add_outline_post = asyncHandler(async (req, res, next) => {
    const { user_id, story_id } = req.params; // Story ID and User ID
    const { outline } = req.body;

    if (!outline) {
        return res.status(400).json({ error: "Outline is required." });
    }

    // Find the user and ensure they exist
    const user = await User.findById(user_id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    
    // Find the story
    const story = await Story.findById(story_id);
    if (!story) {
        return res.status(404).json({ error: "Story not found" });
    }
    
    // Check if the outline already exists
    if (story.outline) {
        return res.status(400).json({ error: "Outline already exists for this story." });
    }

    // Add outline to the story
    story.outline = outline;

    // Save the updated story
    await story.save();

    res.status(200).json({ message: "Outline added successfully", story });
});

exports.story_get_outline = asyncHandler(async (req, res, next) => {
    const { user_id, story_id } = req.params; // Story ID and User ID

    // Find the user and ensure they exist
    const user = await User.findById(user_id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    
    // Find the story
    const story = await Story.findById(story_id);
    if (!story) {
        return res.status(404).json({ error: "Story not found" });
    }

    res.status(200).json({ outline: story.outline });
});

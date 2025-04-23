const Story = require("../models/story");
const User = require("../models/user");
const Agent = require("../models/agent"); 
const Persona = require("../models/persona");
const asyncHandler = require("express-async-handler");

// Creates a Story
exports.story_create = asyncHandler(async (req, res, next) => {
    const { story_name, prompt, agents } = req.body;
    const { user_id } = req.params; 

    if (!story_name || !prompt || !prompt.story_details || !agents) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // check if user exists
    const user_exists = await User.findById(user_id);
    if (!user_exists) {
        return res.status(404).json({ error: "User does not exist" });
    }

    // check if agents exist
    const agent_names = agents.map(agent => agent.agent_name);
    const agents_exist = await Persona.find({ name: { $in: agent_names } });
    const available_names = agents_exist.map(a => a.name);
    const all_exist = agent_names.every(name => available_names.includes(name));
    if (!all_exist) {
        return res.status(404).json({ error: "One or more agents do not exist" });
    }

    // create array of agent objects
    const agent_objects = agents.map(agent => {
        const persona = agents_exist.find(a => a.name === agent.agent_name);
        return { agent: persona._id, agent_name: agent.agent_name, chapters: [] };
    });

    // create and save new story
    const new_story = new Story({ story_name, user: user_id, prompt, story_content: [], agents: agent_objects });
    await new_story.save();

    // update user's stories array
    await User.findByIdAndUpdate(user_id, { $push: { stories: new_story._id } });

    const agent_ids = new_story.agents.map(agent => agent._id);

    res.status(201).json({ message: "Story created", story: new_story._id, agent_ids: agent_ids });
});

// Gets a list of all user stories
exports.user_stories_list = asyncHandler(async (req, res, next) => {
    const { user_id } = req.params;

    if (!user_id) {
        return res.status(404).json({ error: "User not found" });
    }

    const stories = await Story.find({ user: user_id }).select('story_name story_content agents outline').exec();

    res.status(200).json({ stories });
});

// Get a Specific Story
exports.story_details = asyncHandler(async (req, res, next) => {
    const { user_id, story_id } = req.params;

    if (!user_id || !story_id) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // Find the story by story_id and check if the user_id matches
    const story = await Story.findOne({ _id: story_id, user: user_id }).select('story_name story_content').exec();

    if (!story) {
        return res.status(404).json({ error: "Story not found or user does not have access to this story" });
    }

    res.status(200).json(story);
});

// Delete a story
exports.story_delete = asyncHandler(async (req, res, next) => {
    const { user_id, story_id } = req.params;

    if (!user_id || !story_id) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // Find the story by story_id and check if the user_id matches
    const story = await Story.findOne({ _id: story_id, user: user_id });

    if (!story) {
        return res.status(404).json({ error: "Story not found or user does not have access to this story" });
    }

    // Remove the story_id from the user's stories array
    await User.findByIdAndUpdate(user_id, { $pull: { stories: story_id } });

    // Proceed with deletion if the story exists and the user_id matches
    await Story.findByIdAndDelete(story_id);

    res.status(200).json({ message: "Story and associated agent responses deleted" });
});

// Get the most voted version of a chapter within a story
exports.story_chapter_details = asyncHandler(async (req, res, next) => {
    const { user_id, story_id, chapter_number } = req.params;

    if (!user_id || !story_id || !chapter_number) {
        return res.status(400).json({ error: "All fields are required" });
    }

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
    res.status(200).json(chapter);
});

// Update Story name
exports.story_name_update = asyncHandler(async (req, res, next) => {
    const { story_name } = req.body;
    const { user_id, story_id } = req.params;


    if (!user_id || !story_id || !story_name) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findById(user_id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    // Find the story and check if the user_id matches the story's user
    const story = await Story.findOne({ _id: story_id, user: user_id }).exec();

    if (!story) {
        return res.status(404).json({ error: "Story not found or invalid permissions" });
    }

    if (story_name) story.story_name = story_name;

    await story.save();

    res.status(200).json({ message: "Story updated successfully", story: { story_name: story.story_name, prompt: story.prompt } });
});

// get number of chapters in a story minus the outline
exports.story_get_number_of_chapters = asyncHandler(async (req, res, next) => {
    const { user_id, story_id } = req.params;

    if (!user_id || !story_id) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // Find the user and ensure they exist
    const user = await User.findById(user_id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    // Find the story and check if the user_id matches the story's user
    const story = await Story.findOne({ _id: story_id, user: user_id }).exec();

    if (!story) {
        return res.status(404).json({ error: "Story not found or invalid permissions" });
    }

    // Get the number of chapters in the story_content array
    let number_of_chapters = story.story_content.length;

    const has_chapter_zero = story.story_content.some(
        (chapter) => chapter.story_chapter_number === 0
    );

    if (has_chapter_zero) {
        number_of_chapters -= 1;
    }

    res.status(200).json({ number_of_chapters });
});

// Add outline to a story
exports.story_add_outline = asyncHandler(async (req, res, next) => {
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
    
    // Find the story and check if the user_id matches the story's user
    const story = await Story.findOne({ _id: story_id, user: user_id }).exec();
    if (!story) {
        return res.status(404).json({ error: "Story not found" });
    }
    
    // Add outline to the story
    story.outline = outline;

    const existing_chapter = story.story_content.find(ch => ch.story_chapter_number === 0);
    
    if (existing_chapter) {
        existing_chapter.text = outline;
    } else {
        story.story_content.push({
            story_chapter_number: 0,
            text: outline
        });
    }

    // Save the updated story
    await story.save();

    res.status(200).json({ outline: story.outline });
});

// Add the specific agent outline responses
exports.story_add_agent_outlines = asyncHandler(async (req, res, next) => {
    const { user_id, story_id } = req.params;
    const { outlines, votes} = req.body;

    // Find the user
    const user = await User.findById(user_id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    // Find the story
    const story = await Story.findOne({ _id: story_id, user: user_id }).exec();
    if (!story) {
        return res.status(404).json({ error: "Story not found or user does not have access to this story" });
    }

    if (!outlines || outlines.length === 0) {
        return res.status(404).json({ error: "Outlines are required." });
    }

    if (!votes || votes.length === 0) {
        return res.status(404).json({ error: "Votes are required." });
    }

    for (const r of outlines) {
        const agent = story.agents.find(agent => agent._id.toString() === r.agent_id);

        const existing_outline = agent.chapters.find(ch => ch.chapter_number === 0);

        const vote_entry = votes.find(v => v.agent_id === r.agent_id);

        if (!vote_entry) {
            return res.status(400).json({ error: `No vote entry found for an agent ID` });
        }

        const vote_value = vote_entry.votes;

        if (existing_outline) {
            existing_outline.content = r.data;
            existing_outline.chapter_votes = vote_value;
            existing_outline.content_thoughts = r.thoughts
        } else {
            agent.chapters.push({
                chapter_number: 0,
                content: r.data,
                chapter_votes: vote_value,
                content_thoughts: r.thoughts
            });
        }
    }

    await story.save();

    res.status(200).json({ message: "Agent outlines updated successfully." });
});

// Add critique to a story
exports.story_add_critique = asyncHandler(async (req, res, next) => {
    const { user_id, story_id } = req.params; // Story ID and User ID
    const { chapter_number, critique } = req.body;

    if (chapter_number == null || !critique) {
        return res.status(400).json({ error: "Chapter number and critique are required." });
    }

    // Find the user and ensure they exist
    const user = await User.findById(user_id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    
    // Find the story by story_id and check if the user_id matches
    const story = await Story.findOne({ _id: story_id, user: user_id });

    if (!story) {
        return res.status(404).json({ error: "Story not found or user does not have access to this story" });
    }

    // Find the existing critique for the chapter
    const existingCritique = story.critiques.find(ch => ch.chapter_number === Number(chapter_number));
    
    if (existingCritique) {
        // Update the critique
        existingCritique.critique = critique;
    } else {
        // Add a new critique
        story.critiques.push({ chapter_number, critique });
    }

    // Save the updated story
    await story.save();

    res.status(200).json({ message: "Critique added successfully", story });
});

// Add the specific agent critique responses
exports.story_add_agent_critiques = asyncHandler(async (req, res, next) => {
    const { user_id, story_id } = req.params;
    const { chapter_number, critiques, votes } = req.body;

    if (chapter_number == null || !critiques || critiques.length === 0) {
        return res.status(400).json({ error: "Chapter number and critiques are required." });
    }

    if (!votes || votes.length === 0) {
        return res.status(404).json({ error: "Votes are required." });
    }

    // Find the user
    const user = await User.findById(user_id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    // Find the story
    const story = await Story.findOne({ _id: story_id, user: user_id }).exec();
    if (!story) {
        return res.status(404).json({ error: "Story not found or user does not have access to this story" });
    }

    // Check if the chapter exists for each agent before proceeding
    for (const r of critiques) {
        const agent = story.agents.find(agent => agent._id.toString() === r.agent_id);

        const existing_chapter = agent.chapters.find(ch => ch.chapter_number === Number(chapter_number));
        if (!existing_chapter) {
            return res.status(400).json({ error: `Chapter ${chapter_number} does not exist for this agent.` });
        }
    }

    for (const r of critiques) {
        const agent = story.agents.find(agent => agent._id.toString() === r.agent_id);

        const existing_critique = agent.chapters.find(ch => ch.chapter_number === Number(chapter_number));

        if (!existing_critique) {
            return res.status(400).json({ error: `Chapter ${chapter_number} does not exist for this agent.` });
        }

        const vote_entry = votes.find(v => v.agent_id === r.agent_id);

        if (!vote_entry) {
            return res.status(400).json({ error: `No vote entry found for an agent ID` });
        }

        const vote_value = vote_entry.votes;

        existing_critique.critique = r.data;
        existing_critique.critique_votes = vote_value;
        existing_critique.critique_thoughts = r.thoughts
    }

    await story.save();
    res.status(200).json({ message: "Agent critiques updated successfully." });
});

// Add chapter to main story
exports.story_add_chapter = asyncHandler(async (req, res, next) => {
    const { user_id, story_id } = req.params;
    const { story_chapter_number, text } = req.body;
    
    if (story_chapter_number == null || !text) {
        return res.status(400).json({ error: "story_chapter_number and text are required." });
    }

    if (Number(story_chapter_number) === 0) {
        return res.status(400).json({error: "Trying to edit outline in chapter section"})
    }

    // Find the user and ensure they exist
    const user = await User.findById(user_id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    // Find the story
    const story = await Story.findOne({ _id: story_id, user: user_id }).exec();
    if (!story) {
        return res.status(404).json({ error: "Story not found or user does not have access to this story" });
    }

    
    const chapter_number = Number(story_chapter_number);

    const existing_chapter = story.story_content.find(ch => ch.story_chapter_number === chapter_number);
    
    if (existing_chapter) {
        existing_chapter.text = text;
    } else {
        story.story_content.push({
            story_chapter_number: chapter_number,
            text: text
        });
    }

    await story.save();
    res.status(200).json({ message: "Voted chapter added successfully", story });
});

// Add the specific agent chapter response
exports.story_add_agent_chapter = asyncHandler(async (req, res, next) => {
    const { user_id, story_id } = req.params; // Story ID and UserID
    const { chapter_number, content, votes } = req.body;

    if (chapter_number == null || !content || content.length === 0) {
        return res.status(400).json({ error: "Chapter number and chapters are required" });
    }

    if (Number(chapter_number) === 0) {
        return res.status(400).json({error: "Trying to edit outline in chapter section"})
    }

    if (!votes || votes.length === 0) {
        return res.status(404).json({ error: "Votes are required." });
    }

    // Find the user
    const user = await User.findById(user_id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    // Find the story
    const story = await Story.findOne({ _id: story_id, user: user_id }).exec();
    if (!story) {
        return res.status(404).json({ error: "Story not found or user does not have access to this story" });
    }

    for (const r of content) {
        const agent = story.agents.find(agent => agent._id.toString() === r.agent_id);

        const existing_chapter = agent.chapters.find(ch => ch.chapter_number === Number(chapter_number));

        const vote_entry = votes.find(v => v.agent_id === r.agent_id);

        if (!vote_entry) {
            return res.status(400).json({ error: `No vote entry found for an agent ID` });
        }

        const vote_value = vote_entry.votes;

        if (existing_chapter) {
            existing_chapter.content = r.data;
            existing_chapter.chapter_votes = vote_value;
            existing_chapter.content_thoughts = r.thoughts
        } else {
            agent.chapters.push({
                chapter_number: Number(chapter_number),
                content: r.data,
                chapter_votes: vote_value,
                content_thoughts: r.thoughts
            });
        }
    }

    // Save the updated story
    await story.save();

    res.status(200).json({ message: "Chapter added successfully", story });
});

// Edit agent-specific chapter content
exports.story_agent_chapter_edit = asyncHandler(async (req, res, next) => {
    const { user_id, story_id, agent_id, chapter_number } = req.params; // Story ID and UserID
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ error: "Content is required." });
    }

    // Find the user and ensure they exist
    const user = await User.findById(user_id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    
    // Find the story
    const story = await Story.findOne({ _id: story_id, user: user_id }).exec();
    if (!story) {
        return res.status(404).json({ error: "Story not found or user does not have access to this story" });
    }
    // Find the agent in the agents array
    const agent_entry = story.agents.find(agent_obj => agent_obj._id.toString() === agent_id);
    
    if (!agent_entry) {
        return res.status(404).json({ error: "Agent not found in this story" });
    }

    // Find the chapter in the agent's chapters
    const chapter = agent_entry.chapters.find(ch => ch.chapter_number === Number(chapter_number));
    
    if (!chapter) {
        return res.status(404).json({ error: "Chapter not found" });
    }

    // Update the chapter content
    chapter.content = content;

    // Save the updated story
    await story.save();

    res.status(200).json({ message: "Chapter updated successfully", story });
});

// Edit agent-specfic chapter critique
exports.story_agent_critique_edit = asyncHandler(async (req, res, next) => {
    const { user_id, story_id, agent_id, chapter_number } = req.params; // Story ID and UserID
    const { critique } = req.body;

    if (!critique) {
        return res.status(400).json({ error: "Content is required." });
    }

    // Find the user and ensure they exist
    const user = await User.findById(user_id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    // Find the story
    const story = await Story.findOne({ _id: story_id, user: user_id }).exec();
    if (!story) {
        return res.status(404).json({ error: "Story not found or user does not have access to this story" });
    }

    // Find the agent in the agents array
    const agentEntry = story.agents.find(agentObj => agentObj._id.toString() === agent_id);
    
    if (!agentEntry) {
        return res.status(404).json({ error: "Agent not found in this story" });
    }

    // Find the chapter in the agent's chapters
    const chapter = agentEntry.chapters.find(ch => ch.chapter_number === Number(chapter_number));
    
    if (!chapter) {
        return res.status(404).json({ error: "Chapter not found" });
    }

    // Update the chapter content
    chapter.critique = critique;

    // Save the updated story
    await story.save();

    res.status(200).json({ message: "Chapter Critique updated successfully", story });
});

// Get critique for agent specific chapter
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

// Get the number of votes for an agent's chapter version
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

// Get outline for a story
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

// Get all agents working on a story
exports.story_agents_list = asyncHandler(async (req, res, next) => {
    const { user_id, story_id } = req.params; // Story ID and User ID

    // Find the user and ensure they exist
    const user = await User.findById(user_id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    
    // Find the story by story_id and check if the user_id matches
    const story = await Story.findOne({ _id: story_id, user: user_id });

    if (!story) {
        return res.status(404).json({ error: "Story not found or user does not have access to this story" });
    }

    if (story.agents.length === 0) {
        return res.status(404).json({ error: "No agents found for this story" });
    }

    const persona_infos = await Persona.find({
        name: { $in: story.agents.map(agent => agent.agent_name) }
    }).lean();

    const persona_map = {};
    persona_infos.forEach(p => {
        persona_map[p.name] = p.persona_info;
    });

    const story_agents = story.agents.map(agent_entry => ({
        agent_id: agent_entry._id,
        agent_name: agent_entry.agent_name,
        persona: persona_map[agent_entry.agent_name]
    }));

    res.json({ story_agents });
});

// Get all required details for generate_outline step
exports.story_get_generate_outline_details = asyncHandler(async (req, res, next) => {
    const { user_id, story_id } = req.params; // Story ID and User ID

    // Find the user and ensure they exist
    const user = await User.findById(user_id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const story = await Story.findOne({ _id: story_id, user: user_id }).exec();

    if (!story) {
        return res.status(404).json({ error: "Story not found or user does not have access to this story" });
    }

    if (!story.prompt.story_details) {
        return res.status(404).json({ error: "Story details are required." });
    }

    const response = {
        story_name: story.story_name,
        story_details: story.prompt.story_details,
        extra_details: story.prompt.extra_details,
    }
    res.json(response);
});

// Get all required details for critique_outline step
exports.story_get_critique_outline_details = asyncHandler(async (req, res, next) => {
    const { user_id, story_id } = req.params; // Story ID and User ID

    // Find the user and ensure they exist
    const user = await User.findById(user_id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const story = await Story.findOne({ _id: story_id, user: user_id }).exec();;

    if (!story) {
        return res.status(404).json({ error: "Story not found or user does not have access to this story" });
    }

    if (!story.prompt.story_details) {
        return res.status(404).json({ error: "Story details are required." });
    }
    
    if (!story.outline) {
        return res.status(404).json({ error: "Outline is required." });
    }

    const response = {
        story_name: story.story_name,
        story_details: story.prompt.story_details,
        extra_details: story.prompt.extra_details,
        story_outline: story.outline
    }
    res.json(response);
});

// Get all required details for rewrite_outline step
exports.story_get_rewrite_outline_details = asyncHandler(async (req, res, next) => {
    const {user_id, story_id} = req.params; // Story ID and User ID

    // Find the user and ensure they exist
    const user = await User.findById(user_id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const story = await Story.findOne({ _id: story_id, user: user_id }).exec();;

    if (!story) {
        return res.status(404).json({ error: "Story not found or user does not have access to this story" });
    }

    if (!story.prompt.story_details) {
        return res.status(404).json({ error: "Story details are required." });
    }

    if (!story.outline) {
        return res.status(404).json({ error: "Outline is required." });
    }

    if (!story.critiques || story.critiques.length === 0) {
        return res.status(404).json({ error: "Critiques are required." });
    }

    const outline_critique_entry = story.critiques.find(c => c.chapter_number === 0);

    if (!outline_critique_entry) {
        return res.status(404).json({ error: "Outline critique (chapter 0) not found." });
    }

    const response = {
        story_name: story.story_name,
        story_details: story.prompt.story_details,
        extra_details: story.prompt.extra_details,
        story_outline: story.outline,
        outline_critique: outline_critique_entry.critiques
    }
    res.json(response)
});

// Get all required details for generate_first_chapter step
exports.story_get_first_chapter_details = asyncHandler(async (req, res, next) => {
    const { user_id, story_id } = req.params; // Story ID and User ID

    // Find the user and ensure they exist
    const user = await User.findById(user_id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const story = await Story.findOne({ _id: story_id, user: user_id }).exec();;

    if (!story) {
        return res.status(404).json({ error: "Story not found or user does not have access to this story" });
    }

    if (!story.prompt.story_details) {
        return res.status(404).json({ error: "Story details are required." });
    }

    if (!story.outline) {
        return res.status(404).json({ error: "Outline is required." });
    }

    const response = {
        story_name: story.story_name,
        story_details: story.prompt.story_details,
        extra_details: story.prompt.extra_details,
        story_outline: story.outline,
    }

    res.json(response);
});

// Get all required details for generate_next_chapter step
exports.story_get_next_chapter_details = asyncHandler(async (req, res, next) => {
    const { user_id, story_id, chapter_number } = req.params; // Story ID and User ID
    // Find the user and ensure they exist
    const user = await User.findById(user_id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    if (chapter_number == null) {
        return res.status(404).json({ error: "Chapter number is required." });
    }

    const story = await Story.findOne({ _id: story_id, user: user_id }).exec();;

    if (!story) {
        return res.status(404).json({ error: "Story not found or user does not have access to this story" });
    }

    if (!story.prompt.story_details) {
        return res.status(404).json({ error: "Story details are required." });
    }

    if (!story.outline) {
        return res.status(404).json({ error: "Outline is required." });
    }

    if (story.story_content.length === 0) {
        return res.status(404).json({ error: "Previous chapters are required." });
    }

    // Filter all chapters where the chapter number is strictly less than the requested chapter number
    const previous_chapters = story.story_content
        .filter(chapter => Number(chapter.story_chapter_number) < Number(chapter_number))
        .map(chapter => ({
            chapter_number: chapter.story_chapter_number,
            text: chapter.text
        }));

    const response = {
        story_name: story.story_name,
        story_details: story.prompt.story_details,
        extra_details: story.prompt.extra_details,
        story_outline: story.outline,
        previous_chapters: previous_chapters
    }

    res.json(response);
});

// Get all required details for critique_chapter step
exports.story_get_critique_chapter_details = asyncHandler(async (req, res, next) => {
    const { user_id, story_id, chapter_number } = req.params; // Story ID and User ID

    // Find the user and ensure they exist
    const user = await User.findById(user_id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    if (chapter_number == null) {
        return res.status(404).json({ error: "Chapter number is required." });
    }

    const story = await Story.findOne({ _id: story_id, user: user_id }).exec();;

    if (!story) {
        return res.status(404).json({ error: "Story not found or user does not have access to this story" });
    }

    if (!story.prompt.story_details) {
        return res.status(404).json({ error: "Story details are required." });
    }

    if (!story.outline) {
        return res.status(404).json({ error: "Outline is required." });
    }

    if (story.story_content.length === 0) {
        return res.status(404).json({ error: "Previous chapters are required." });
    }

    // Find the chapter with the given chapter_number
    const chapter = story.story_content.find(chap => chap.story_chapter_number === Number(chapter_number));

    if (!chapter) {
        return res.status(404).json({ error: `Chapter ${chapter_number} not found.` });
    }

    // Only include chapter_number and text in the response
    const chapter_details = {
        chapter_number: chapter.story_chapter_number,
        text: chapter.text
    };

    const response = {
        story_name: story.story_name,
        story_details: story.prompt.story_details,
        extra_details: story.prompt.extra_details,
        story_outline: story.outline,
        chapter: chapter_details
    }

    res.json(response);
});

// Get all required details for rewrite_chapter step
exports.story_get_rewrite_chapter_details = asyncHandler(async (req, res, next) => {
    const { user_id, story_id, chapter_number } = req.params; // Story ID and User ID

    // Find the user and ensure they exist
    const user = await User.findById(user_id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    if (chapter_number == null) {
        return res.status(404).json({ error: "Chapter number is required." });
    }

    const story = await Story.findOne({ _id: story_id, user: user_id }).exec();;

    if (!story) {
        return res.status(404).json({ error: "Story not found or user does not have access to this story" });
    }

    if (!story.prompt.story_details) {
        return res.status(404).json({ error: "Story details are required." });
    }

    if (!story.outline) {
        return res.status(404).json({ error: "Outline is required." });
    }

    if (story.story_content.length === 0) {
        return res.status(404).json({ error: "Previous chapters are required." });
    }

    if (!story.critiques || story.critiques.length <= 1) {
        return res.status(404).json({ error: "At least one critique is required beyond the outline critique." });
    }

    // Find the chapter with the given chapter_number
    const chapter = story.story_content.find(chap => chap.story_chapter_number === Number(chapter_number));

    if (!chapter) {
        return res.status(404).json({ error: `Chapter ${chapter_number} not found.` });
    }

    const critique = story.critiques.find(c => c.chapter_number === Number(chapter_number));

    if (!critique) {
        return res.status(404).json({ error: `Critique for Chapter ${chapter_number} not found.` });
    }

    const chapter_details = {
        chapter_number: chapter.story_chapter_number,
        text: chapter.text
    };

    const critique_details = {
        chapter_number: critique.chapter_number,
        critique: critique.critique
    }

    const response = {
        story_name: story.story_name,
        story_details: story.prompt.story_details,
        extra_details: story.prompt.extra_details,
        story_outline: story.outline,
        chapter: chapter_details,
        critique: critique_details
    }
    res.json(response);
});
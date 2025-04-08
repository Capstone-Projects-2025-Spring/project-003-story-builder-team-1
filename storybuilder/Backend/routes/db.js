const express = require("express");
const router = express.Router();

// Require controller modules
const user_controller = require("../controllers/user_controller");
const story_controller = require("../controllers/story_controller");
const agent_controller = require("../controllers/agent_controller");

/// USER ROUTES ///

// POST request for creating new User
router.post('/account_creation', user_controller.user_create_post);

// POST request for logging a User in
router.post('/account_login', user_controller.user_login_post);

// POST request to delete User
router.post("/user/:user_id/delete", user_controller.user_delete_post);

// POST request to update User
router.post("/user/:user_id/update", user_controller.user_update_post);

// GET request for one User
router.get("/user/:user_id", user_controller.user_details);

/// STORY ROUTES ///

// POST request for creating Story
router.post("/story/:user_id/create", story_controller.story_create_post);

// GET request for q list of all Stories based on the user_id
router.get("/story/:user_id/get_stories", story_controller.user_stories_list);

// GET request for one Story
router.get("/story/:user_id/:story_id/get_story", story_controller.story_detail);

// GET request for a chapter specific to a story 
router.get("/story/:user_id/:story_id/:chapter_number/get_chapter", story_controller.story_chapter_detail)

// POST request to delete Story
router.post("/story/:user_id/:story_id/delete", story_controller.story_delete_post);

// POST request to update Story
router.post("/story/:user_id/:story_id/update", story_controller.story_update_post);

// POST request to get the number of chapters
router.get("/story/:user_id/:story_id/get_number_of_chapters", story_controller.story_get_number_of_chapters);

// POST request to add chapter to agent-specfic version
router.post("/story/:user_id/:story_id/add_agent_chapter", story_controller.story_add_agent_chapter_post);

// POST request to add a critique to an existing chapter
router.post("/story/:user_id/:story_id/:agent_id/:chapter_number/add_critique", story_controller.story_add_critique_post);

// GET request for getting the critique related to a chapter
router.get("/story/:user_id/:story_id/:agent_id/:chapter_number/get_critique", story_controller.story_get_critique);

// POST request for vetoing

// GET request for getting the number of votes for an agent's chapter version
router.get("/story/:user_id/:story_id/:agent_id/:chapter_number/get_votes", story_controller.story_agent_chapter_votes);




/// AGENT ROUTES ///

// POST request for creating new instance of an Agent
router.post("/agent/create", agent_controller.agent_create_post);


/*

// STORY ROUTES - CHAPTER (VETO, VOTING)


// POST request to edit a chapter specific to a story (update chapter content)
router.post("/story/:id/:chapter_number/edit", story_controller.story_chapter_edit_post);

// POST request to choose an agent's version of a chapter to be the main chapter content
router.post("/story/:id/:chapter_number/veto/:agent_id", story_controller.story_chapter_veto_post);

// STORY ROUTES - OUTLINE

// POST request for creating outline for a specific story
router.post("/story/:id/outline/create", story_controller.story_outline_create_post);

// GET request to retrieve the outline specific to a story
router.get("/story/:id/outline", story_controller.story_outline);

/// AGENT ROUTES ///

// GET request for list of all Agents
router.get("/agents", agent_controller.agent_list);

// GET request for one Agent
router.get("/agent/:id", agent_controller.agent_detail);


// POST request for deleting an instance of an Agent
router.post("/agent/:id/delete", agent_controller.agent_delete_post);

// POST request for updating the agent_prompt of an Agent
router.post("/agent/:id/update", agent_controller.agent_update_post);
*/

module.exports = router;

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

// GET request for list of all Stories
router.get("/stories", story_controller.story_list);

// GET request for one Story
router.get("/story/:id", story_controller.story_detail);

// POST request for creating Story
router.post("/story/create", story_controller.story_create_post);

// POST request to delete Story
router.post("/story/:id/delete", story_controller.story_delete_post);

// POST request to update Story
router.post("/story/:id/update", story_controller.story_update_post);

// STORY ROUTES - CHAPTER (VETO, VOTING)

// GET request for a chapter specific to a story 
router.get("/story/:id/:chapter_number", story_controller.story_chapter_detail)

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

// POST request for creating new instance of an Agent
router.post("/agent/create", agent_controller.agent_create_post);

// POST request for deleting an instance of an Agent
router.post("/agent/:id/delete", agent_controller.agent_delete_post);

// POST request for updating the agent_prompt of an Agent
router.post("/agent/:id/update", agent_controller.agent_update_post);

module.exports = router;

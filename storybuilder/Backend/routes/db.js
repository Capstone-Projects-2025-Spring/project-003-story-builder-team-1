const express = require("express");
const router = express.Router();

// Require controller modules
const user_controller = require("../controllers/user_controller");
const story_controller = require("../controllers/story_controller");
const persona_controller = require("../controllers/persona_controller");
const agent_controller = require("../controllers/agent_controller");

/// USER ROUTES ///

/* Creates a user
Body Requirments:
- username: the username of the user
- password: the password of the user
    * password must be alphanumeric
*/
router.post('/account_creation', user_controller.create_user);

/* Checks login credentials to see if the user can log in
Body Requirments:
- username: the username of the user
- password: the password of the user
    * password must be alphanumeric
*/
router.post('/account_login', user_controller.user_login);

/* Deletes an account
Parameter Requirments:
- user_id: the id of the user within the db
*/
router.post("/user/:user_id/delete", user_controller.user_delete);

/* Update user information
Parameter Requirments:
- user_id: the id of the user within the db
Body Requirments:
- username: the username of the user
- password: the password of the user
    * password must be alphanumeric
*/
router.post("/user/:user_id/update", user_controller.user_update);

/* Gets a user's information
Parameter Requirments:
- user_id: the id of the user within the db
*/
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

// POST request to add a chapter to the main story
router.post("/story/:user_id/:story_id/add_chapter", story_controller.story_add_chapter_post);

// POST request to edit a final chapter specific to a story (update story_content chapter content)
router.post("/story/:user_id/:story_id/:story_chapter_number/edit_chapter", story_controller.story_chapter_edit_post);

// POST request to edit agent-specific chapter content
router.post("/story/:user_id/:story_id/:agent_id/:chapter_number/edit_agent_chapter", story_controller.story_agent_chapter_edit_post);

router.post("/story/:user_id/:story_id/:agent_id/:chapter_number/edit_agent_critque", story_controller.story_agent_critique_edit_post);

// POST request to add a critique to an existing chapter
router.post("/story/:user_id/:story_id/:agent_id/:chapter_number/add_critique", story_controller.story_add_critique_post);

// GET request for getting the critique related to a chapter
router.get("/story/:user_id/:story_id/:agent_id/:chapter_number/get_critique", story_controller.story_get_critique);

// POST request for vetoing
router.post("/story/:user_id/:story_id/:chapter_number/veto", story_controller.story_agent_chapter_veto_post);

// GET request for getting the number of votes for an agent's chapter version
router.get("/story/:user_id/:story_id/:agent_id/:chapter_number/get_votes", story_controller.story_agent_chapter_votes);

// POST request for adding an outline
router.post("/story/:user_id/:story_id/add_outline", story_controller.story_add_outline_post);

// GET request for getting the outline related to a chapter
router.get("/story/:user_id/:story_id/get_outline", story_controller.story_get_outline);

router.post("/story/:user_id/:story_id/story_add_voted_critique_post", story_controller.story_add_voted_critique_post);

router.get("/story/:user_id/:story_id/story_agent_list", story_controller.story_agents_list);

router.post("/story/:user_id/:story_id/:chapter_number/veto_critique", story_controller.story_veto_critique);

router.post("/story/:user_id/:story_id/add_agent_outlines", story_controller.story_add_agent_outlines_post);

router.post("/story/:user_id/:story_id/add_agent_critiques", story_controller.story_add_agent_critiques_post)

router.post("/story/:user_id/:story_id/add_agent_chapter", story_controller.story_add_agent_chapter_post);

// Translator routes
router.get("/story/:user_id/:story_id/get_generated_outline_details", story_controller.story_get_generate_outline_details);

router.get("/story/:user_id/:story_id/get_critique_outline_details", story_controller.story_get_critique_outline_details);

router.get("/story/:user_id/:story_id/get_rewrite_outline_details", story_controller.story_get_rewrite_outline_details);

router.get("/story/:user_id/:story_id/get_first_chapter_details", story_controller.story_get_first_chapter_details);

router.get("/story/:user_id/:story_id/:chapter_number/get_next_chapter_details", story_controller.story_get_next_chapter_details);

router.get("/story/:user_id/:story_id/:chapter_number/get_critique_chapter_details", story_controller.story_get_critique_chapter_details);

router.get("/story/:user_id/:story_id/:chapter_number/get_rewrite_chapter_details", story_controller.story_get_rewrite_chapter_details);


/// PERSONA ROUTES ///

// Returns a list of all personas
router.get("/personas", persona_controller.persona_list);

/* Creates a persona
Body Requirements: 
- name: the name of the persona
- persona_info: The info about the person such as (You are shakespeare and you write stories)
*/
router.post("/create_persona", persona_controller.create_persona);

/* Deletes a persona
Body Requirements:
- name: the name of the person
*/
router.post("/delete_persona", persona_controller.delete_persona);


/// AGENT ROUTES ///

// GET request for one Agent
router.get("/agent/:name", agent_controller.agent_detail);

// POST request for creating a new instance of an Agent
router.post("/agent/create", agent_controller.agent_create_post);

// POST request for deleting an instance of an Agent
router.post("/agent/:agent_id/delete", agent_controller.agent_delete_post);

// POST request for updating the agent_prompt of an Agent
router.post("/agent/:agent_id/update", agent_controller.agent_update_post);

// POST request for updating the last response
router.post("/agent/:agent_id/:story_id/get_last_response", agent_controller.agent_update_last_response_post);

// GET request for getting the last response
router.get("/agent/:agent_id/:story_id/get_last_response", agent_controller.agent_get_last_response);

// AGENT LIST ROUTES //
// GET request for getting the list of all agents
router.get("/agents", agent_controller.agent_list);

module.exports = router;
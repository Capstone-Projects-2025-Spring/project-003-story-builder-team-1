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
Body Requirments:
- password: the password of the user
    * password must be alphanumeric
*/
router.post("/user/:user_id/delete", user_controller.user_delete);

/* Update user information
Parameter Requirments:
- user_id: the id of the user within the db
Body Requirments:
- username: the username of the user
- password: the password of the user
    * password must be alphanumeric
- new_username: The new username they want to have
- new_password: The new password they want to have
    * At least one of the two above need to be provided
*/
router.post("/user/:user_id/update", user_controller.user_update);

/* Gets a user's information
Parameter Requirments:
- user_id: the id of the user within the db
*/
router.get("/user/:user_id", user_controller.user_details);

/// STORY ROUTES ///

/* Create a Story
Parameter Requirments:
- user_id: the id of the user within the db
Body Requirments:
- story_name: The name of the story
- prompt: The prompt containing information about the desired story the LLM will use for generation
- agents: a list of authors the LLM will mimic while generating
*/
router.post("/story/:user_id/create", story_controller.story_create);

/* Gets a list of all the user's stories
Parameter Requirments:
- user_id: the id of the user within the db
*/
router.get("/story/:user_id/get_stories", story_controller.user_stories_list);

/* Gets a single story from the user's list
Parameter Requirments:
- user_id: the id of the user within the db
- story_id: the id of the story within the db
*/
router.get("/story/:user_id/:story_id/get_story", story_controller.story_details);

/* Deletes a Story
Parameter Requirments:
- user_id: the id of the user within the db
- story_id: the id of the story within the db
*/
router.post("/story/:user_id/:story_id/delete", story_controller.story_delete);

/* Gets a specific chapter from a specific story
Parameter Requirments:
- user_id: the id of the user within the db
- story_id: the id of the story within the db
- chapter_number: the desired chapter number
    * Has to be an integer
*/
router.get("/story/:user_id/:story_id/:chapter_number/get_chapter", story_controller.story_chapter_details)

/* Changes the Story Name
Parameter Requirments:
- user_id: the id of the user within the db
- story_id: the id of the story within the db
Body Requirments:
- story_name: The new desired story name
*/
router.post("/story/:user_id/:story_id/name_update", story_controller.story_name_update);

/* Get number of chapters in a story minus the outline chapter (chapter 0)
Parameter Requirments:
- user_id: the id of the user within the db
- story_id: the id of the story within the db
*/
router.get("/story/:user_id/:story_id/get_number_of_chapters", story_controller.story_get_number_of_chapters);

/* Add/Edit outline from story contents
Parameter Requirments:
- user_id: the id of the user within the db
- story_id: the id of the story within the db
Body Requirments: 
- outline: The new outline or new version of the outline
*/
router.post("/story/:user_id/:story_id/add_outline", story_controller.story_add_outline);

/* Add agent specific outlines
Parameter Requirments:
- user_id: the id of the user within the db
- story_id: the id of the story within the db
Body Requirments: 
- outline: The new outline or new version of the outline
- votes: The numerical value used to determine the best response
*/
router.post("/story/:user_id/:story_id/add_agent_outlines", story_controller.story_add_agent_outlines);

/* Add/edit most voted critique
Parameter Requirments:
- user_id: the id of the user within the db
- story_id: the id of the story within the db
Body Requirments:
- chapter_number: The chapter the critique belongs to
- critique: The critique being added to the db
*/
router.post("/story/:user_id/:story_id/add_critique", story_controller.story_add_critique);

/* Add agent specific critiques
Parameter Requirments:
- user_id: the id of the user within the db
- story_id: the id of the story within the db
Body Requirments:
- chapter_number: The chapter the critique belongs to
- critique: The critique being added to the db
- votes: The numerical value used to determine the best response
*/
router.post("/story/:user_id/:story_id/add_agent_critiques", story_controller.story_add_agent_critiques);

/* Add/edit most voted chapter
Parameter Requirments:
- user_id: the id of the user within the db
- story_id: the id of the story within the db
Body Requirments:
- story_chapter_number: the number of the chapter generated by the LLM
- text: The generated chapter text
*/
router.post("/story/:user_id/:story_id/add_chapter", story_controller.story_add_chapter);

/* Add agent specific chapters
Parameter Requirments:
- user_id: the id of the user within the db
- story_id: the id of the story within the db
Body Requirments:
- chapter_number: the number of the chapter generated by the LLM
- content: The generated chapter text
- votes: The numerical value used to determine the best response
*/
router.post("/story/:user_id/:story_id/add_agent_chapter", story_controller.story_add_agent_chapter);

/* Edit an agent specific chapter response
Parameter Requirments:
- user_id: the id of the user within the db
- story_id: the id of the story within the db
- agent_id: the id of the agent within the story element within the db
- chapter_number: the chapter to be edited
Body Requirments:
- content: the updated chapter content 
*/
router.post("/story/:user_id/:story_id/:agent_id/:chapter_number/edit_agent_chapter", story_controller.story_agent_chapter_edit);

/* Edit an agent specific critique response
Parameter Requirments:
- user_id: the id of the user within the db
- story_id: the id of the story within the db
- agent_id: the id of the agent within the story element within the db
- chapter_number: the chapter to be edited
Body Requirments:
- critique: the updated chapter content 
*/
router.post("/story/:user_id/:story_id/:agent_id/:chapter_number/edit_agent_critque", story_controller.story_agent_critique_edit);

/* Get a critique of a specific agent chapter
Parameter Requirments:
- user_id: the id of the user within the db
- story_id: the id of the story within the db
- agent_id: the id of the agent within the story element within the db
- chapter_number: the chapter to be edited
*/
router.get("/story/:user_id/:story_id/:agent_id/:chapter_number/get_critique", story_controller.story_get_critique);

/* Get the number of votes an agent specific response received
Parameter Requirments:
- user_id: the id of the user within the db
- story_id: the id of the story within the db
- agent_id: the id of the agent within the story element within the db
- chapter_number: the chapter to be edited
*/
router.get("/story/:user_id/:story_id/:agent_id/:chapter_number/get_votes", story_controller.story_agent_chapter_votes);

/* Get the story outline
Parameter Requirments:
- user_id: the id of the user within the db
- story_id: the id of the story within the db
*/
router.get("/story/:user_id/:story_id/get_outline", story_controller.story_get_outline);

/* Get the list of agents working on a story
Parameter Requirments:
- user_id: the id of the user within the db
- story_id: the id of the story within the db
*/
router.get("/story/:user_id/:story_id/story_agent_list", story_controller.story_agents_list);

/* Get all required details for generate_outline step
Parameter Requirments:
- user_id: the id of the user within the db
- story_id: the id of the story within the db
*/
router.get("/story/:user_id/:story_id/get_generated_outline_details", story_controller.story_get_generate_outline_details);

/* Get all required details for critique_outline step
Parameter Requirments:
- user_id: the id of the user within the db
- story_id: the id of the story within the db
*/
router.get("/story/:user_id/:story_id/get_critique_outline_details", story_controller.story_get_critique_outline_details);

/* Get all required details for rewrite_outline step
Parameter Requirments:
- user_id: the id of the user within the db
- story_id: the id of the story within the db
*/
router.get("/story/:user_id/:story_id/get_rewrite_outline_details", story_controller.story_get_rewrite_outline_details);

/* Get all required details for generate_first_chapter step
Parameter Requirments:
- user_id: the id of the user within the db
- story_id: the id of the story within the db
*/
router.get("/story/:user_id/:story_id/get_first_chapter_details", story_controller.story_get_first_chapter_details);

/* Get all required details for generate_next_chapter step
Parameter Requirments:
- user_id: the id of the user within the db
- story_id: the id of the story within the db
*/
router.get("/story/:user_id/:story_id/:chapter_number/get_next_chapter_details", story_controller.story_get_next_chapter_details);

/* Get all required details for critique_chapter step
Parameter Requirments:
- user_id: the id of the user within the db
- story_id: the id of the story within the db
*/
router.get("/story/:user_id/:story_id/:chapter_number/get_critique_chapter_details", story_controller.story_get_critique_chapter_details);

/* Get all required details for rewrite_chapter step
Parameter Requirments:
- user_id: the id of the user within the db
- story_id: the id of the story within the db
*/
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
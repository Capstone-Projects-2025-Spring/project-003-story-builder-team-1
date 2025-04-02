const express = require("express");
const router = express.Router();

// Require controller modules
const user_controller = require("../controllers/user_controller");
const story_controller = require("../controllers/story_controller");
const agent_controller = require("../controllers/agent_controller");

/// USER ROUTES ///

// GET request for creating a User
router.get("/user/create", user_controller.user_create_get);

// POST request for creating User
router.post("/user/create", user_controller.user_create_post);

// GET request to delete User
router.get("/user/:id/delete", user_controller.user_delete_get);

// POST request to delete User
router.post("/user/:id/delete", user_controller.user_delete_post);

// GET request to update User
router.get("/user/:id/update", user_controller.user_update_get);

// POST request to update User
router.post("/user/:id/update", user_controller.user_update_post);

// GET request for one User
router.get("/user/:id", user_controller.user_detail);

// GET request for list of all Users
router.get("/users", user_controller.user_list);

/// STORY ROUTES ///

// GET request for creating a Story
router.get("/story/create", story_controller.story_create_get);

// POST request for creating Story
router.post("/story/create", story_controller.story_create_post);

// GET request to delete Story
router.get("/story/:id/delete", story_controller.story_delete_get);

// POST request to delete Story
router.post("/story/:id/delete", story_controller.story_delete_post);

// GET request to update Story
router.get("/story/:id/update", story_controller.story_update_get);

// POST request to update Story
router.post("/story/:id/update", story_controller.story_update_post);

// GET request for one Story
router.get("/story/:id", story_controller.story_detail);

// GET request for list of all Stories
router.get("/stories", story_controller.story_list);

/// AGENT ROUTES ///

// GET request for creating an Agent
router.get("/agent/create", agent_controller.agent_create_get);

// POST request for creating Agent
router.post("/agent/create", agent_controller.agent_create_post);

// GET request to delete Agent
router.get("/agent/:id/delete", agent_controller.agent_delete_get);

// POST request to delete Agent
router.post("/agent/:id/delete", agent_controller.agent_delete_post);

// GET request to update Agent
router.get("/agent/:id/update", agent_controller.agent_update_get);

// POST request to update Agent
router.post("/agent/:id/update", agent_controller.agent_update_post);

// GET request for one Agent
router.get("/agent/:id", agent_controller.agent_detail);

// GET request for list of all Agents
router.get("/agents", agent_controller.agent_list);

module.exports = router;

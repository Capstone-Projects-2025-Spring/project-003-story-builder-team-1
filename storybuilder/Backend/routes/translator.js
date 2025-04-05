const express = require('express');
const axios = require('axios');
const router = express.Router();

const PRIVATE_URL = process.env.PRIVATE_URL || "http://localhost:8080";
const APP_URL = PRIVATE_URL;

//Global Variables to store data related to the story
var courier_response;

//first_chapter will receive the story name, story details, and extra details from the frontend, and send back the story name and generated chapter
router.post('/first_chapter', async (req, res) => {

    //Validate required fields
    if (!req.body.story_name || !req.body.story_details || !req.body.story_outline) {
        return res.status(404).json({ message: "Missing required fields", data: req.body });
    }

    // Store story data
    story_name = req.body.story_name;
    story_details = req.body.story_details;
    extra_details = req.body.extra_details;
    story_outline = req.body.story_outline;

    try {
        //Send data 
        details = "Story Name:\n"+ story_name + "\nStory Details:\n" + story_details + "\nExtra Details:\n" + extra_details

        to_prompt_admin = {
            "details": details,
            "story_outline": story_outline
        }

        prompt_admin_response = await axios.post(APP_URL + '/prompt_admin/first_chapter/', to_prompt_admin);

        to_frontend = {
            "courier_response": courier_response
        }

        //Send successful response to frontend
        return res.status(200).json({message: "Story Contents Received Successfully", data: to_frontend});

    } catch (error) {
        console.error("Error fetching courier response:", error.message);
        return res.status(500).json({ message: "Failed to fetch courier response", error: error.message });
    }
});

//courier_response will store the response from a courier instance
router.post('/courier_response', (req, res) => {

    //If data was not received successfully
    if (!req.body.data){
        return res.status(404).json({message: "Courier Response not Received", data: req.body});
    }

    //Storing courier response
    courier_response = req.body.data

    //Send Successful Response Back to courier
    return res.status(200).json({message: "Courier Response Received Successfully", data: req.body});
});

//story_outline will receive the requested chapters, story name, story details, and extra details from the frontend, and send back the story name, number of chapters and generated story outline
router.post('/story_outline', async (req, res) => {

    //Validate required fields
    if (!req.body.chapter_count || !req.body.story_name || !req.body.story_details) {
        return res.status(404).json({ message: "Missing required fields", data: req.body });
    }

    // Store story data
    chapter_count = Number(req.body.chapter_count);
    story_name = req.body.story_name;
    story_details = req.body.story_details;
    extra_details = req.body.extra_details;

    //Validate data type of chapter_count
    if (isNaN(chapter_count)) {
        return res.status(400).json({ message: "Invalid Data Type: chapter_count must be a number", data: req.body.chapter_count });
    }

    try {
        //Send data 
        details = "Story Details:\n" + story_details + "\nExtra Details:\n" + extra_details

        to_prompt_admin = {
            "details": details,
            "chapter_count": chapter_count
        }

        prompt_admin_response = await axios.post(APP_URL + '/prompt_admin/story_outline/', to_prompt_admin);

        to_frontend = {
            "title": story_name,
            "courier_response": courier_response
        }

        //Send successful response to frontend
        return res.status(200).json({message: "Story Contents Received Successfully", data: to_frontend});

    } catch (error) {
        console.error("Error fetching courier response:", error.message);
        return res.status(500).json({ message: "Failed to fetch courier response", error: error.message });
    }
});

//next_chapter will receive the previous chapters, story name, story details, extra details, and story outline, and send back the story name and generated chapter
router.post('/next_chapter', async (req, res) => {

    //Validate required fields
    if (!req.body.story_name || !req.body.story_details || !req.body.previous_chapters || !req.body.story_outline) {
        return res.status(404).json({ message: "Missing required fields", data: req.body });
    }

    // Store story data
    story_name = req.body.story_name;
    story_details = req.body.story_details;
    extra_details = req.body.extra_details;
    previous_chapters = req.body.previous_chapters;
    story_outline = req.body.story_outline;

    //Validate that previous_chapters is not empty
    if (previous_chapters.length == 0) {
        return res.status(400).json({ message: "Invalid Data Type: previous_chapters is empty", data: req.body.previous_chapters });
    }

    try {
        //Send data 
        details = "Story Name:\n"+ story_name + "\nStory Details:\n" + story_details + "\nExtra Details:\n" + extra_details

        to_prompt_admin = {
            "details": details,
            "previous_chapters": previous_chapters,
            "story_outline": story_outline
        }

        prompt_admin_response = await axios.post(APP_URL + '/prompt_admin/next_chapter/', to_prompt_admin);

        to_frontend = {
            "courier_response": courier_response,
        }

        //Send successful response to frontend
        return res.status(200).json({message: "Story Contents Received Successfully", data: to_frontend});

    } catch (error) {
        console.error("Error fetching courier response:", error.message);
        return res.status(500).json({ message: "Failed to fetch courier response", error: error.message });
    }
});

module.exports = router;
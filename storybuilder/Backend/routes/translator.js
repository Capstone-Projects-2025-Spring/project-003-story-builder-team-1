const express = require('express');
const axios = require('axios');
const router = express.Router();

//Global Variables to store data related to the story
var chapter_count;
var story_name;
var story_details;
var extra_details;
var courier_response;

//story_contents will receive the requested chapters, story name, story details, and extra details from the frontend
router.post('/story_contents', async (req, res) => {

    //Validate required fields
    if (!req.body.chapter_count || !req.body.story_name || !req.body.story_details || !req.body.extra_details) {
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
        prompt_admin_response = await axios.post('http://localhost:8080/prompt_admin/story/', {"data": details});

        to_frontend = {
            title: story_name,
            courier_response: courier_response
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
        res.status(404).json({message: "Courier Response not Received", data: req.body});
    }

    //Storing courier response
    courier_response = req.body.data

    //Send Successful Response Back to courier
    res.status(200).json({message: "Courier Response Received Successfully", data: req.body});
});

module.exports = router;
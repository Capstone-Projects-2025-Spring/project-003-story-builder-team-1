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
router.post('/app/story_contents/', async (req, res) => {

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
        //Await API Response from courier and store data when data is received
        courier_response = await axios.post('http://localhost:8080/app/courier_response');
        courier_response = courier_response.data
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
router.post('/app/courier_response/', (req, res) => {

    //If data was not received successfully
    if (!req.body.data){
        res.status(404).json({message: "Courier Response not Received", data: req.body});
    }

    //Send Successful Response Back to courier
    res.status(200).json({message: "Courier Response Received Successfully", data: req.body});
});

//story will send the story and extra details to prompt_admin
router.get('/app/story/', (req, res) => {
    //Combining Story and Extra Details together
    details = "Story Details:\n" + story_details + "\nExtra Details:\n" + extra_details

    //Sending Data to prompt_admin
    res.status(200).json({message: "Sending Data to prompt_admin", data: details});
});

//courier_data will send the courier data, alongside the story and extra details to the Frontend
router.get('/app/courier_data/', async (req, res) => {

    for_frontend = {
        "title": story_name,
        "courier_response": courier_response
    };
    //Sending courier Data to the Frontend
    res.status(200).json({message: "Sending Data to the Frontend", data: for_frontend});
});

// Export the routers for use in app.js
module.exports = router;
const express = require('express');
const router = express.Router();

//Global Variables to store data related to the story
var chapter_count;
var story_name;
var story_details;
var extra_details;
var courier_response;

//story_contents will receive the amount of chapters requested, story name, story details, and extra details from the Frontend
router.post('/app/story_contents/', (req, res) => {
    
    //If any data was not received successfully
    if (req.body.chapter_count == null || req.body.story_name == null || req.body.story_details == null || req.body.extra_details == null){
        res.status(404).json({message: "Story Contents not Received", data: req.body});
    }

    //Storing story data
    chapter_count = Number(JSON.stringify(req.body.chapter_count));
    story_name = JSON.stringify(req.body.story_name);
    story_details = JSON.stringify(req.body.story_details);
    extra_details = JSON.stringify(req.body.extra_details);


    //Data Type Validation for chapter_count
    if (isNaN(chapter_count)){
        res.status(400).json({message: "Invalid Data Type", data: req.body});
    }

    //Send Successful Response Back to Frontend
    res.status(200).json({message: "Story Contents Received Successfully", data: req.body});
});

//courier_response will store the response from a courier instance
router.post('/app/courier_response/', (req, res) => {

    //If data was not received successfully
    if (req.body.data == null){
        res.status(404).json({message: "Courier Response not Received", data: req.body});
    }

    //Storing Body Data
    courier_response = JSON.stringify(req.body.data);

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
router.get('/app/courier_data/', (req, res) => {

    for_frontend = {
        "title": story_name,
        "courier_response": courier_response
    };
    //Sending courier Data to the Frontend
    res.status(200).json({message: "Sending Data to the Frontend", data: for_frontend});
});

// Export the routers for use in app.js
module.exports = router;
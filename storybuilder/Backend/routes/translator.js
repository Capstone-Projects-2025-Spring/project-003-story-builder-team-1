const express = require('express');
const router = express.Router();

//Global Variables to store data related to the story
var chapter_count;
var story_details;
var extra_details;
var courier_response;

//chapter_count will receive the amount of chapters requested for the story
router.post('/app/chapter_count/', (req, res) => {
    
    //If data was not received successfully
    if (req.body.data == null){
        res.status(404).json({message: "Chapter Count was not Received", data: req.body});
    }

    //Storing Body Data as a number
    chapter_count = Number(JSON.stringify(req.body.data))

    //Data Type Validation
    if (isNaN(chapter_count)){
        res.status(400).json({message: "Invalid Data Type", data: req.body});
    }

    //Send Successful Response Back to Frontend
    res.status(200).json({message: "Chapter Count Received Successfully", data: req.body});
});

//story_details will receive the details of the story
router.post('/app/story_details/', (req, res) => {

    //If data was not received successfully
    if (req.body.data == null){
        res.status(404).json({message: "Story Details were not Received", data: req.body});
    }

    //Storing Body Data
    story_details = JSON.stringify(req.body.data);

    //Send Successful Response Back to Frontend
    res.status(200).json({message: "Story Details Received Successfully", data: req.body});
});

//extra_details will receive any additional requests to take into account when drafting the story
router.post('/app/extra_details/', (req, res) => {

    //If data was not received successfully
    if (req.body.data == null){
        res.status(404).json({message: "Extra Details were not Received", data: req.body});
    }

    //Storing Body Data
    extra_details = JSON.stringify(req.body.data);

    //Send Successful Response Back to Frontend
    res.status(200).json({message: "Extra Details Received Successfully", data: req.body});
});

//courier_response will receive any additional requests to take into account when drafting the story
router.post('/app/courier_response/', (req, res) => {

    //If data was not received successfully
    if (req.body.data == null){
        res.status(404).json({message: "Courier Response were not Received", data: req.body});
    }

    //Storing Body Data
    courier_response = JSON.stringify(req.body.data);

    //Send Successful Response Back to Frontend
    res.status(200).json({message: "Courier Response Received Successfully", data: req.body});
});

//story will send the story and extra details to the frontend
router.get('/app/story/', (req, res) => {
    //Combining Story and Extra Details together
    details = "Story Details:\n" + story_details + "\nExtra Details:\n" + extra_details

    //Sending Data to Frontend
    res.status(200).json({message: "Sending Data to Frontend", data: details});
});

//courier_data will send the courier data, alongside the story and extra details, to prompt_admin
router.get('/app/courier_data/', (req, res) => {
    //Combining Story and Extra Details together
    details = "Story Details:\n" + story_details + "\nExtra Details:\n" + extra_details

    //Creating Courier Data
    courier_details = {
        "story_context": details,
        "courier_response": courier_response
    }

    //Sending Data to prompt_admin
    res.status(200).json({message: "Sending Data to prompt_admin", data: courier_details});
});

// Export the routers for use in app.js
module.exports = router;
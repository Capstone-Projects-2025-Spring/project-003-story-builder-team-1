const express = require('express');
const router = express.Router();

var chapter_count;
var story_details; 
var extra_details;
var courier_response;

//chapter_count will receive the amount of chapters requested for the story
router.post('/app/chapter_count/', (req, res) => {
    //Storing Body Data
    chapter_count = JSON.stringify(req.body);
    console.log("POST Input: " + chapter_count);

    //If data was not received successfully or was not a number
    if (chapter_count == null || typeof(chapter_count) != "number"){
        res.status(400).json({message: "Chapter Count was not Received", data: req.body});
    }

    //Send Successful Response Back to Frontend
    res.status(200).json({message: "Chapter Count Received Successfully", data: req.body});
});

//story_details will receive the details of the story
router.post('/app/story_details/', (req, res) => {
    //Storing Body Data
    story_details = JSON.stringify(req.body);
    console.log("POST Input: " + story_details);

    //If data was not received successfully
    if (story_details == null){
        res.status(400).json({message: "Chapter Count was not Received", data: req.body});
    }

    //Send Successful Response Back to Frontend
    res.status(200).json({message: "Story Details Received Successfully", data: req.body});
});

//extra_details will receive any additional requests to take into account when drafting the story
router.post('/app/extra_details/', (req, res) => {
    //Storing Body Data
    extra_details = JSON.stringify(req.body);
    console.log("POST Input: " + extra_details);

    //If data was not received successfully
    if (extra_details == null){
        res.status(400).json({message: "Chapter Count was not Received", data: req.body});
    }

    //Send Successful Response Back to Frontend
    res.status(200).json({message: "Extra Details Received Successfully", data: req.body});
});

//courier_response will receive any additional requests to take into account when drafting the story
router.post('/app/courier_response/', (req, res) => {
    //Storing Body Data
    courier_response = JSON.stringify(req.body);
    console.log("POST Input: " + courier_response);

    //If data was not received successfully
    if (extra_details == null){
        res.status(400).json({message: "Chapter Count was not Received", data: req.body});
    }

    //Send Successful Response Back to Frontend
    res.status(200).json({message: "Extra Details Received Successfully", data: req.body});
});

// Export the routers for use in app.js
module.exports = router;
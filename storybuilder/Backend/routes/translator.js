const express = require('express');
const router = express.Router();

var chapter_count;
var story_details; 
var extra_details

//chapter_count will receive the amount of chapters requested for the story
router.post('/app/chapter_count/', (req, res) => {
    const input = JSON.stringify(req.body);
    console.log("POST Input: " + input);

    //Send Successful Response Back to Frontend
    res.status(200).json({message: "Chapter Count Received Successfully", data: req.body});
});

//story_details will receive the details of the story
router.post('/app/story_details/', (req, res) => {
    const input = JSON.stringify(req.body);
    console.log("POST Input: " + input);

    //Send Successful Response Back to Frontend
    res.status(200).json({message: "Story Details Received Successfully", data: req.body});
});

//extra_details will receive any additional requests to take into account when drafting the story
router.post('/app/extra_details/', (req, res) => {
    const input = JSON.stringify(req.body);
    console.log("POST Input: " + input);

    //Send Successful Response Back to Frontend
    res.status(200).json({message: "Extra Details Received Successfully", data: req.body});
});

// Export the routers for use in app.js
module.exports = router;
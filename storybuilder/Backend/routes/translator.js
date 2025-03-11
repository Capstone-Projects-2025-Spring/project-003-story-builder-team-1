const express = require('express');
const router = express.Router();

//text_box
router.post('/app/text_box/', (req, res) => {
    const input = JSON.stringify(req.body);
    console.log("POST Input: " + input);

    //Send Successful Response Back to Frontend
    res.status(200).json({message: "Data Received Successfully", data: req.body});
});

//rank_format
router.post('/app/rank_format/', (req, res) => {
    res.status(200).json({message: "Data Received Successfully", data: req.body});
});

//writing_session
router.post('/app/writing_session/', (req, res) => {
    res.status(200).json({message: "Data Received Successfully", data: req.body});
});

//write_chapter
router.post('/app/write_chapter/', (req, res) => {
    res.status(200).json({message: "Data Received Successfully", data: req.body});
});

//story_bank
router.get('/app/story_bank/', (req, res) => {
    res.status(200).json({message: "Data Received Successfully", data: req.body});
});

// Export the routers for use in app.js
module.exports = router;
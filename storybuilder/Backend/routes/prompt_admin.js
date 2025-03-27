const express = require('express');
const router = express.Router();
const axios = require('axios');
const promptformatter = require('../promptformatter')

const PRIVATE_URL = process.env.PRIVATE_URL || "http://localhost";
const APP_URL = PRIVATE_URL + ":8080"

router.post('/story', async (req, res) => {
    //throws 400 status 
    if(!req.body.data) {
       return res.status(400).json({message: "No prompt data received", data: req.body});
    }
    //formatting the story & extra details (ignoring story_name and chapter_count for now, also ignores the need for a previous_chapter entry)
    const promptinfo = JSON.stringify(req.body.data);
    console.log("story_details taken in as promptinfo: "+ promptinfo);

    //sends to promptformatter to be organized in an acceptable format for the llama API
    var prompt = promptformatter.draft(promptinfo);

    try {
        //try to send prompt to courier
        courier_res = await axios.post(APP_URL + '/courier/story_call', {data:prompt});
        return res.status(200).json({message: "Data Received Successfully", data: req.body});

    }
    catch(error) {
        return res.status(500).json({message: "PromptAdmin failed to connect to the couriers", error: error})
    }
});


//prompt
router.get('/prompt', (req, res) => {
    res.status(200).json({message: "Data Received Successfully", data: req.body});
});

//refine_prompt
router.get('/app/prompt_admin', (req, res) => {
    res.status(200).json({message: "Data Received Successfully", data: req.body});
});

//generate_prompt
router.get('/app/generate_prompt', (req, res) => {
    res.status(200).json({message: "Data Received Successfully", data: req.body});
});

//rank_prompt
router.get('/app/rank_prompt', (req, res) => {
    res.status(200).json({message: "Data Received Successfully", data: req.body});
});

// Export the routers for use in app.js
module.exports = router;


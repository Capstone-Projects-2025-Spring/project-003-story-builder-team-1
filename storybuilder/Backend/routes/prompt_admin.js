const express = require('express');
const router = express.Router();
const axios = require('axios');
const prompt_formatter = require('../prompt_formatter')

const PRIVATE_URL = process.env.PRIVATE_URL || "http://localhost:8080";
const APP_URL = PRIVATE_URL;

router.post('/first_chapter', async (req, res) => {
    //throws 400 status 
    if(!req.body.details || !req.body.story_outline) {
       return res.status(400).json({message: "No prompt data received", data: req.body});
    }

    //formatting the story & extra details (ignoring story_name and chapter_count for now, also ignores the need for a previous_chapter entry)
    const prompt_info = JSON.stringify(req.body.details);
    const story_outline = JSON.stringify(req.body.story_outline);
    console.log("story_details taken in as promptinfo: "+ prompt_info);

    //sends to promptformatter to be organized in an acceptable format for the llama API
    var prompt = prompt_formatter.first_chapter(prompt_info, story_outline);

    try {
        //try to send prompt to courier
        courier_res = await axios.post(APP_URL + '/courier/story_call', {data:prompt});
        return res.status(200).json({message: "Data Received Successfully", data: req.body});

    }
    catch(error) {
        return res.status(500).json({message: "PromptAdmin failed to connect to the couriers", error: error})
    }
});

//next chapter
router.post('/next_chapter', async (req, res) => {
    if(!req.body.details || !req.body.story_outline || !req.body.previous_chapters) {
        return res.status(400).json({message: "No prompt data received", data: req.body});
     }

    var chapter_count = req.body.previous_chapters.length;
    console.log("Current chapter count: (Test)" + chaptercount);
    var prompt_info = JSON.stringify(req.body.details);
    var chapter_outline = JSON.stringify(req.body.story_outline);
    var previous_chapter = JSON.stringify(req.body.previous_chapters);

    var prompt = prompt_formatter.next_chapter(prompt_info, chapter_outline, previous_chapter, chapter_count);

    try {
        //try to send prompt to courier
        courier_res = await axios.post('http://localhost:8080/courier/story_call', {data:prompt});
        return res.status(200).json({message: "Data Received Successfully", data: req.body});

    }
    catch(error) {
        return res.status(500).json({message: "PromptAdmin failed to connect to the couriers", error: error})
    }

});

//refine_prompt
router.post('/story_outline', async (req, res) => {
    if(!req.body.details) {
        return res.status(400).json({message: "No prompt data received", data: req.body});
    }

    //separate request body into two fields to create outline with promptformatter
    var chapter_count = JSON.stringify(req.body.chapter_count);
    var prompt_info = JSON.stringify(req.body.details);
    //create outline with two entries, calling promptformatter's storyoutline() function
    var prompt = prompt_formatter.story_outline(chapter_count, prompt_info);
    try {
        //try to send prompt to courier
        courier_res = await axios.post('http://localhost:8080/courier/story_call', {data:prompt});
        return res.status(200).json({message: "Data Received Successfully", data: req.body});

    }
    catch(error) {
        return res.status(500).json({message: "PromptAdmin failed to connect to the couriers", error: error})
    }
});

// Export the routers for use in app.js
module.exports = router;
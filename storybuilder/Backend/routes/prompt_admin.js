const express = require('express');
const router = express.Router();
const axios = require('axios');
const prompt_formatter = require('../prompt_formatter')

const PRIVATE_URL = process.env.PRIVATE_URL || "http://localhost:8080";
const APP_URL = PRIVATE_URL;

router.post('/first_chapter', async (req, res) => {
    //throws 400 status 
    if(!req.body.prompt_info || !req.body.user_id || !req.body.story_id) {
       return res.status(400).json({message: "No prompt data received", data: req.body});
    }

    //formatting the story & extra details (ignoring story_name and chapter_count for now, also ignores the need for a previous_chapter entry)
    const prompt_info = JSON.stringify(req.body.prompt_info.details);
    const story_outline = JSON.stringify(req.body.prompt_info.story_outline);
    console.log("story_details taken in as promptinfo: "+ prompt_info);

    //sends to promptformatter to be organized in an acceptable format for the llama API
    var prompt = prompt_formatter.first_chapter(prompt_info, story_outline);
    var story_id = req.body.story_id;
    var user_id = req.body.user_id;
    var courier_send = {
        "prompt": prompt,
        "story_id": story_id,
        "user_id": user_id
    }
    try {
        //try to send prompt to courier
        courier_res = await axios.post(APP_URL + '/courier/story_call', {data:courier_send});
        return res.status(200).json({message: "Data Received Successfully", data: req.body});

    }
    catch(error) {
        return res.status(500).json({message: "PromptAdmin failed to connect to the couriers", error: error})
    }
});

//next chapter
router.post('/next_chapter', async (req, res) => {
    if(!req.body.prompt_info || !req.body.user_id || !req.body.story_id) {
        return res.status(400).json({message: "No prompt data received", data: req.body});
     }

    var chapter_count = req.body.previous_chapters.length;
    console.log("Current chapter count: (Test)" + chapter_count);
    var prompt_info = JSON.stringify(req.body.prompt_info.details);
    var chapter_outline = JSON.stringify(req.body.prompt_info.story_outline);
    var previous_chapters = JSON.stringify(req.body.prompt_info.previous_chapters);

    var prompt = prompt_formatter.next_chapter(prompt_info, chapter_outline, previous_chapters, chapter_count);
    var story_id = req.body.story_id;
    var user_id = req.body.user_id;
    var courier_send = {
        "prompt": prompt,
        "story_id": story_id,
        "user_id": user_id
    }
    try {
        //try to send prompt to courier
        courier_res = await axios.post('http://localhost:8080/courier/story_call', {data:courier_send});
        return res.status(200).json({message: "Data Received Successfully", data: req.body});

    }
    catch(error) {
        return res.status(500).json({message: "PromptAdmin failed to connect to the couriers", error: error})
    }

});

router.post('/regenerate_chapter', async (req, res) => {
    if(!req.body.prompt_info || !req.body.user_id || !req.body.story_id) {
        return res.status(400).json({message: "No prompt data received", data: req.body});
     }

    var chapter_count = req.body.previous_chapters.length;
    console.log("Current chapter count: (Test)" + chapter_count);
    var prompt_info = JSON.stringify(req.body.prompt_info.details);
    var chapter_outline = JSON.stringify(req.body.prompt_info.story_outline);
    var previous_chapters = JSON.stringify(req.body.prompt_info.previous_chapters);

    var prompt = prompt_formatter.regenerate(prompt_info, chapter_outline, previous_chapters, chapter_count);
    var story_id = req.body.story_id;
    var user_id = req.body.user_id;
    var courier_send = {
        "prompt": prompt,
        "story_id": story_id,
        "user_id": user_id
    }
    try {
        //try to send prompt to courier
        courier_res = await axios.post('http://localhost:8080/courier/story_call', {data:courier_send});
        return res.status(200).json({message: "Data Received Successfully", data: req.body});

    }
    catch(error) {
        return res.status(500).json({message: "PromptAdmin failed to connect to the couriers", error: error})
    }

});

//refine_prompt
router.post('/story_outline', async (req, res) => {
    if(!req.body.prompt_info || !req.body.user_id || !req.body.story_id) {
        return res.status(400).json({message: "No prompt data received", data: req.body});
    }

    //separate request body into two fields to create outline with promptformatter
    var chapter_count = JSON.stringify(req.body.prompt_info.chapter_count);
    var prompt_info = JSON.stringify(req.body.prompt_info.details);
    //create outline with two entries, calling promptformatter's storyoutline() function
    var prompt = prompt_formatter.story_outline(chapter_count, prompt_info);
    var story_id = req.body.story_id;
    var user_id = req.body.user_id;
    var courier_send = {
        "prompt": prompt,
        "story_id": story_id,
        "user_id": user_id
    }
    try {
        //try to send prompt to courier
        courier_res = await axios.post('http://localhost:8080/courier/story_call', {data:courier_send});
        return res.status(200).json({message: "Data Received Successfully", data: req.body});

    }
    catch(error) {
        return res.status(500).json({message: "PromptAdmin failed to connect to the couriers", error: error})
    }
});

// Export the routers for use in app.js
module.exports = router;
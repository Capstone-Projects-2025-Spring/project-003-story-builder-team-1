const express = require('express');
const router = express.Router();
const axios = require('axios');
const promptformatter = require('../promptformatter')

async function couriersend(promptreq) {
    try {
        //try to send prompt to courier
        courier_res = await axios.post('http://localhost:8080/courier/story_call', {data:promptreq});
        return {success: true, response: courier_res.data};

    }
    catch(error) {
    return {success: false, error};
    }
}

router.post('/first_chapter', async (req, res) => {
    //throws 400 status 
    if(!req.body.data) {
       return res.status(400).json({message: "No prompt data received", data: req.body});
    }
    //formatting the story & extra details (ignoring story_name and chapter_count for now, also ignores the need for a previous_chapter entry)
    const promptinfo = JSON.stringify(req.body.data);
    console.log("story_details taken in as promptinfo: "+ promptinfo);

    //sends to promptformatter to be organized in an acceptable format for the llama API
    var prompt = promptformatter.draft(promptinfo);

    const courierresult = await couriersend(prompt);
    if(courierresult.success) {
        return res.status(200).json({message: "Data Received Successfully", data: req.body});
    }
    else {
        return res.status(500).json({message: "PromptAdmin failed to connect to the couriers", error: error})
    }
});


//next chapter
router.post('/next_chapter', async (req, res) => {
    if(!req.body.data) {
        return res.status(400).json({message: "No prompt data received", data: req.body});
     }
    var promptinfo = JSON.stringify(req.body.details);
    var chapteroutline = JSON.stringify(req.body.story_outline);
    var previouschapter = JSON.stringify(req.body.previous_chapters);

    var prompt = promptformatter.nextchapter(promptinfo, chapteroutline, previouschapter);

    const courierresult = await couriersend(prompt);
    if(courierresult.success) {
        return res.status(200).json({message: "Data Received Successfully", data: req.body});
    }
    else {
        return res.status(500).json({message: "PromptAdmin failed to connect to the couriers", error: error})
    }

});

//refine_prompt
router.post('/story_outline', async (req, res) => {
    if(!req.body.data) {
        return res.status(400).json({message: "No prompt data received", data: req.body});
     }
    //separate request body into two fields to create outline with promptformatter
    var chaptercount = JSON.stringify(req.body.chaptercount);
    var promptinfo = JSON.stringify(req.body.details);
    //create outline with two entries, calling promptformatter's storyoutline() function
    var prompt = promptformatter.storyoutline(chaptercount, promptinfo);
    const courierresult = await couriersend(prompt);
    if(courierresult.success) {
        return res.status(200).json({message: "Data Received Successfully", data: req.body});
    }
    else {
        return res.status(500).json({message: "PromptAdmin failed to connect to the couriers", error: error})
    }
});

// Export the routers for use in app.js
module.exports = router;


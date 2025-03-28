const express = require('express');
const axios = require('axios');
const router = express.Router();

const PRIVATE_URL = process.env.PRIVATE_URL || "http://localhost";
const API_URL = PRIVATE_URL + ":5000";
let APP_URL;
if(PRIVATE_URL === "http://localhost") {
   APP_URL = "http://localhost:8080";
}
else {
   APP_URL = PRIVATE_URL;
}
let body = []
//story_call
router.post('/story_call', async (req, res) => {
    try {
        console.log("Request - courier:", req.body.data);
        body.push({ role: "user", content: req.body.messages });

        const response = await axios.post(
            API_URL + "/agent/generate",
            req.body.data,
            { headers: { "Content-Type": "application/json" } }
        );

        const result = response.data;
        body.push({ role: "assistant", content: result.reply });    
        console.log("Response - courier:", result);

        // Ensure this request is properly awaited
        await axios.post(
            APP_URL + "/translator/courier_response",
            { data: result.reply },
            { headers: { "Content-Type": "application/json" } }
        );

        // Return the response here so no additional response is sent later
        return res.status(200).json({ message: "Data Received Successfully", data: req.body });

    } catch (error) {
        console.error("Error:", error.message);

        // Make sure an error response is sent instead of letting execution continue
        return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

//story_push
router.post('/story_push', (req, res) => {
    res.status(200).json({message: "Data Received Successfully", data: req.body});
});

//judge
router.get('/judge', (req, res) => {
    res.status(200).json({message: "Data Received Successfully", data: req.query});
});

// Export the routers for use in app.js
module.exports = router;
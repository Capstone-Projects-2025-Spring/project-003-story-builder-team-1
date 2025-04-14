const express = require('express');
const axios = require('axios');
const { Agent } = require('http');
const router = express.Router();

const PRIVATE_URL = process.env.PRIVATE_URL || "http://localhost";
const API_URL = process.env.AGENT_URL || PRIVATE_URL;
const APP_URL = PRIVATE_URL.includes("localhost") ? PRIVATE_URL + ":8080" : PRIVATE_URL;
console.log( "DEBUG: API_URL:", API_URL); // Debugging line
//story_call
router.post('/story_call', async (req, res) => {
    try {
        const AUTHOR_NAME = req.body.author_name;
        const AGENT_PORT = ":" + getAgentPort(AUTHOR_NAME); // Get the agent port based on author name

        console.log("Request - Agent: ", AUTHOR_NAME, " - Response: ", req.body.data);
        const response = await axios.post(
            API_URL + AGENT_PORT + "/agent/generate",
            req.body.data,
            { headers: { "Content-Type": "application/json" } }
        );
   
        console.log("Response - courier:", response.data);
       
        // Ensure this request is properly awaited
        await axios.post(
            APP_URL + "/translator/courier_response",
            { data: response.data.response.content },
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

router.post('/story_stream', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();
    const AUTHOR_NAME = req.body?.author_name;
    const AGENT_PORT = ":" + (5000 + getAgentPort(AUTHOR_NAME)); // Get the agent port based on author name
  
    try {
      const agent_response = await axios.post(
        API_URL + AGENT_PORT + "/agent/stream",
        req.body.data,
        { responseType: "stream", headers: { "Content-Type": "application/json" } }
      );
  
      // 2️⃣ Pipe directly to client
      agent_response.data.pipe(res);               // ← stream chunks through
      agent_response.data.on('end', () => res.end());
      agent_response.data.on('error', () => res.end());
    } catch (error) {
      console.error("Error:", error);
      res.write(`data: ERROR: ${error.message}\n\n`);
      res.end();
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

// Function to map author name to agent container's port
function getAgentPort(authorName) {
    const agentPorts = {
        "shakespeare": 0, // Example: Shakespeare agent runs on port 5000
        "jane_austen": 1,  // Example: Jane Austen agent runs on port 5001
        "tolkien": 2,      // Example: Tolkien agent runs on port 5002
        // Add more author mappings here...
    };

return agentPorts[authorName];  // Convert author name to lowercase to avoid case sensitivity
}

// Export the routers for use in app.js
module.exports = router;
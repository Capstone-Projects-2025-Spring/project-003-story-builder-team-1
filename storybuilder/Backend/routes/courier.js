const express = require('express');
const axios = require('axios');
const { Agent } = require('http');
const router = express.Router();
const PRIVATE_URL = process.env.PRIVATE_URL || "http://localhost";
const API_URL = process.env.AGENT_URL || PRIVATE_URL;
const APP_URL = PRIVATE_URL.includes("localhost") ? PRIVATE_URL + ":8080" : PRIVATE_URL;
console.log( "DEBUG: API_URL:", API_URL); // Debugging line
//story_call


/*
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
*/

router.post('/aggregate', async (req, res) => {
    console.log("Aggregate request received:", req.body);
    const { data, messages } = req.body;

    console.log("Aggregate request received with input:", input);
    const agentEndpoints = [
        'http://localhost:5000/agent_routes/generate_outline',
        'http://localhost:5001/agent_routes/generate_critique_outline',
        'http://localhost:5002/agent_routes/rewrite_outline',
        'http://localhost:5003/agent_routes/first_chapter',
        'http://localhost:5004/agent_routes/next_chapter',
        'http://localhost:5005/agent_routes/critique_chapter',
        'http://localhost:5006/agent_routes/rewrite_chapter',
        // Example endpoint for Jane Austen agent
        //'http://localhost:5002/agent/stream_graph', // Example endpoint for Tolkien agent
        //'http://localhost:5003/agent/stream_graph', // Example endpoint for another agent
    ];      
    // Store responses and votes
    const responses = {};
    const votes = {};
    const step = data.step;
    let agent_send = {
        persona,
        prompt_info,
        outline,
        critique,
        chapter,
        critique_bank,
        chapter_bank
    };
    const persona = data.story_agents[0];
    
    switch(step) {
        case "generate_outline":
            agent_send.persona = `${persona}`.trim();
            agent_send.prompt_info = `${data.generate_outline.story_details} ${data.generate_outline.extra_details}`.trim();
            break;
        case "critique_outline":
            agent_send.persona = persona;
            agent_send.prompt_info = `${data.critique_outline.story_details} ${data.critique_outline.extra_details}`.trim();
            agent_send.outline = `${data.critique_outline_story_outline}`;
            break;

        case "rewrite_outline":
            agent_send.persona = persona;
            agent_send.prompt_info = `${data.rewrite_outline.story_details} ${data.rewrite_outline.extra_details}`.trim();
            agent_send.outline = data.rewrite_outline.story_outline;
            break;
        case "generate_first_chapter":
            agent_send.persona = persona;
            agent_send.prompt_info = `${data.generate_first_chapter.story_details} ${data.generate_first_chapter.extra_details}`.trim();
            agent_send.outline = data.generate_first_chapter.story_outline;
            break;
        case "generate_next_chapter":
            agent_send.persona = persona;
            agent_send.prompt_info = `${data.generate_next_chapter.story_details} ${data.generate_next_chapter.extra_details}`.trim();
            agent_send.chapter = data.generate_next_chapter.previous_chapters;
            agent_send.outline = data.generate_next_chapter.story_outline;
            break;
        case "critique_chapter":
            agent_send.persona = persona;
            agent_send.prompt_info = `${data.critique_chapter.story_details} ${data.critique_chapter.extra_details}`.trim();
            agent_send.chapter = data.critique_chapter.chapter;
            agent_send.outline = data.critique_chapter.story_outline;
            break;
        case "rewrite_chapter": 
            agent_send.persona = persona;
            agent_send.prompt_info = `${data.rewrite_chapter.story_details} ${data.rewrite_chapter.extra_details}`.trim();
            agent_send.critique = data.rewrite_chapter.chapter;
            agent_send.outline = data.rewrite_chapter.story_outline;
            agent_send.chapter = data.rewrite_chapter.chapter;
            break;
    }
    try {
        // For each agent, open the stream and read ALL data
        const agentResults = await Promise.all(
            agentEndpoints.map(async (agent, idx) => {
                const response = await axios.post(
                    agent,
                    { messages: agent_send },
                    { headers: { "Content-Type": "application/json" }, responseType: 'stream' }
                );
                return new Promise((resolve, reject) => {
                    let data = [];

                    response.data.on('data', chunk => {
                        let str = chunk.toString();
                        str = str.replace(/^data: /, ''); // Remove "data: " prefix
                        str = str.slice(0, -2); // Remove "\n\n" suffix
                        res.write(`-agent ${idx + 1} ${str}`); 
                        str = `data: ${str}\n\n`; // Format for SSE
                        // Optionally: parse each SSE chunk here.
                        data.push(str);
                        console.log(str);
                    });
                    response.data.on('end', () => {
                        // Optionally: parse out just the relevant story from data
                        // For now, just return all received SSE data
                        data = data.slice(0, -1); // Remove the last empty chunk or DONE chunk
                        data = data.map(
                            event => event
                            .replace(/^data: /, '') // Remove "data: " prefix
                            .slice(0, -2)) // Remove "\n\n" suffix
                            .join(''); // Join the array into a single string

                        agent_name = `agent ${idx + 1}`;
                        resolve({ agent_name, data });
                    });
                    response.data.on('error', err => reject(err));
                });
            })
        );
        // At this point, all agent SSE streams are OVER and you have all data
        // We need to develop the logic to determine the best response from our results
        const bestResult = agentResults.find(r => r.data && r.data.length > 0);
        console.log("Best result from agents:", bestResult);
        // res.json({
        //     bestResponse: bestResult,
        //     allResults: agentResults,
        // }); // Send the best response to the client
        res.write(JSON.stringify({
            bestResponse: bestResult,
            allResults: agentResults,
        })); // Send the best response to the client
    } catch (error) {
        console.error(error);
        res.status(500).send('Error occurred while aggregating responses.');
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
        API_URL + AGENT_PORT + "/agent/stream_graph",
        req.body.data,
        { responseType: "stream", headers: { "Content-Type": "application/json" } }
      );
      console.log("Agent response:", agent_response);
      if (!res.writableEnded) res.end(); // <------ ADD THIS 

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
const express = require('express');
const axios = require('axios');
const { Agent } = require('http');
const { error } = require('console');
const { db } = require('../models/story');
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

router.post('/aggregate', async (req, res) => {
    console.log("Aggregate request received:", req.body);
    const input = req.body.messages;
    console.log("Aggregate request received with input:", input);
    const data = req.body.data;
    const agent_data = data.story_agents;
    const agent_names = agent_data.map(agent => agent.agent_name);
    const agent_ids = agent_data.map(agent => agent.agent_id);
    console.log("Agent data:", agent_data, "Agent names:", agent_names, "Agent IDs:", agent_ids);

    const agentEndpoints = [
        'http://localhost:5000/agent/stream_graph',
        'http://localhost:5001/agent/stream_graph', // Example endpoint for Jane Austen agent
        //'http://localhost:5002/agent/stream_graph', // Example endpoint for Tolkien agent
        //'http://localhost:5003/agent/stream_graph', // Example endpoint for another agent
    ];      
    // Store responses and votes
    const votes = {};
  
    try {
        // For each agent, open the stream and read ALL data
        const agentResults = await Promise.all(
            agentEndpoints.map(async (agent , idx) => {
                const response = await axios.post(
                    agent,
                    { messages: input },
                    { headers: { "Content-Type": "application/json" }, responseType: 'stream' }
                );
                return new Promise((resolve, reject) => {
                    let data = [];

                    response.data.on('data', chunk => {
                        let str = chunk.toString();
                        str = str.replace(/^data: /, ''); // Remove "data: " prefix
                        str = str.slice(0, -2); // Remove "\n\n" suffix
                        res.write(`${agent_names[idx]} ${agent_ids[idx]} ${str}`); 
                        str = `data: ${str}\n\n`; // Format for SSE
                        // Optionally: parse each SSE chunk here.
                        data.push(str);
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

                        const agent_name = `${agent_names[idx]}`;
                        const agent_id = `${agent_ids[idx]}`;
                        resolve({ agent_name, agent_id, data,});
                    });
                    response.data.on('error', err => reject(err));
                });
            })
        );
        // At this point, all agent SSE streams are OVER and you have all data
        // We need to develop the logic to determine the best response from our results
        const bestResult = agentResults.find(r => r.data && r.data.length > 0);
        console.log("Best result from agents:", bestResult);

        const agent_votes = [
            { agent_name: "King", agent_id: "6801acea06a91982122cd951", votes: 8},
            { agent_name: "shakespeare", agent_id: "6801acea06a91982122cd952", votes: 8}
        ]
        
        const db_data = {
                bestResponse: bestResult,
                allResults: agentResults,
                votes: agent_votes
        }

        await db_store(req.body.data.step, req.body.data.user_id, req.body.data.story_id, req.body.data.chapter_number, db_data);
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

async function db_store(step, user_id, story_id, chapter_number, responses) {
    console.log("allResults", responses.allResults);
    try {
        switch(step) {
            case "generate_outline":
                await axios.post(`${APP_URL}/db/story/${user_id}/${story_id}/add_outline`, { outline: responses.bestResponse.data });
                await axios.post(`${APP_URL}/db/story/${user_id}/${story_id}/add_agent_outlines`, { outlines: responses.allResults, votes: responses.votes });
                break;
            case "critique_outline":
                await axios.post(`${APP_URL}/db/story/${user_id}/${story_id}/story_add_voted_critique_post`, { chapter_number: chapter_number, critique: responses.bestResponse.data });
                await axios.post(`${APP_URL}/db/story/${user_id}/${story_id}/add_agent_critiques`, { chapter_number: chapter_number, critiques: responses.allResults, votes: responses.votes });
                break;
            case "rewrite_outline":
                await axios.post(`${APP_URL}/db/story/${user_id}/${story_id}/add_outline`, { outline: responses.bestResponse.data });
                await axios.post(`${APP_URL}/db/story/${user_id}/${story_id}/add_agent_outlines`, { outlines: responses.allResults, votes: responses.votes });
                break;
            case "generate_first_chapter":
                await axios.post(`${APP_URL}/db/story/${user_id}/${story_id}/add_chapter`, {story_chapter_number: chapter_number, text: responses.bestResponse.data});
                await axios.post(`${APP_URL}/db/story/${user_id}/${story_id}/add_agent_chapter`, {chapter_number: chapter_number, content: responses.allResults, votes: responses.votes});
                break;
            case "generate_next_chapter":
                await axios.post(`${APP_URL}/db/story/${user_id}/${story_id}/add_chapter`, {story_chapter_number: chapter_number, text: responses.bestResponse.data});
                await axios.post(`${APP_URL}/db/story/${user_id}/${story_id}/add_agent_chapter`, {chapter_number: chapter_number, content: responses.allResults, votes: responses.votes});
                break;
            case "critique_chapter":
                await axios.post(`${APP_URL}/db/story/${user_id}/${story_id}/story_add_voted_critique_post`, { chapter_number: chapter_number, critique: responses.bestResponse.data });
                await axios.post(`${APP_URL}/db/story/${user_id}/${story_id}/add_agent_critiques`, { chapter_number: chapter_number, critiques: responses.allResults, votes: responses.votes });
                break;
            case "rewrite_chapter":
                await axios.post(`${APP_URL}/db/story/${user_id}/${story_id}/add_chapter`, {story_chapter_number: chapter_number, text: responses.bestResponse.data});
                await axios.post(`${APP_URL}/db/story/${user_id}/${story_id}/add_agent_chapter`, {chapter_number: chapter_number, content: responses.allResults, votes: responses.votes});
                break;
            default:
                return res.status(400).json({ message: "Invalid step provided." });
        }
    } catch (error) {
        console.error("Error adding agent data to database:", error.message);
        return res.status(500).json({ message: "Failed to add agent data to database", error: error.message });
    }
}

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
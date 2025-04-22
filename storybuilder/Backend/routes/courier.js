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


router.post('/aggregate', async (req, res) => {
    // Pre changes
    console.log("Aggregate request received:", req.body);
    const { data, messages } = req.body;
    const story_step = data.step;
    console.log("Aggregate request received with data:", data);
    const agent_data = data.story_agents;
    const agent_names = agent_data.map(agent => agent.agent_name);
    const agent_ids = agent_data.map(agent => agent.agent_id);
    console.log("Agent data:", agent_data, "Agent names:", agent_names, "Agent IDs:", agent_ids);
    
    let agentroute = 'http://localhost:{port}/agent/{step}';
    let agent_endpoints = [];
    for(let i = 0; i < data.story_agents.length; i++) {
        let new_route = agentroute.replace(/{port}/, 5000+i);
        agent_endpoints.push(new_route);
        agent_endpoints[i] = agent_endpoints[i].replace(/{step}/, story_step);
    }
    console.log(agent_endpoints);

    const agentEndpoints = [
        'http://localhost:5000/agent/generate_outline',
        'http://localhost:5001/agent/generate_outline', // Example endpoint for Jane Austen agent
        //'http://localhost:5002/agent/stream_graph', // Example endpoint for Tolkien agent
        //'http://localhost:5003/agent/stream_graph', // Example endpoint for another agent
    ];      
    // Store responses and votes
    let agent_send = {};
    //prompt info variable for voting later
    let prompt_info = {};
    try {
        // For each agent, open the stream and read ALL data
        const agent_results = await Promise.all(
            //chosen endpoint above send out as a promise
            agent_endpoints.map(async (agent, idx) => {
                //grab persona associated with agent
                const persona = agent_data[idx].persona;
                console.log("Agent persona:" + persona);
                //begin adding persona (always will be the first input variable in all tools)
                agent_send = {
                    persona
                  };
              
                  switch (story_step) {
                    case "generate_outline":
                      agent_send.prompt_info = `${data.generate_outline.story_details} ${data.generate_outline.extra_details}`.trim();
                      break;
                    case "critique_outline":
                      agent_send.prompt_info = `${data.critique_outline.story_details} ${data.critique_outline.extra_details}`.trim();
                      agent_send.outline = data.critique_outline_story_outline;
                      break;
                    case "rewrite_outline":
                      agent_send.prompt_info = `${data.rewrite_outline.story_details} ${data.rewrite_outline.extra_details}`.trim();
                      agent_send.outline = data.rewrite_outline.story_outline;
                      break;
                    case "generate_first_chapter":
                      agent_send.prompt_info = `${data.generate_first_chapter.story_details} ${data.generate_first_chapter.extra_details}`.trim();
                      agent_send.outline = data.generate_first_chapter.story_outline;
                      break;
                    case "generate_next_chapter":
                      agent_send.prompt_info = `${data.generate_next_chapter.story_details} ${data.generate_next_chapter.extra_details}`.trim();
                      agent_send.chapter = data.generate_next_chapter.previous_chapters;
                      agent_send.outline = data.generate_next_chapter.story_outline;
                      break;
                    case "critique_chapter":
                      agent_send.prompt_info = `${data.critique_chapter.story_details} ${data.critique_chapter.extra_details}`.trim();
                      agent_send.chapter = data.critique_chapter.chapter;
                      agent_send.outline = data.critique_chapter.story_outline;
                      break;
                    case "rewrite_chapter":
                      agent_send.prompt_info = `${data.rewrite_chapter.story_details} ${data.rewrite_chapter.extra_details}`.trim();
                      agent_send.chapter = data.rewrite_chapter.chapter;
                      agent_send.outline = data.rewrite_chapter.story_outline;
                      agent_send.critique = data.rewrite_chapter.chapter;
                      break;
                  }
                prompt_info = agent_send.prompt_info;
                const response = await axios.post(
                    agent,
                    { messages: agent_send },
                    { headers: { "Content-Type": "application/json" }, responseType: 'stream' }
                );
                return new Promise((resolve, reject) => {
                    let data = [];
                    let thoughts = [];

                    response.data.on('data', chunk => {
                        let str = chunk.toString();
                        str = str.replace(/^data: /, ''); // Remove "data: " prefix
                        str = str.slice(0, -2); // Remove "\n\n" suffix
                        res.write(`${agent_names[idx]}|${agent_ids[idx]}|${str}`);
                        if (!str.startsWith("tool_call: ")) {
                            thoughts.push(str); // Store thought for this agent
                        }
                        else if (str.startsWith("tool_call: ")) {
                            str = str.replace(/^tool_call: /, ''); // Remove "tool_call: " prefix
                            data.push(str); 
                        }
                    });
                    response.data.on('end', () => {
                        // Optionally: parse out just the relevant story from data
                        // For now, just return all received SSE data
                        data = data.slice(0, -1); // Remove the last empty chunk or DONE chunk
                        data = data.join(''); // Join the array into a single string
                        thoughts = thoughts.join('');
                        const agent_name = `${agent_names[idx]}`;
                        const agent_id = `${agent_ids[idx]}`;
                        resolve({ agent_name, agent_id, data, thoughts});
                    });
                    response.data.on('error', err => reject(err));
                });
            })
        );
        // At this point, all agent SSE streams are OVER and you have all data
        // We need to develop the logic to determine the best response from our results
        //const best_result = agent_results.find(response => response.data && response.data.length > 0);
        //const agent_thoughts = agent_results.map(result => result.thoughts && result.agent_id.thoughts > 0);

        //This is a list of output from each agent. Each agent will then judge the output of every agent (alongside its own output) and vote on the best entry.
        const vote_bank = agent_results.map((result) => ({
            data: result.data
          }));
          
        console.log(vote_bank);

        //reroutes old agent endpoints list to the corresponding vote endpoint for each story step
        for(let j = 0; j < agent_endpoints.length; j++) {
            agent_endpoints[j] = agent_endpoints[j].replace(`/agent/`, '/agent/vote_');
        }
        console.log(agent_endpoints);

        const vote_results = await Promise.all(
            agent_endpoints.map(async (agent, idx) => {
              const persona = data.story_agents[idx].persona;
          
              // All structured output agents require just persona + prompt_info (plus outline_bank if voting)
              const vote_send = {
                persona,
                prompt_info: prompt_info,
                vote_bank: vote_bank, // Optional: include only if needed by the vote tool
              };
          
              try {
                const response = await axios.post(agent, { messages: vote_send });
                const { winning_index, vote_value } = response.data;
          
                return {
                  winning_index,
                  vote_value,
                  structured: true,
                };
              } catch (err) {
                console.error(`Error calling structured agent at ${agent}:`, err.message);
                return {
                  error: err.message,
                  structured: true,
                };
              }
            })
          );
        //The final list of votes and their corresponding "weights". Weights (vote_value) can serve as a tie-breaker if the entry in 1st place is disputed.
        const votes = vote_results.map(result => result.data);

        
        console.log("Vote results", votes);

        const agent_votes = agent_data.map((agent) => ({
            agent_name: agent.agent_name,
            agent_id: agent.agent_id,
            votes: 13
        }));
        
        const db_data = {
                best_response: best_result,
                all_results: agent_results,
                votes: agent_votes
        };

        await db_store(req.body.data.step, req.body.data.user_id, req.body.data.story_id, req.body.data.chapter_number, db_data);
        // res.json({
        //     best_response: bestResult,
        //     all_results: agentResults,
        // }); // Send the best response to the client
        res.write(JSON.stringify({
            best_response: best_result,
            all_results: agent_results,
        })); // Send the best response to the client
    } catch (error) {
        console.error(error);
        res.status(500).send('Error occurred while aggregating responses.');
    }
    async function db_store(step, user_id, story_id, chapter_number, responses) {
        console.log("all_results", responses.all_results);
        try {
            switch(step) {
                case "generate_outline":
                    await axios.post(`${APP_URL}/db/story/${user_id}/${story_id}/add_outline`, { outline: responses.best_response.data });
                    await axios.post(`${APP_URL}/db/story/${user_id}/${story_id}/add_agent_outlines`, { outlines: responses.all_results, votes: responses.votes });
                    break;
                case "critique_outline":
                    await axios.post(`${APP_URL}/db/story/${user_id}/${story_id}/story_add_voted_critique_post`, { chapter_number: chapter_number, critique: responses.best_response.data });
                    await axios.post(`${APP_URL}/db/story/${user_id}/${story_id}/add_agent_critiques`, { chapter_number: chapter_number, critiques: responses.all_results, votes: responses.votes });
                    break;
                case "rewrite_outline":
                    await axios.post(`${APP_URL}/db/story/${user_id}/${story_id}/add_outline`, { outline: responses.best_response.data });
                    await axios.post(`${APP_URL}/db/story/${user_id}/${story_id}/add_agent_outlines`, { outlines: responses.all_results, votes: responses.votes });
                    break;
                case "generate_first_chapter":
                    await axios.post(`${APP_URL}/db/story/${user_id}/${story_id}/add_chapter`, {story_chapter_number: chapter_number, text: responses.best_response.data});
                    await axios.post(`${APP_URL}/db/story/${user_id}/${story_id}/add_agent_chapter`, {chapter_number: chapter_number, content: responses.all_results, votes: responses.votes});
                    break;
                case "generate_next_chapter":
                    await axios.post(`${APP_URL}/db/story/${user_id}/${story_id}/add_chapter`, {story_chapter_number: chapter_number, text: responses.best_response.data});
                    await axios.post(`${APP_URL}/db/story/${user_id}/${story_id}/add_agent_chapter`, {chapter_number: chapter_number, content: responses.all_results, votes: responses.votes});
                    break;
                case "critique_chapter":
                    await axios.post(`${APP_URL}/db/story/${user_id}/${story_id}/story_add_voted_critique_post`, { chapter_number: chapter_number, critique: responses.best_response.data });
                    await axios.post(`${APP_URL}/db/story/${user_id}/${story_id}/add_agent_critiques`, { chapter_number: chapter_number, critiques: responses.all_results, votes: responses.votes });
                    break;
                case "rewrite_chapter":
                    await axios.post(`${APP_URL}/db/story/${user_id}/${story_id}/add_chapter`, {story_chapter_number: chapter_number, text: responses.best_response.data});
                    await axios.post(`${APP_URL}/db/story/${user_id}/${story_id}/add_agent_chapter`, {chapter_number: chapter_number, content: responses.all_results, votes: responses.votes});
                    break;
                default:
                    return res.status(400).json({ message: "Invalid step provided." });
            }
        } catch (error) {
            console.error("Error adding agent data to database:", error.message);
            return res.status(500).json({ message: "Failed to add agent data to database", error: error.message });
        }
    }
    
});

// Export the routers for use in app.js
module.exports = router;
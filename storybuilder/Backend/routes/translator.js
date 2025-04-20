const express = require('express');
const axios = require('axios');
const router = express.Router();

const PRIVATE_URL = process.env.PRIVATE_URL || "http://localhost:8080";
const APP_URL = PRIVATE_URL;

router.get('/translate', async (req, res) => {
    const { user_id, story_id, step, chapter_number } = req.query;
    console.log("req.query in translate", req.query);
    
    if (!user_id || !story_id || !step || chapter_number == null) {
        return res.status(400).json({ message: "Missing required fields", data: req.query });
    }

    // // Set the necessary SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const valid_steps = new Set([
        "generate_outline",
        "critique_outline",
        "rewrite_outline",
        "generate_first_chapter",
        "generate_next_chapter",
        "critique_chapter",
        "rewrite_chapter",
      ]);

    if (!valid_steps.has(step)) {
        return res.status(400).json({ message: "Invalid step provided.", data: step });
      }

    let data = {
        user_id,
        story_id,
        step,
        chapter_number,
        story_agents: [],
        generate_outline: { story_name: "", story_details: "", extra_details: "" },
        critique_outline: { story_name: "", story_details: "", extra_details: "", story_outline: "" },
        rewrite_outline: { story_name: "", story_details: "", extra_details: "", story_outline: "", outline_critique: "" },
        generate_first_chapter: { story_name: "", story_details: "", extra_details: "", story_outline: "" },
        generate_next_chapter: { story_name: "", story_details: "", extra_details: "", story_outline: "", previous_chapters: [] },
        critique_chapter: { story_name: "", story_details: "", extra_details: "", story_outline: "", chapter: "" },
        rewrite_chapter: { story_name: "", story_details: "", extra_details: "", story_outline: "", chapter: "", chapter_critique: "" }
    };

    try {
        response = await axios.get(`${APP_URL}/db/story/${user_id}/${story_id}/story_agent_list`);
        if (!response.data || !response.data.story_agents) {
            return res.status(404).json({ message: "Agent list unobtainable" });
        }
        
        data.story_agents = response.data.story_agents;
    } catch (err) {
        console.error("Error fetching story agent list:", err);
        return res.status(500).json({ message: "Server error retrieving agent list" });
    }

    try {
        let response;
        switch (step) {
            case "generate_outline":
                response = await axios.get(`${APP_URL}/db/story/${user_id}/${story_id}/get_generated_outline_details`);
                data.generate_outline = { 
                    story_name: response.data.story_name,
                    story_details: response.data.story_details,
                    extra_details: response.data.extra_details || ""
                };
                break;

            case "critique_outline":
                response = await axios.get(`${APP_URL}/db/story/${user_id}/${story_id}/get_critique_outline_details`);
                data.critique_outline = { 
                    story_name: response.data.story_name, 
                    story_details: response.data.story_details, 
                    extra_details: response.data.extra_details || "",
                    story_outline: response.data.story_outline
                };
                break;
            
            case "rewrite_outline":
                response = await axios.get(`${APP_URL}/db/story/${user_id}/${story_id}/get_rewrite_outline_details`);
                data.rewrite_outline = {
                    story_name: response.data.story_name,
                    story_details: response.data.story_details,
                    extra_details: response.data.extra_details || "",
                    story_outline: response.data.story_outline,
                    outline_critique: response.data.outline_critique
                };
                break;

            case "generate_first_chapter":
                response = await axios.get(`${APP_URL}/db/story/${user_id}/${story_id}/get_first_chapter_details`);
                data.generate_first_chatper = {
                    story_name: response.data.story_name,
                    story_details: response.data.story_details,
                    extra_details: response.data.extra_details || "",
                    story_outline: response.data.story_outline
                };
                break;  

            case "generate_next_chapter":
                console.log("Chapter number:", chapter_number);
                response = await axios.get(`${APP_URL}/db/story/${user_id}/${story_id}/${chapter_number}/get_next_chapter_details`);
                data.generate_next_chapter = {
                    story_name: response.data.story_name,
                    story_details: response.data.story_details,
                    extra_details: response.data.extra_details || "",
                    story_outline: response.data.story_outline,
                    previous_chapters: response.data.previous_chapters
                };
                break;
            
            case "critique_chapter":
                response = await axios.get(`${APP_URL}/db/story/${user_id}/${story_id}/${chapter_number}/get_critique_chapter_details`);
                data.critique_chapter = {
                    story_name: response.data.story_name,
                    story_details: response.data.story_details,
                    extra_details: response.data.extra_details || "",
                    story_outline: response.data.story_outline,
                    chapter: response.data.chapter
                };
                break;

            case "rewrite_chapter":
                response = await axios.get(`${APP_URL}/db/story/${user_id}/${story_id}/${chapter_number}/get_rewrite_chapter_details`);
                data.rewrite_chapter = {
                    story_name: response.data.story_name,
                    story_details: response.data.story_details,
                    extra_details: response.data.extra_details || "",
                    story_outline: response.data.story_outline,
                    chapter: response.data.chapter,
                    chapter_critique: response.data.critique
                };
                break;

            default:
                return res.status(400).json({ message: "Invalid step provided." });
        }
        const courier_response = await axios.post(
            `${APP_URL}/courier/aggregate`, 
            { data, messages: req.body.messages },
            { headers: { "Content-Type": "application/json" }, responseType: 'stream' }
        );

        return new Promise((resolve, reject) => {
            // let buffer = [];
            // courier_response.data.on('data', chunk => {
            //     if (chunk.toString().startsWith("{\"best")) {
            //         buffer = buffer.slice(0, -1); // Remove the last empty chunk or DONE chunk
            //         buffer = buffer.map(
            //             event => event
            //             .replace(/^data: /, '') // Remove "data: " prefix
            //             .slice(0, -2)) // Remove "\n\n" suffix
            //             .join(''); // Join the array into a single string
            //         //console.log("Buffer on end:", buffer);
            //         //resolve(res.status(200).json({ message: "Data Received Successfully", data: { ...data, response: buffer } }));
            //     }
            //     else
            //         buffer.push(chunk.toString());
            // });
            // courier_response.data.on('end', () => {
            //     console.log("Buffer on end:", buffer);
            //     buffer = buffer.slice(0, -1); // Remove the last empty chunk or DONE chunk
            //     buffer = buffer.map(
            //         event => event
            //         .replace(/^data: /, '') // Remove "data: " prefix
            //         .slice(0, -2)) // Remove "\n\n" suffix
            //         .join(''); // Join the array into a single string
            //     resolve({ buffer });
            // });
            // courier_response.data.on('error', err => {
            //     console.error("Error in courier response stream:", err);
            //     reject(err);
            // });

            courier_response.data.on('data', chunk => {
                console.log("Raw chunk:", chunk.toString());
                res.write(`data: ${chunk.toString()}\n\n`); // SSE stream already open
            });
            
            courier_response.data.on('end', () => {
                res.write("event: done\ndata: [DONE]\n\n");
                res.end(); // Close SSE stream
            });
        });
    } catch (error) {
        console.error("Error fetching step data:", error.message);
        return res.status(500).json({ message: "Failed to get step data", error: error.message });
    }
});

module.exports = router;
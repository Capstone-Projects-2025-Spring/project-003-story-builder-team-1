import { createContext, useContext, useState } from "react";
import USE_AXIOS from "../hooks/USE_AXIOS";
import { USE_AUTH } from "./AUTH_CONTEXT";
import { USE_USER } from "./USER_CONTEXT";

const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:8080";

const STORY_CONTEXT = createContext();

export const STORY_PROVIDER = ({ children }) => {
    const { use_axios } = USE_AXIOS();
    const user_context = USE_USER();
    const fetch_user_data = user_context?.fetch_user_data;
    const { user } = USE_AUTH();
    const [story_id, set_story_id] = useState(null);
    const [agent_ids, set_agent_ids] = useState([]);
    const [story_name_error, set_story_name_error] = useState('');
    const [story_details_error, set_story_details_error] = useState('');
    const [api_error, set_api_error] = useState('');
    const [loading, set_loading] = useState(false);
    const [should_stream, set_should_stream] = useState(false);
    const [agent_responses, set_agent_responses] = useState({});  // State to store responses for each agent
    const [agent_thoughts, set_agent_thoughts] = useState({});  // State to store thoughts for each agent
    const [agent_critiques, set_agent_critiques] = useState({});  // State to store critiques for each agent
    const [agent_critique_thoughts, set_agent_critique_thoughts] = useState({});  // State to store critique thoughts for each agent
    const [agent_rewrites, set_agent_rewrites] = useState({});  // State to store rewrites for each agent  
    const [agent_rewrite_thoughts, set_agent_rewrite_thoughts] = useState({});  // State to store rewrite thoughts for each agent
    const [streaming_action, set_streaming_action] = useState('');
    const [disable_regenerate, set_disable_regenerate] = useState(false);
    const [disable_continue, set_disable_continue] = useState(false);
    const [curr_step, set_curr_step] = useState(''); // Default step

    const submit_story_prompt = async (story_name, story_details, extra_details, selected_agents) => {
        // reset errors
        set_story_name_error('');
        set_story_details_error('');
        set_api_error('');
        set_loading(true);
        let has_error = false;

        // input handling
        if (!story_name) {
            set_story_name_error('Story Title must not be empty');
            has_error = true;
        }

        if (!story_details) {
            set_story_details_error('Story Prompt must not be empty');
            has_error = true;
        }

        if (has_error) {
            set_loading(false);
            return false;
        }

        // transform list to proper format to be read "agent_name": "King"
        const transformed_agents_list = selected_agents.map(name => ({ agent_name: name }));

        // first api call to db to create story
        const { data: create_data, error: create_error } = await use_axios(`${SERVER_URL}/db/story/${user}/create`, "POST", {
            story_name,
            prompt: {
                story_details,
                extra_details,
            },
            agents: transformed_agents_list,
        });

        // if data is null, set error and return false
        if (create_data === null) {
            set_api_error(create_error);
            set_loading(false);
            return false;
        }

        // if data is not null, set story_id and agent_ids
        set_story_id(create_data.story);
        set_agent_ids(create_data.agent_ids);

        // everything works, return true
        set_loading(false);
        return true;
    };

    const generate_outline = async (curr_story_id) => {
        set_curr_step('generate'); // set current step to generate
        set_api_error('');
        set_loading(true);
        set_should_stream(true); // allow streaming now
        set_disable_regenerate(true); // disable regenerate button
        set_streaming_action('continue'); // set action to continue for loading

        return true;
    }

    const start_event_stream = (user, story_id, step, chapter_number) => {
        console.log("Starting event stream");
        console.log("Current Step:", curr_step);
        console.log("Step:", step);
        console.log("Chapter number:", chapter_number);
        set_agent_responses({});  // Reset agent responses
        set_agent_thoughts({});  // Reset agent thoughts
        set_agent_critiques({});
        set_agent_critique_thoughts({});

        const url = `${SERVER_URL}/translator/translate?user_id=${user}&story_id=${story_id}&step=${step}&chapter_number=${chapter_number}`;
        const eventSource = new EventSource(url);
    
        eventSource.onmessage = (event) => {
            const raw = event.data;
            const restored = raw.replace(/\[\[NL\]\]/g, "\n");
    
            if (restored.startsWith("{\"best")) {
                eventSource.close();
                console.log("Event stream closed");
                set_should_stream(false);
                fetch_user_data(user);
                // reset everything
                set_disable_continue(false);
                set_disable_regenerate(false);
                set_streaming_action('');
                return;
            }
    
            try {
                const parts = restored.split("|");
                const agent_name = parts[0];
                const agent_id = parts[1];
                let token = parts.slice(2).join("|");
    
                if (token.startsWith("tool_call: ")) {
                    token = token.replace("tool_call: ", "");
                    if (curr_step === "critique") {
                    set_agent_critiques((prev) => ({
                        ...prev,
                        [agent_id]: (prev[agent_id] || "") + token,
                    }));
                    }
                    else {
                    set_agent_responses((prev) => ({
                    ...prev,
                    [agent_id]: (prev[agent_id] || "") + token,
                    }));
                }
                }
                else {
                    if (curr_step === "critique") {
                        set_agent_critique_thoughts((prev) => ({
                            ...prev,
                            [agent_id]: (prev[agent_id] || "") + token,
                        }));
                    }
                    else {
                        set_agent_thoughts((prev) => ({
                            ...prev,
                            [agent_id]: (prev[agent_id] || "") + token,
                        }));
                    }
                }
    
            } catch (err) {
                console.error("Failed to parse SSE message", err);
            }
        };
    
        eventSource.onerror = () => {
            console.error("SSE error");
            eventSource.close();
        };

    };

    return (
        <STORY_CONTEXT.Provider value={{
            story_id,
            agent_ids,
            should_stream,
            set_should_stream,
            streaming_action,
            set_streaming_action,
            start_event_stream,
            agent_responses,
            set_agent_responses,
            agent_thoughts,
            set_agent_thoughts,
            agent_critiques,
            set_agent_critiques,
            agent_critique_thoughts,
            set_agent_critique_thoughts,
            agent_rewrites,
            set_agent_rewrites,
            agent_rewrite_thoughts,
            set_agent_rewrite_thoughts,
            submit_story_prompt,
            generate_outline,
            story_name_error,
            story_details_error,
            api_error,
            loading,
            disable_regenerate,
            set_disable_regenerate,
            disable_continue,
            set_disable_continue,
            curr_step,
            set_curr_step,
        }}>
            {children}
        </STORY_CONTEXT.Provider>
    );
};

export const USE_STORY = () => useContext(STORY_CONTEXT);
export default STORY_CONTEXT;
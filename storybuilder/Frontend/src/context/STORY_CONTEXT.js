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
    const [streamingAction, setStreamingAction] = useState(null);
    const [isStreaming, setIsStreaming] = useState(false);

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
        set_api_error('');
        set_loading(true);
        set_should_stream(true); // allow streaming now
    
        // const { data: gen_outline_data, error: gen_outline_error } = await use_axios(
        //     `${SERVER_URL}/translator/translate?user_id=${user}&story_id=${curr_story_id}&step=generate_outline&chapter_number=0`,
        //     "GET",
        //     // {
        //     //     user_id: user,
        //     //     story_id: curr_story_id,
        //     //     step: "generate_outline",
        //     //     chapter_number: 0,
        //     // }
        // );

        // if (gen_outline_data === null) {
        //     set_api_error(gen_outline_error);
        //     set_loading(false);
        //     return false;
        // }

        return true;
    }

    const start_event_stream = (user, story_id, step, chapter_number) => {
        setIsStreaming(true);
        set_agent_responses({});  // Reset agent responses
        set_agent_thoughts({});  // Reset agent thoughts

        const url = `${SERVER_URL}/translator/translate?user_id=${user}&story_id=${story_id}&step=${step}&chapter_number=${chapter_number}`;
        const eventSource = new EventSource(url);
    
        eventSource.onmessage = (event) => {
            const raw = event.data;
            const restored = raw.replace(/\[\[NL\]\]/g, "\n");
    
            if (restored.startsWith("{\"best")) {
                eventSource.close();
                set_should_stream(false);
                fetch_user_data(user);
                return;
            }
    
            try {
                const parts = restored.split("|");
                const agent_name = parts[0];
                const agent_id = parts[1];
                let token = parts.slice(2).join("|");
    
                if (token.startsWith("tool_call: ")) {
                  token = token.replace("tool_call: ", "");
                  set_agent_responses((prev) => ({
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
    
            } catch (err) {
                console.error("Failed to parse SSE message", err);
            }
        };
    
        eventSource.onerror = () => {
            console.error("SSE error");
            eventSource.close();
        };
        eventSource.addEventListener("story_update", (event) => {
            try {
              const parsed = JSON.parse(event.data);
              if (parsed.type === "content_chunk") {
                // Handle chunk
              } else if (parsed.type === "stream_complete") {
                setIsStreaming(false);
                set_should_stream(false);
              }
            } catch (err) {
              console.error("Failed to parse SSE data:", err);
            }
          });
    };

    return (
        <STORY_CONTEXT.Provider value={{
            story_id,
            agent_ids,
            should_stream,
            set_should_stream,
            streamingAction,
            setStreamingAction,
            start_event_stream,
            agent_responses,
            set_agent_responses,
            agent_thoughts,
            set_agent_thoughts,
            submit_story_prompt,
            generate_outline,
            story_name_error,
            story_details_error,
            api_error,
            loading,
            isStreaming,
        }}>
            {children}
        </STORY_CONTEXT.Provider>
    );
};

export const USE_STORY = () => useContext(STORY_CONTEXT);
export default STORY_CONTEXT;
import { createContext, useContext, useState } from "react";
import USE_AXIOS from "../hooks/USE_AXIOS";
import { USE_AUTH } from "./AUTH_CONTEXT";

const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:8080";

const STORY_CONTEXT = createContext();

export const STORY_PROVIDER = ({ children }) => {
    const { use_axios } = USE_AXIOS();
    const { user } = USE_AUTH();
    const [story_id, set_story_id] = useState(null);
    const [agent_ids, set_agent_ids] = useState([]);
    const [story_name_error, set_story_name_error] = useState('');
    const [story_details_error, set_story_details_error] = useState('');
    const [api_error, set_api_error] = useState('');
    const [loading, set_loading] = useState(false);

    const submit_story_prompt = async (story_name, story_details, extra_details, selected_agents) => {
        set_story_name_error('');
        set_story_details_error('');
        set_api_error('');
        set_loading(true);

        let has_error = false;

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

        const transformed_agents_list = selected_agents.map(name => ({ agent_name: name }));

        const { data, error } = await use_axios(`${SERVER_URL}/db/story/${user}/create`, "POST", {
            story_name,
            prompt: {
                story_details,
                extra_details,
            },
            agents: transformed_agents_list,
        });

        if (data === null) {
            set_api_error(error);
            set_loading(false);
            return false;
        }

        set_story_id(data.story);
        set_agent_ids(data.agent_ids);
        set_loading(false);
        return true;
    };

    return (
        <STORY_CONTEXT.Provider value={{
            story_id,
            agent_ids,
            submit_story_prompt,
            story_name_error,
            story_details_error,
            api_error,
            loading,
        }}>
            {children}
        </STORY_CONTEXT.Provider>
    );
};

export const USE_STORY = () => useContext(STORY_CONTEXT);
export default STORY_CONTEXT;
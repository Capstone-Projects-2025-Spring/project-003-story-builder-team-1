import { createContext, useContext, useState, useEffect, useCallback } from "react";
import USE_AXIOS from '../hooks/USE_AXIOS';
import { USE_AUTH } from "./AUTH_CONTEXT";

const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:8080";

const USER_CONTEXT = createContext();

export const USER_PROVIDER = ({ children }) => {
    // const { user } = USE_AUTH();
    const [user_stories, set_user_stories] = useState(null);
    const [agent_list, set_agent_list] = useState(null);
    const [loading, set_loading] = useState(false);
    const [error, set_error] = useState(null);
    const { use_axios } = USE_AXIOS();

    const fetch_user_data = useCallback(async (user_id) => {
        set_loading(true);
        set_error(null);

        // get list of stories for user
        const { data: story_list_data, error: story_list_error } = await use_axios(SERVER_URL + `/db/story/${user_id}/get_stories`, "GET");
        console.log("story_list_data", story_list_data);
        if (story_list_data) {  
            set_user_stories(story_list_data);
            console.log("user_stories", user_stories);

        } else {
            set_error(story_list_error);
        }

        // get list of agents for user
        const { data: agent_list_data, error: agent_list_error } = await use_axios(SERVER_URL + '/db/agents', "GET");

        if (agent_list_data) {
            set_agent_list(agent_list_data);
        } else {
            set_error(agent_list_error);
        }

        set_loading(false);
    },[use_axios]);

    // useEffect(() => {
    //     if (user && user.user_id) {
    //         fetch_user_data(user.user_id);
    //     }
    // }, [user, fetch_user_data]);

    return (
        <USER_CONTEXT.Provider value={{ user_stories, agent_list, fetch_user_data, loading, error }}>
            {children}
        </USER_CONTEXT.Provider>
    );
};

export const USE_USER = () => useContext(USER_CONTEXT);
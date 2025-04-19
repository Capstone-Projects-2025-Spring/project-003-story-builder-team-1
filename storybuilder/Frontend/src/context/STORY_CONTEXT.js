import { createContext, useReducer, useState, useContext } from "react";
import USE_AXIOS from '../hooks/USE_AXIOS';
import { USE_USER } from './USER_CONTEXT';
import { USE_AUTH } from "./AUTH_CONTEXT";

// Create Context
const STORY_CONTEXT = createContext();
const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:8080";

// Initial State
const initial_state = {
    current_story: null,  // Holds story details & chapters
    loading: false,       // Loading state for API calls
    error: null,          // Error messages
};

// Reducer Function
function story_reducer(state, action) {
    switch (action.type) {
        case "SUBMIT_PROMPT":
            return { ...state, loading: true, error: null };

        case "FETCH_SUCCESS":
            return {
                ...state,
                current_story: {
                    title: action.payload.title,
                    chapter_count: action.payload.chapter_count,
                    story_details: action.payload.story_details,
                    extra_details: action.payload.extra_details,
                    chapters: [action.payload.chapter], // Store the outline as first chapter
                },
                loading: false,
            };

        case "FETCH_ERROR":
            return { ...state, error: action.payload, loading: false };

        case "ADD_CHAPTER":
            return {
                ...state,
                current_story: {
                    ...state.current_story,
                    chapters: [...state.current_story.chapters, action.payload], // Append new chapter
                },
            };

        default:
            return state;
    }
}

// StoryProvider Component
export function Story_Provider({ children }) {
    const [story_name_error, set_story_name_error] = useState('');
    const [chapter_count_error, set_chapter_count_error] = useState('');
    const [story_details_error, set_story_details_error] = useState('');
    const [api_error, set_api_error] = useState('');
    const [state, dispatch] = useReducer(story_reducer, initial_state);
    const { use_axios } = USE_AXIOS();
    const auth = USE_AUTH();
    const user = auth?.user;
    const agent_list = auth?.agent_list;

    // Function to submit a new story prompt
    const submit_story_prompt = async (story_name, chapter_count, story_details, extra_details) => {
        // reset errors
        set_story_name_error('');
        set_chapter_count_error('');
        set_story_details_error('');
        set_api_error('');
        let has_error = false;

        // Check if chapter_count is not a number
        if (isNaN(chapter_count)) {
            set_chapter_count_error('Number of Chapters must be a valid number');
            has_error = true;
        }

        // if any required inputs are empty
        if (story_name === '') {
            set_story_name_error('Story Title must not be empty');
            has_error = true;
        }
        if (chapter_count === '') {
            set_chapter_count_error('Number of Chapters must not be empty');
            has_error = true;
        }
        if (story_details === '') {
            set_story_details_error('Story Prompt must not be empty');
            has_error = true;
        }

        if (!has_error) {
            dispatch({ type: "SUBMIT_PROMPT" });
            const { data: create_data, error: create_error } = await use_axios(SERVER_URL + `/story/${user.user_id}/create`, "POST", {
                    "story_name": story_name,
                    "prompt": {
                        "story_details": story_details,
                        "extra_details": extra_details,
                        "chapter_count": chapter_count
                    },
                    "agents": agent_list
                }
            );

            // if there is an api_error, dispatch FETCH_ERROR w/ error message
            if (create_data === null) {
                dispatch({ type: "FETCH_ERROR", payload: create_error });
                set_api_error(create_error);
                has_error = true;
                return false;
            }

            // no error, save story ids and agent ids to context


            // if no error on first call, call translator
            const { data: gen_outline_data, error: gen_outline_error } = await use_axios(SERVER_URL + `/translator/translate`, "POST", {
                "user_id": user.user_id,
                "story_id": "6801acea06a91982122cd950",
                "step": "generate_outline",
                "chapter_number": 0,
                "messages": [
                {   
                    "role": "system",
                    "content": "You summarize sports on a televison show"
                },
                { 
                    "role": "user", "content": "Summarize the events of the most recent football game you know of"
                }
                ],
                "stream": true
                }
            );

            // if there is an api_error, dispatch FETCH_ERROR w/ error message
            if (gen_outline_data === null) {
                dispatch({ type: "FETCH_ERROR", payload: gen_outline_error });
                set_api_error(gen_outline_error);
                has_error = true;
                return false;
            }

            // if no error, dispatch FETCH_SUCCESS
            const title = gen_outline_data?.data?.title;
            const chapter = gen_outline_data?.data?.courier_response;

            dispatch({ type: "FETCH_SUCCESS", payload: {
                        title: title,
                        chapter_count: chapter_count,
                        story_details: story_details,
                        extra_details: extra_details,
                        chapter: chapter,
                    } });
            return true;
        }

        return false;
    };

    const fetch_first_chapter = async (story_name, story_details, extra_details, story_outline) => {
        // reset errors
        set_api_error('');
        let has_error = false;

        console.log("Name: ", story_name);
        console.log("Details: ", story_details);
        console.log("Extra: ", extra_details);
        console.log("Outline: ", story_outline);

        const { data, error } = await use_axios(SERVER_URL + "/translator/first_chapter", "POST", {
            "story_name": story_name,
            "story_details": story_details,
            "extra_details": extra_details,
            "story_outline": story_outline,
            }
        );

        // if data is null there is an error
        if (data === null) {
            set_api_error(error);
            has_error = true;
            return false
        }

        const chapter = data?.data?.courier_response;
        // data exists then dispatch ADD_CHAPTER
        dispatch({ type: "ADD_CHAPTER", payload: chapter })

        return true;
        
    };

    // Function to fetch the next chapter
    const fetch_next_chapter = async (story_name, story_details, extra_details, previous_chapters, story_outline) => {
        // reset errors
        set_api_error('');
        let has_error = false;

        console.log("NEXT CHAPTER:");
        console.log("Name: ", story_name);
        console.log("Details: ", story_details);
        console.log("Extra: ", extra_details);
        console.log("Outline: ", story_outline);

        const { data, error } = await use_axios(SERVER_URL + "/translator/next_chapter", "POST", {
            "story_name": story_name,
            "story_details": story_details,
            "extra_details": extra_details,
            "previous_chapters": previous_chapters,
            "story_outline": story_outline,
            }
        );

        // if data is null there is an error
        if (data === null) {
            set_api_error(error);
            has_error = true;
            return false
        }

        const chapter = data?.data?.courier_response;
        // data exists then dispatch ADD_CHAPTER
        dispatch({ type: "ADD_CHAPTER", payload: chapter })
        console.log("Next chapter 1: ", chapter);
        return true;

    };

    return (
        <STORY_CONTEXT.Provider value={{ state, submit_story_prompt, fetch_first_chapter, fetch_next_chapter, story_name_error, chapter_count_error, story_details_error, api_error }}>
            {children}
        </STORY_CONTEXT.Provider>
    );
}

export default STORY_CONTEXT;

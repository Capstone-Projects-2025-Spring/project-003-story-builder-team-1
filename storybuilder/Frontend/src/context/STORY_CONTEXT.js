import { createContext, useReducer } from "react";
import axios from "axios";
//const axios = require("axios");

// Create Context
const STORY_CONTEXT = createContext();

// Initial State
const initial_state = {
    current_story: null,   // Holds story details & chapters
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
                    chapters: [action.payload.chapter], // Store first chapter
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
    const [state, dispatch] = useReducer(story_reducer, initial_state);

    // Function to submit a new story prompt
    const submit_story_prompt = async (story_name, chapter_count, story_details, extra_details) => {
        dispatch({ type: "SUBMIT_PROMPT" });

        try {
            const response = await axios.post("http://localhost:8080/translator/story_contents", {
                "story_name": story_name,
                "chapter_count": chapter_count,
                "story_details": story_details,
                "extra_details": extra_details
            });
            
            const title = response.data?.data?.title;
            const chapter = response.data?.data?.courier_response;
            
            dispatch({ type: "FETCH_SUCCESS", payload: {
                title: title,
                chapter: chapter,
            } });
        } catch (error) {
            dispatch({ type: "FETCH_ERROR", payload: error.message });
        }
    };

    // Function to fetch the next chapter
    const fetch_next_chapter = async (story_id, next_chapter_number) => {
        try {
            const response = await axios.get(`https://your-backend.com/api/story/${story_id}/chapter/${next_chapter_number}`);
            
            dispatch({ type: "ADD_CHAPTER", payload: response.data });
        } catch (error) {
            console.error("Error fetching chapter:", error.message);
        }
    };

    return (
        <STORY_CONTEXT.Provider value={{ state, submit_story_prompt, fetch_next_chapter }}>
            {children}
        </STORY_CONTEXT.Provider>
    );
}

export default STORY_CONTEXT;

import { createContext, useReducer, useState } from "react";
import USE_AXIOS from '../hooks/USE_AXIOS';

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
    const [is_error, set_is_error] = useState(false);
    const [story_name_error, set_story_name_error] = useState('');
    const [chapter_count_error, set_chapter_count_error] = useState('');
    const [story_details_error, set_story_details_error] = useState('');
    const [api_error, set_api_error] = useState('');
    const [state, dispatch] = useReducer(story_reducer, initial_state);
    const { use_axios } = USE_AXIOS();

    // Function to submit a new story prompt
    const submit_story_prompt = async (story_name, chapter_count, story_details, extra_details) => {
        // reset errors
        set_story_name_error('');
        set_chapter_count_error('');
        set_story_details_error('');
        set_api_error('');
        set_is_error(false);

        // Check if chapter_count is not a number
        if (isNaN(chapter_count)) {
            set_chapter_count_error('Number of Chapters must be a valid number');
            set_is_error(true);
        }

        // if any required inputs are empty
        if (story_name === '') {
            set_story_name_error('Story Title must not be empty');
            set_is_error(true);
        }
        if (chapter_count === '') {
            set_chapter_count_error('Number of Chapters must not be empty');
            set_is_error(true);
        }
        if (story_details === '') {
            set_story_details_error('Story Prompt must not be empty');
            set_is_error(true);
        }

        if (!is_error) {
            dispatch({ type: "SUBMIT_PROMPT" });
            const { data, error } = await use_axios(SERVER_URL + "/translator/story_outline", "POST", {
                "story_name": story_name,
                "chapter_count": chapter_count,
                "story_details": story_details,
                "extra_details": extra_details
                }
            );

            // if there is an api_error, dispatch FETCH_ERROR w/ error message
            if (data === null) {
                dispatch({ type: "FETCH_ERROR", payload: error });
                set_api_error(error);
                set_is_error(true);
                return false;
            }

            // if no error, dispatch FETCH_SUCCESS
            const title = data?.data?.title;
            const chapter = data?.data?.courier_response;

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
            set_is_error(true);
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
            set_is_error(true);
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

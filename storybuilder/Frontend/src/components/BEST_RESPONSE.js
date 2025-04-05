import { Card, Textarea, Button, Group } from '@mantine/core';
import { useState, useContext, useEffect } from 'react';
import STORY_CONTEXT from "../context/STORY_CONTEXT";

function BEST_RESPONSE() {
    const { state, fetch_first_chapter, fetch_next_chapter, api_error } = useContext(STORY_CONTEXT);
    const [best_res, set_best_res] = useState("Waiting for the agents to choose the best response...");

    useEffect(() => {
        if (state.current_story) {
            set_best_res(state.current_story.chapters[-1]);
        }
      }, [state.current_story]);

    function handle_continue() {
        // Handle continue button click
        console.log("Continue button clicked");

        // if chapters length is 1, only outline is available, so fetch first chapter
        if (state.current_story.chapters.length === 1) {
            const first_chapter_success = fetch_first_chapter(state.current_story.title, state.current_story.chapters[0]);
            if (first_chapter_success) {
                console.log("Successfully fetched first chapter");
    
            }
            else {
                console.log("First Chapter error");
                console.log("API ERROR: ", api_error)
            }
        }
        // chapters contains more than outline and 1st chapter, so fetch next chapter
        else {
            const next_chapter_success = fetch_next_chapter(state.current_story.title, state.current_story.chapters[0], state.current_story.chapters.slice(1));
            if (next_chapter_success) {
                console.log("Successfully fetched next chapter");
    
            }
            else {
                console.log("Next Chapter error");
                console.log("API ERROR: ", api_error)
            }
        }
    }

    return (
        <Card shadow="sm" padding="md" radius="md" withBorder style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Scrollable Text Area */}
        <Textarea
            value={best_res}
            readOnly
            style={{ width: '100%', height: '100%' }}
            styles={{
            input: {
                fontSize: '18px',
                height: '79vh', // im not sure why this works, but it fits the space i need it to
            },
            }}
        />

        {/* View Button */}
        <Group justify="flex-end">
            <Button size="sm" variant="light" color="teal" onClick={() => handle_continue()}>
            Continue
            </Button>
        </Group>
        </Card>
    );
}

export default BEST_RESPONSE;
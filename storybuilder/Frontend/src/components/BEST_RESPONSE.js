import { Card, Textarea, Button, Group, Loader } from '@mantine/core';
import { useState, useContext, useEffect } from 'react';
import STORY_CONTEXT from "../context/STORY_CONTEXT";

function BEST_RESPONSE() {
    const { state, fetch_first_chapter, fetch_next_chapter, api_error } = useContext(STORY_CONTEXT);
    const [best_res, set_best_res] = useState("Waiting for the agents to choose the best response...");
    const [show_cont_button, set_show_cont_button] = useState(true);
    const [loading, setIsLoading] = useState(false);

    useEffect(() => {
        if (state.current_story) {
            set_best_res(state.current_story.chapters[state.current_story.chapters.length - 1]);
            if (state.current_story.chapters.length > state.current_story.chapter_count) {
                set_show_cont_button(false);
            }
        }
    }, [state.current_story]);

    const handle_continue = async () => {
        setIsLoading(true); // Show loading spinner

        if (state.current_story.chapters.length === 1) {
            const first_chapter_success = await fetch_first_chapter(
                state.current_story.title,
                state.current_story.story_details,
                state.current_story.extra_details,
                state.current_story.chapters[0]
            );
            if (!first_chapter_success) {
                console.log("First Chapter error");
                console.log("API ERROR: ", api_error);
            }
        } else {
            const next_chapter_success = await fetch_next_chapter(
                state.current_story.title,
                state.current_story.story_details,
                state.current_story.extra_details,
                state.current_story.chapters.slice(1),
                state.current_story.chapters[0]
            );
            if (!next_chapter_success) {
                console.log("Next Chapter error");
                console.log("API ERROR: ", api_error);
            }
        }

        setIsLoading(false); // Hide spinner once done
    };

    return (
        <Card shadow="sm" padding="md" radius="md" withBorder style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Textarea
                value={best_res}
                readOnly
                style={{ flexGrow: 1 }}
                styles={{
                    input: {
                        fontSize: '18px',
                        height: '79vh',
                    },
                }}
            />

            <Group justify="flex-end" style={{ marginTop: '10px' }}>
              {show_cont_button && (
                <Button
                  size="sm"
                  variant="light"
                  color={!loading ? "teal" : undefined} // green-ish before loading
                  disabled={loading}
                  onClick={handle_continue}
                  leftSection={loading && <Loader size="xs" color="green" />}
                  style={{
                    backgroundColor: loading ? 'rgba(0, 255, 128, 0.1)' : '',
                    color: loading ? '#66ffb2' : '',
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? "Drafting Chapter" : "Continue"}
                </Button>
              )}
            </Group>
        </Card>
    );
}

export default BEST_RESPONSE;
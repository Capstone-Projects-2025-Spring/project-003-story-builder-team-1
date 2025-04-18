import { Card, Button, Group, Loader } from '@mantine/core';
import { useState, useContext, useEffect } from 'react';
import STORY_CONTEXT from "../context/STORY_CONTEXT";
import ReactMarkdown from 'react-markdown';

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
        setIsLoading(true);

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

        setIsLoading(false);
    };

    return (
        <Card
            shadow="none"
            p="md"
            radius="md"
            style={{
                backgroundColor: '#242424',
                border: '1px solid #3a3a3a', // thin outline around the entire box
                maxWidth: 800,
                margin: '0 auto'
            }}
        >
            <div
                style={{
                    backgroundColor: '#2d2d2d',
                    borderRadius: '8px',
                    padding: '16px',
                    border: '1px solid #3a3a3a', // inner thin border for content
                    color: 'white',
                    fontSize: '16px',
                    lineHeight: '1.6'
                }}
            >
                <ReactMarkdown>{best_res}</ReactMarkdown>
            </div>

            <Group justify="flex-end" style={{ marginTop: '10px' }}>
            {show_cont_button && (
            <Button
                size="sm"
                variant="light"
                color={!loading ? "teal" : undefined}
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
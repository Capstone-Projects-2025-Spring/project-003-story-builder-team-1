import { Card, Textarea, Button, Group, Loader } from '@mantine/core';
import { useState, useContext, useEffect } from 'react';
import STORY_CONTEXT from "../context/STORY_CONTEXT";
import { useParams } from 'react-router';
import { USE_USER } from "../context/USER_CONTEXT";
import ReactMarkdown from 'react-markdown';

function BEST_RESPONSE() {
    const { state, fetch_first_chapter, fetch_next_chapter, api_error } = useContext(STORY_CONTEXT);
    const [best_res, set_best_res] = useState("Waiting for the agents to choose the best response...");
    const [show_cont_button, set_show_cont_button] = useState(true);
    const [loading, setIsLoading] = useState(false);
    const { story_id } = useParams();
    const { user_stories } = USE_USER();
    const [current_story, set_current_story] = useState(null);

    useEffect(() => {
        if (story_id && user_stories?.stories?.length) {
            const found_story = user_stories.stories.find(
                (story) => story._id === story_id
            );
            if (found_story) {
                set_current_story(found_story);
                const last_chapter = found_story.story_content?.at(-1);
                if (last_chapter?.text) {
                    set_best_res(last_chapter.text);
                }
            }
        }
    }, [story_id, user_stories]);

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
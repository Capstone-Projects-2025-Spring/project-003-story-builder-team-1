import { Card, Textarea, Button, Group, Loader } from '@mantine/core';
import { useState, useContext, useEffect } from 'react';
import STORY_CONTEXT from "../context/STORY_CONTEXT";
import { useParams } from 'react-router';
import { USE_USER } from "../context/USER_CONTEXT";

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
            const curr_story = user_stories.stories.find(story => story._id === story_id);
            if (curr_story) {
                set_current_story(curr_story);
                const chapters = curr_story.story_content || [];
                set_best_res(chapters[chapters.length - 1]);
                set_show_cont_button(chapters.length <= (curr_story.chapter_count ?? Infinity));
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
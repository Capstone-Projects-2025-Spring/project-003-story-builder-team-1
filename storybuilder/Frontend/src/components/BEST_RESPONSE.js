import { Card, Button, Group, Loader, Container } from '@mantine/core';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { USE_USER } from "../context/USER_CONTEXT";
import { USE_STORY } from '../context/STORY_CONTEXT';
import { USE_AUTH } from '../context/AUTH_CONTEXT';
import USE_AXIOS from '../hooks/USE_AXIOS';
import ReactMarkdown from 'react-markdown';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:8080";

function BEST_RESPONSE() {
    const {
        should_stream,
        set_should_stream,
        start_event_stream,
        streaming_action,
        set_streaming_action,
        isStreaming,
        curr_step,
        set_curr_step,
        disable_continue,
        set_disable_continue,
    } = USE_STORY();

    const { use_axios } = USE_AXIOS();
    const [best_res, set_best_res] = useState('');
    const [show_cont_button, set_show_cont_button] = useState(true);
    const [chapter_number, set_chapter_number] = useState(0);


    const { story_id } = useParams();
    const { user_stories, fetch_user_data } = USE_USER();
    const { user } = USE_AUTH();

    // Populate best response from latest chapter
    useEffect(() => {
        if (story_id && user_stories?.stories?.length) {
            const found_story = user_stories.stories.find(
                (story) => story._id === story_id
            );
            if (found_story) {
                set_curr_step(found_story.story_step);
                const last_chapter = found_story.story_content?.at(-1);
                const found_story_len = found_story.story_content?.length || 0;
                if (last_chapter?.text) {
                    set_best_res(last_chapter.text);
                    set_chapter_number(found_story_len + 1);
                }
            }
        }
    }, [story_id, user_stories]);

    useEffect(() => {
        if (best_res) {
            set_should_stream(false);
            set_streaming_action(null);
        }
    }, [best_res]);

    const handle_continue = async () => {
        if (should_stream) return;

        const found_story = user_stories?.stories?.find((story) => story._id === story_id);
        const story_content = found_story?.story_content || [];
        const chapter_count = story_content.length;

        const step = chapter_count === 1 ? "generate_first_chapter" : "generate_next_chapter";

        // db call to update the story step to rewrite
        const { data: update_story_step_data, error: update_story_step_error } = await use_axios(SERVER_URL + `/db/story/${user}/${story_id}/update_story_step`, "POST", {step: "generate"});

        if (update_story_step_data) {
          await fetch_user_data(user);
        } else {
            console.error("Error updating story step:", update_story_step_error);
        }

        set_streaming_action("continue");
        set_curr_step("continue");
        set_disable_continue(true);
        set_should_stream(true);
        set_best_res('');
        start_event_stream(user, story_id, step, chapter_count);
    };

    const buttonsDisabled = should_stream;

    return (

        <Card
            shadow="none"
            p="md"
            radius="md"
            style={{
                backgroundColor: '#242424',
                border: '1px solid #3a3a3a',
                margin: '0 auto',
                height: '100%',
                maxHeight: '90vh',
            }}
        >
            <div
                style={{
                    backgroundColor: '#2d2d2d',
                    borderRadius: '8px',
                    padding: '16px',
                    border: '1px solid #3a3a3a',
                    color: 'white',
                    fontSize: '16px',
                    lineHeight: '1.6',
                    overflowY: 'auto',
                    height: '100%',
                }}
            >
                <ReactMarkdown>
                    {best_res?.trim() ? best_res : "Waiting for agents to generate and vote on responses..."}
                </ReactMarkdown>
            </div>

            <Group justify="flex-end" style={{ marginTop: '10px' }}>
                <Button
                size="sm"
                variant="light"
                color={!should_stream ? 'teal' : undefined}
                disabled={disable_continue}
                onClick={handle_continue}
                leftSection={ should_stream && <Loader size="xs" color="green" />}
                style={{
                backgroundColor: should_stream ? 'rgba(0, 255, 128, 0.1)' : '',
                color: should_stream ? '#66ffb2' : '',
                cursor: should_stream ? 'not-allowed' : 'pointer',
                }}
            >
                { should_stream ? 'Drafting' : 'Continue'}
            </Button>
            </Group>
        </Card>

    );
}

export default BEST_RESPONSE;

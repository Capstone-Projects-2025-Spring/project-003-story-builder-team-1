import { Card, Button, Group, Loader, Container, Paper, Text } from '@mantine/core';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { USE_USER } from "../context/USER_CONTEXT";
import { USE_STORY } from '../context/STORY_CONTEXT';
import { USE_AUTH } from '../context/AUTH_CONTEXT';
import ReactMarkdown from 'react-markdown';

function BEST_RESPONSE() {
    const {
        should_stream,
        set_should_stream,
        start_event_stream,
        set_streaming_action,
        streamingAction,
        isStreaming,
        curr_step,
        set_curr_step
    } = USE_STORY();
    
    const [best_res, set_best_res] = useState('');
    const [show_cont_button, set_show_cont_button] = useState(true);
    const [chapter_number, set_chapter_number] = useState(0);
    const [justStreamed, setJustStreamed] = useState(false);

    const { story_id } = useParams();
    const { user_stories, refetch_user_stories } = USE_USER();
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

    // Reset flags after streaming action is finished
    useEffect(() => {
        if (!isStreaming && justStreamed) {
            // Once streaming ends, reset states to allow button interactions
            set_streaming_action(null);  // Reset streaming action
            set_should_stream(false);  // Reset stream flag
            setJustStreamed(false);  // Reset just streamed state
        }
    }, [isStreaming, justStreamed, set_streaming_action, set_should_stream]);

    useEffect(() => {
        if (best_res && justStreamed) {
            set_should_stream(false);
            set_streaming_action(null);
            setJustStreamed(false);
        }
    }, [best_res]);

    const handle_continue = () => {
        if (should_stream || justStreamed) return;

        const found_story = user_stories?.stories?.find((story) => story._id === story_id);
        const story_content = found_story?.story_content || [];
        const chapter_count = story_content.length;

        const step = chapter_count === 1 ? "generate_first_chapter" : "generate_next_chapter";

        setJustStreamed(true);
        set_streaming_action("continue");
        set_should_stream(true);
        set_best_res('');
        start_event_stream(user, story_id, step, chapter_count);
    };

    const buttonsDisabled = should_stream || justStreamed;

    return (
        <Container fluid style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* dont need this becuase i am skipping the other parts and just moving to next chapter */}
        {/* <Paper withBorder p="md" radius="md" mb="md">
            <Text size="lg" style={{ fontWeight: 'bold' }}>
            <strong>Current Phase: {curr_step.toUpperCase()}</strong>
            </Text>
        </Paper> */}

        <Card
            shadow="none"
            p="md"
            radius="md"
            style={{
                backgroundColor: '#242424',
                border: '1px solid #3a3a3a',
                margin: '0 auto',
                height: '100%',
                maxHeight: '80vh',
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
                {show_cont_button && (
                    <Button
                        size="sm"
                        variant="light"
                        color={should_stream ? (streamingAction === 'continue' ? 'teal' : 'gray') : 'teal'}
                        disabled={buttonsDisabled}
                        onClick={handle_continue}
                        leftSection={should_stream && streamingAction === 'continue' ? <Loader size="xs" color="green" /> : null}
                        style={{
                            backgroundColor: should_stream && streamingAction === 'continue' ? 'rgba(0, 255, 128, 0.1)' : '',
                            color: should_stream && streamingAction === 'continue' ? '#66ffb2' : '',
                            cursor: buttonsDisabled ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {should_stream && streamingAction === 'continue' ? 'Drafting Chapter' : 'Continue'}
                    </Button>
                )}
            </Group>
        </Card>
        </Container>
    );
}

export default BEST_RESPONSE;

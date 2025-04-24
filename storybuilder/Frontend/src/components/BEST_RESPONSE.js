import { Card, Button, Group, Loader } from '@mantine/core';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { USE_USER } from "../context/USER_CONTEXT";
import { USE_STORY } from '../context/STORY_CONTEXT';
import { USE_AUTH } from '../context/AUTH_CONTEXT';
import ReactMarkdown from 'react-markdown';

function BEST_RESPONSE() {
    const { should_stream, set_should_stream, start_event_stream, setStreamingAction, streamingAction } = USE_STORY();
    const [best_res, set_best_res] = useState('');
    const [show_cont_button, set_show_cont_button] = useState(true);
    const { story_id } = useParams();
    const { user_stories } = USE_USER();
    const { user } = USE_AUTH();
    const [chapter_number, set_chapter_number] = useState(0);

    useEffect(() => {
        if (story_id && user_stories?.stories?.length) {
            const found_story = user_stories.stories.find(
                (story) => story._id === story_id
            );
            if (found_story) {
                const last_chapter = found_story.story_content?.at(-1);
                const found_story_len = found_story.story_content?.length || 0;
                if (last_chapter?.text) {
                    set_best_res(last_chapter.text);
                    set_chapter_number(found_story_len + 1);
                }
            }
        }
    }, [story_id, user_stories]);

    const handle_continue = async () => {
        setStreamingAction('continue');
        set_should_stream(true); // Show loading spinner
        set_best_res('');
        start_event_stream(user, story_id, "generate_next_chapter", chapter_number);
    };

    const handle_regenerate = async () => {
        setStreamingAction('regenerate');
        set_should_stream(true);
        set_best_res('');
        start_event_stream(user, story_id, "rewrite_chapter", chapter_number);
    };

    return (
        <Card
            shadow="none"
            p="md"
            radius="md"
            style={{
                backgroundColor: '#242424',
                border: '1px solid #3a3a3a', // thin outline around the entire box
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
                    border: '1px solid #3a3a3a', // inner thin border for content
                    color: 'white',
                    fontSize: '16px',
                    lineHeight: '1.6',
                    overflowY: 'auto',
                    height: '100%',
                }}
            >
                <ReactMarkdown>{best_res?.trim() ? best_res : "Waiting for agents to generate and vote on responses..."}</ReactMarkdown>
            </div>

            <Group justify="flex-end" style={{ marginTop: '10px' }}>
                {show_cont_button && (
                    <>
                    {/* Regenerate Button */}
                    <Button
                            size="sm"
                            variant="light"
                            color={
                                should_stream
                                    ? streamingAction === 'regenerate'
                                        ? 'grape'
                                        : 'gray'
                                    : 'grape'
                            }
                            disabled={should_stream}
                            onClick={handle_regenerate}
                            leftSection={
                                should_stream && streamingAction === 'regenerate' ? (
                                    <Loader size="xs" color="grape" />
                                ) : null
                            }
                            style={{
                                backgroundColor:
                                    should_stream && streamingAction === 'regenerate'
                                        ? 'rgba(128, 0, 255, 0.1)'  // Same purple shade
                                        : '',
                                color:
                                    should_stream && streamingAction === 'regenerate'
                                        ? '#cc99ff'  // Matching purple color
                                        : '',
                                cursor: should_stream ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {should_stream && streamingAction === 'regenerate'
                                ? 'Regenerating...'
                                : 'Regenerate'}
                    </Button>

                    {/* Continue Button */}
                    <Button
                        size="sm"
                        variant="light"
                        color={
                        should_stream
                            ? streamingAction === 'continue'
                            ? 'teal'
                            : 'gray'
                            : 'teal'
                        }
                        disabled={should_stream}
                        onClick={handle_continue}
                        leftSection={
                        should_stream && streamingAction === 'continue' ? (
                            <Loader size="xs" color="green" />
                        ) : null
                        }
                        style={{
                        backgroundColor:
                            should_stream && streamingAction === 'continue'
                            ? 'rgba(0, 255, 128, 0.1)'
                            : '',
                        color:
                            should_stream && streamingAction === 'continue'
                            ? '#66ffb2'
                            : '',
                        cursor: should_stream ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {should_stream && streamingAction === 'continue'
                        ? 'Drafting Chapter'
                        : 'Continue'}
                    </Button>
                    </>
                )}
                </Group>
        </Card>
    );
}

export default BEST_RESPONSE;
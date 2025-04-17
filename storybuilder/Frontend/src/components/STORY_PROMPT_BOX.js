import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { TextInput, Paper, Button, Textarea, Stack, Loader } from "@mantine/core";
import STORY_CONTEXT from "../context/STORY_CONTEXT";

function STORY_PROMPT_BOX() {
    const navigate = useNavigate();
    const { submit_story_prompt, story_name_error, chapter_count_error, story_details_error, api_error } = useContext(STORY_CONTEXT);

    const [story_name, set_story_name] = useState("");
    const [chapter_count, set_chapter_count] = useState("");
    const [story_details, set_story_details] = useState("");
    const [extra_details, set_extra_details] = useState("");
    const [loading, setLoading] = useState(false);

    const handle_submit = async () => {
        setLoading(true); // Disable and change text immediately
        const submit_success = await submit_story_prompt(story_name, chapter_count, story_details, extra_details);
        console.log("submit_success: ", submit_success);

        if (submit_success) {
            console.log("Story Successfully Submitted");
            navigate(`/story/1/best_response`);
        } else {
            console.log("Story NOT submitted");
            console.log("API ERROR: ", api_error);
            setLoading(false); // Re-enable if error happens
        }
    };

    return (
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <Stack spacing="xl">
                <TextInput
                    label="Story Title"
                    placeholder="Ex. The Bible" required
                    value={story_name}
                    onChange={(e) => set_story_name(e.target.value)}
                    error={story_name_error || api_error}
                />
                <TextInput
                    label="Number of Chapters"
                    placeholder="Ex. 1, 2, 3 ..."
                    required
                    type="text" // Change to text to handle validation manually
                    value={chapter_count}
                    onChange={(e) => {
                        const value = e.target.value;
                        
                        // Check if the value is empty or contains only digits (no "e")
                        if (value === '' || /^[0-9]+$/.test(value)) {
                            set_chapter_count(value);
                        }
                    }}
                    error={chapter_count_error || api_error}
                />
                <Textarea
                    label="Story Prompt"
                    placeholder="Enter Prompt Here" required
                    autosize
                    value={story_details}
                    onChange={(e) => set_story_details(e.target.value)}
                    minRows={2}
                    maxRows={5}
                    style={{ flexGrow: 1 }}
                    error={story_details_error || api_error}
                />
                <Textarea
                    label="Additional Information"
                    placeholder="Anything you want to add?"
                    autosize
                    value={extra_details}
                    onChange={(e) => set_extra_details(e.target.value)}
                    minRows={2}
                    maxRows={5}
                    style={{ flexGrow: 1 }}
                />
                <Button
                    fullWidth
                    mt="md"
                    onClick={handle_submit}
                    disabled={loading}
                    styles={{
                        root: {
                            backgroundColor: loading ? '#5c677d' : '', // greyish blue when loading
                            cursor: loading ? 'not-allowed' : 'pointer',
                        },
                    }}
                >
                    {loading ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <Loader color="white" size="xs" />
                            <span style={{ color: 'white' }}>Generating Story Outline</span>
                        </div>
                    ) : (
                        "Send Prompt"
                    )}
                </Button>
            </Stack>
        </Paper>
    );
}

export default STORY_PROMPT_BOX;

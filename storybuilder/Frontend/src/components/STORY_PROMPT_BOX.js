import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { TextInput, Paper, Button, Textarea, Stack, Loader } from "@mantine/core";
import STORY_CONTEXT from "../context/STORY_CONTEXT";
import { USE_USER } from "../context/USER_CONTEXT";
import { USE_AUTH } from '../context/AUTH_CONTEXT';

function STORY_PROMPT_BOX() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = USE_AUTH();
    const { fetch_user_data } = USE_USER();
    const { story_id, submit_story_prompt, generate_outline, story_name_error, story_details_error, api_error } = useContext(STORY_CONTEXT);
    const [story_name, set_story_name] = useState("");
    const [story_details, set_story_details] = useState("");
    const [extra_details, set_extra_details] = useState("");
    const [loading, setLoading] = useState(false);
    const selected_agents = location.state?.selected_agents || [];
    const [submit_success, set_submit_success] = useState(false);

    // useEffect watches for story_id to change after a successful submit
    useEffect(() => {
        if (submit_success && story_id) {
            navigate(`/story/${story_id}/agents`);
            generate_outline(story_id).then((success) => {
                if (success) {
                    console.log("Outline generated");
                } else {
                    console.log("Outline Generation Failed");
                    console.log("API ERROR: ", api_error);
                }
            });
        }
    }, [submit_success, story_id]);

    const handle_submit = async () => {
        setLoading(true); // Disable and change text immediately
        // submit prompt to create story
        const submit_success = await submit_story_prompt(story_name, story_details, extra_details, selected_agents);
        console.log("submit_success: ", submit_success);

        // if story is successfully created, fetch user data for stories, and navigate to current story agent page
        if (submit_success) {
            console.log("Story Successfully Submitted");
            await fetch_user_data(user); // Fetch user data again to update the context
            set_submit_success(true); // Set success to true to trigger useEffect
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
                    placeholder="Ex. Romeo & Juliet" required
                    value={story_name}
                    onChange={(e) => set_story_name(e.target.value)}
                    error={story_name_error || api_error}
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

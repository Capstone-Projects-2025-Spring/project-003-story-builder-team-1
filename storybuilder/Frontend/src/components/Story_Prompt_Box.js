import React from 'react';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { TextInput, Paper, Button, Textarea, Stack } from "@mantine/core";
import STORY_CONTEXT from "../context/STORY_CONTEXT";

function STORY_PROMPT_BOX() {
    const navigate = useNavigate();
    const { submit_story_prompt } = useContext(STORY_CONTEXT);
    const [story_name, set_story_name] = useState("");
    const [chapter_count, set_chapter_count] = useState("");
    const [story_details, set_story_details] = useState("");
    const [extra_details, set_extra_details] = useState("");

    const handle_submit = () => {
        submit_story_prompt(story_name, chapter_count, story_details, extra_details);

        // hardcoded for 1 story for now
        navigate(`/story/1/agents`);
    };
    return (
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <Stack spacing="xl">
                {/* Story Title Input */}
                <TextInput
                    label="Story Title"
                    placeholder="Ex. The Bible" required
                    value={story_name}
                    onChange={(e) => set_story_name(e.target.value)}
                />
                {/* # of Chapter Input */}
                <TextInput
                    label="Number of Chapters"
                    placeholder="Ex. 1, 2, 3 ..." required
                    type="number"
                    value={chapter_count}
                    onChange={(e) => {
                        const intValue = parseInt(e.target.value, 10);
                        if (!isNaN(intValue)) set_chapter_count(intValue);
                    }}
                />
                {/* Prompt Input */}
                <Textarea
                    label="Story Prompt"
                    placeholder="Enter Prompt Here" required
                    autosize
                    value={story_details}
                    onChange={(e) => set_story_details(e.target.value)}
                    minRows={2}
                    maxRows={5}
                    style={{ flexGrow: 1 }}
                />
                {/* Additional Info */}
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
                {/* Send Prompt Button */}
                <Button fullWidth mt="md" onClick={handle_submit}>
                Send Prompt
                </Button>
            </Stack>
        </Paper>
    );
}

export default STORY_PROMPT_BOX
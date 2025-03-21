import React from 'react';
import { TextInput, Paper, Button, Textarea, Stack } from "@mantine/core";
import STORY_CONTEXT from "../context/STORY_CONTEXT";

function STORY_PROMPT_BOX() {
    const { submit_story_prompt } = useContext(STORY_CONTEXT);
    const [title, set_title] = useState("");
    const [num_chapters, set_num_chapters] = useState("");
    const [prompt, set_prompt] = useState("");
    const [additional_info, set_additional_info] = useState("");

    const handle_submit = () => {
        submit_story_prompt(title, num_chapters, prompt, additional_info);
    };
    return (
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <Stack spacing="xl">
                {/* Story Title Input */}
                <TextInput
                    label="Story Title"
                    placeholder="Ex. The Bible" required
                    value={title}
                    onChange={(e) => set_title(e.target.value)}
                />
                {/* # of Chapter Input */}
                <TextInput
                    label="Number of Chapters"
                    placeholder="Ex. 1, 2, 3 ..." required
                    type="number"
                    value={num_chapters}
                    onChange={(e) => {
                        const intValue = parseInt(e.target.value, 10);
                        if (!isNaN(intValue)) set_num_chapters(intValue);
                    }}
                />
                {/* Prompt Input */}
                <Textarea
                    label="Story Prompt"
                    placeholder="Enter Prompt Here" required
                    autosize
                    value={prompt}
                    onChange={(e) => set_prompt(e.target.value)}
                    minRows={2}
                    maxRows={5}
                    style={{ flexGrow: 1 }}
                />
                {/* Additional Info */}
                <Textarea
                    label="Additional Information"
                    placeholder="Anything you want to add?"
                    autosize
                    value={additional_info}
                    onChange={(e) => set_additional_info(e.target.value)}
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
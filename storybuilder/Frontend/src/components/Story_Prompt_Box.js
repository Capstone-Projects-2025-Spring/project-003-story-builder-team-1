import React from 'react';
import { TextInput, Paper, Button, Textarea, Stack } from "@mantine/core";

function Story_Prompt_Box() {
    return (
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <Stack spacing="xl">
                <TextInput
                    label="Number of Chapters"
                    placeholder="Ex. 1, 2, 3 ..." required
                />
                <Textarea
                    label="Story Prompt"
                    placeholder="Enter Prompt Here"
                    autosize
                    minRows={2}
                    maxRows={5}
                    style={{ flexGrow: 1 }}
                />
                <Textarea
                    label="Additional Information"
                    placeholder="Anything you want to add?"
                    autosize
                    minRows={2}
                    maxRows={5}
                    style={{ flexGrow: 1 }}
                />

                <Button fullWidth mt="md">
                Send Prompt
                </Button>
            </Stack>
        </Paper>
    );
}

export default Story_Prompt_Box
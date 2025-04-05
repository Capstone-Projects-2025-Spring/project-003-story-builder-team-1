import { Card, Textarea, Button, Group } from '@mantine/core';
import { useState, useContext, useEffect } from 'react';
import STORY_CONTEXT from "../context/STORY_CONTEXT";

function BEST_RESPONSE() {
    const { state } = useContext(STORY_CONTEXT);
    const [best_res, set_best_res] = useState("Waiting for the agents to choose the best response...");

    return (
        <Card shadow="sm" padding="md" radius="md" withBorder style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Scrollable Text Area */}
        <Textarea
            value={best_res}
            readOnly
            style={{ width: '100%', height: '100%' }}
            styles={{
            input: {
                fontSize: '18px',
                height: '79vh', // im not sure why this works, but it fits the space i need it to
            },
            }}
        />

        {/* View Button */}
        <Group justify="flex-end">
            <Button size="sm" variant="light" color="teal">
            Continue
            </Button>
        </Group>
        </Card>
    );
}

export default BEST_RESPONSE;
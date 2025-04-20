import { Card, Title, Modal, Group, Divider, Button } from '@mantine/core';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

function AGENT_THOUGHTS({ name, chapter_thoughts }) {
    const [opened, set_opened] = useState(false);
    return (
        <>
        {/* View Modal */}
        <Modal
            opened={opened}
            onClose={() => set_opened(false)}
            size="50%"
            radius="md"
            padding="md"
            title={
            <Title component="div" order={3}>
                Thoughts:
            </Title>
            }
        >
            <div style={{ flex: 1, display: 'flex', padding: '12px' }}>
            <div
                style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                backgroundColor: '#2d2d2d',
                color: '#fff',
                borderRadius: '8px',
                marginBottom: '20px',
                }}
            >
                <ReactMarkdown
                children={
                    chapter_thoughts?.trim()
                    ? chapter_thoughts
                    : "Waiting for the agent to generate a response..."
                }
                components={{
                    p: ({ node, ...props }) => (
                    <p style={{ fontSize: '18px', marginBottom: '1em' }} {...props} />
                    ),
                }}
                />
            </div>
            </div>
        </Modal>

        {/* Agent Thoughts Card */}
        <Card shadow="sm" padding="md" radius="md" withBorder style={{ backgroundColor: '#242424' }}>
            <div style={{ padding: '10px' }}>
            <Group gap="xs" align="center">
                <Title order={4} style={{ color: 'white', margin: 0 }}>
                    Thoughts:
                </Title>
            </Group>
            </div>

            <Divider my="sm" mt={1} />

            <div
            style={{
                backgroundColor: '#2d2d2d',
                borderRadius: '8px',
                padding: '16px',
                color: '#fff',
                maxHeight: '150px',
                overflowY: 'auto',
            }}
            >
            <ReactMarkdown
                children={
                chapter_thoughts?.trim()
                    ? chapter_thoughts
                    : "Waiting for the agent to generate a response..."
                }
                components={{
                p: ({ node, ...props }) => (
                    <p style={{ fontSize: '16px', marginBottom: '0.75em' }} {...props} />
                ),
                }}
            />
            </div>

            <Group justify="space-between" style={{ marginTop: '10px' }}>
                <Button size="sm" variant="light" onClick={() => set_opened(true)}>
                    View
                </Button>
            </Group>
        </Card>
        </>
    );
}

export default AGENT_THOUGHTS;
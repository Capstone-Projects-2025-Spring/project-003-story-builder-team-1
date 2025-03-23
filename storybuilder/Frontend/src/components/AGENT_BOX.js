import { useState, useContext } from 'react';
import { Card, Button, Modal, Textarea, Title, Divider, Group } from '@mantine/core';
import STORY_CONTEXT from "../context/STORY_CONTEXT";

function AGENT_BOX({ name, response }) {
    const { latest_chapter } = useContext(STORY_CONTEXT);
    const [opened, set_opened] = useState(false);

    const title = latest_chapter?.title || "Chapter Title";
    const chapter_content = latest_chapter?.content || "Waiting for the agent to generate a response...";

    return (
        <>
          {/* Modal for Viewing Full Response */}
          <Modal
            opened={opened}
            onClose={() => set_opened(false)}
            size="50%"
            radius="md"
            style={{ minHeight: '50%' }}
            title={
                <Title order={2} style={{ fontSize: '24px', fontWeight: 600, textAlign: 'center', marginLeft: '15px' }}>
                  {title}
                </Title>
            }
          >
            {/* Scrollable Text Area */}
            <Textarea
              value={chapter_content}
              readOnly
              autosize
              minRows={10}
              maxRows={10}
              styles={{
                input: {
                  fontSize: '18px' // 18px = 1.125rem = mantine size "lg"
                },
              }}
              style={{ width: '100%' }}
            />
            </Modal>

            {/* Agent Box */}
          <Card shadow="sm" padding="md" radius="md" withBorder>
            {/* Header */}
            <div style={{ padding: '10px', borderRadius: '5px 5px 0 0' }}>
              <Title order={4} style={{ color: 'white', margin: 0 }}>{name}</Title>
            </div>
    
            {/* Divider Line */}
            <Divider my="sm" />
    
            {/* Scrollable Text Area */}
            <Textarea
              value={chapter_content}
              readOnly
              autosize
              minRows={3}
              maxRows={5}
              style={{ width: '100%' }}
              styles={{
                input: {
                  fontSize: '18px'
                },
              }}
            />
    
            {/* View Button */}
            <Group position="left" style={{ marginTop: '10px' }}>
              <Button size="sm" variant="light" onClick={() => set_opened(true)}>
                View
              </Button>
            </Group>
          </Card>
        </>
      );
}

export default AGENT_BOX;
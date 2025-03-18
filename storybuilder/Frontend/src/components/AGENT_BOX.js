import { useState } from 'react';
import { Card, Button, Modal, Textarea, Title, Divider, Group, Container, Center } from '@mantine/core';

function AGENT_BOX({ name, response }) {
    const [opened, setOpened] = useState(false);

    return (
        <>
          {/* Modal for Viewing Full Response */}
          <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            size="xl"
            radius="md"
            title={
                <Title order={2} style={{ fontSize: '24px', fontWeight: 600, textAlign: 'center' }}>
                  {name}
                </Title>
            }
          >
            {/* Scrollable Text Area */}
            <Textarea
              value={response}
              readOnly
              autosize
              minRows={5}
              maxRows={10}
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
              value={response}
              readOnly
              autosize
              minRows={3}  // Adjust number of rows to show before scrolling
              maxRows={5}  // Adjust the number of rows before scrolling starts
              style={{ width: '100%' }}
            />
    
            {/* View Button - Smaller & Bottom Right */}
            <Group position="left" style={{ marginTop: '10px' }}>
              <Button size="xs" variant="light" onClick={() => setOpened(true)}>
                View
              </Button>
            </Group>
          </Card>
        </>
      );
}

export default AGENT_BOX;
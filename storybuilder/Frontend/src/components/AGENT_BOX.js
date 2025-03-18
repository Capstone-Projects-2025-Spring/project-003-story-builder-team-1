import { useState } from 'react';
import { Card, Button, Modal, Textarea, Title, Divider, Group } from '@mantine/core';

function AGENT_BOX({ name, response }) {
    const [opened, set_opened] = useState(false);

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
                  {name}
                </Title>
            }
          >
            {/* Scrollable Text Area */}
            <Textarea
              value={response}
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
              value={response}
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
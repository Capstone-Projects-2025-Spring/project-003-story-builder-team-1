import { useState, useContext, useEffect } from 'react';
import { Card, Button, Modal, Textarea, Title, Divider, Group } from '@mantine/core';
import STORY_CONTEXT from "../context/STORY_CONTEXT";

function AGENT_BOX({ name, response }) {
    const { state } = useContext(STORY_CONTEXT);
    const [title, set_title] = useState("Chapter Title");
    //const [chapter_content, set_chapter_content] = useState("Waiting for the agent to generate a response...");
    const [opened, set_opened] = useState(false);
    const [chapter_content, set_chapter_content] = useState("Waiting for the agent to generate a response...");

    console.log("AGENT_BOX 1: state.current_story", state.current_story);

    useEffect(() => {
      if (state.current_story?.chapters?.length > 0) {
          set_chapter_content(state.current_story.chapters[0]); // Display first chapter
      }
      console.log("AGENT_BOX 2: state.current_story", state.current_story);
    }, [state.current_story]);

    console.log("AGENT_BOX 3: state.current_story", state.current_story);

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
                <Title order={1} style={{ fontSize: '24px', fontWeight: 600, textAlign: 'center', marginLeft: '15px' }}>
                  {name}
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
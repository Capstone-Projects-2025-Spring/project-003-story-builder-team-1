import { useState, useContext, useEffect } from 'react';
import { Card, Button, Modal, Textarea, Title, Divider, Group, Loader } from '@mantine/core';
import STORY_CONTEXT from "../context/STORY_CONTEXT";

function AGENT_BOX({ name }) {
    const { state, fetch_first_chapter, fetch_next_chapter, api_error } = useContext(STORY_CONTEXT);
    const [opened, set_opened] = useState(false);
    const [chapter_content, set_chapter_content] = useState("Waiting for the agent to generate a response...");
    const [show_cont_button, set_show_cont_button] = useState(true);
    const [loading, set_loading] = useState(false);

    useEffect(() => {
      if (state.current_story?.chapters?.length > 0) {
          set_chapter_content(state.current_story.chapters[state.current_story.chapters.length - 1]); // recent chapter
      }
      if (state.current_story.chapters.length > state.current_story.chapter_count) {
        set_show_cont_button(false);
      }
    }, [state.current_story]);

    const handle_continue = async () => {
      set_loading(true); // Start loading
      if (state.current_story.chapters.length === 1) {
        const first_chapter_success = await fetch_first_chapter(
          state.current_story.title,
          state.current_story.story_details,
          state.current_story.extra_details,
          state.current_story.chapters[0]
        );
        if (!first_chapter_success) {
          console.log("API ERROR: ", api_error);
        }
      } else {
        const next_chapter_success = await fetch_next_chapter(
          state.current_story.title,
          state.current_story.story_details,
          state.current_story.extra_details,
          state.current_story.chapters.slice(1),
          state.current_story.chapters[0]
        );
        if (!next_chapter_success) {
          console.log("API ERROR: ", api_error);
        }
      }
      set_loading(false); // Done loading
    };

    return (
        <>
          {/* Modal for Viewing Full Response */}
          <Modal
            opened={opened}
            onClose={() => set_opened(false)}
            size="50%" // width remains unchanged
            radius="md"
            styles={{
              content: {
                height: '90vh', // You can tweak this to get your desired vertical size
                display: 'flex',
                flexDirection: 'column',
              },
            }}
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
              <Group gap="xs" align="center">
                <Title order={4} style={{ color: 'white', margin: 0 }}>
                  {name}
                </Title>
              </Group>
            </div>
    
            {/* Divider Line */}
            <Divider my="sm" mt={1}/>
    
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
            <Group justify="space-between" style={{ marginTop: '10px' }}>
              <Button size="sm" variant="light" onClick={() => set_opened(true)}>
                View
              </Button>
              {show_cont_button && (
                <Button
                  size="sm"
                  variant="light"
                  color={!loading ? "teal" : undefined} // green-ish before loading
                  disabled={loading}
                  onClick={handle_continue}
                  leftSection={loading && <Loader size="xs" color="green" />}
                  style={{
                    backgroundColor: loading ? 'rgba(0, 255, 128, 0.1)' : '',
                    color: loading ? '#66ffb2' : '',
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? "Drafting Chapter" : "Continue"}
                </Button>
              )}
            </Group>
          </Card>
        </>
      );
}

export default AGENT_BOX;
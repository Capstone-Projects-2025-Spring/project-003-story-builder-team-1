import { useState, useContext, useEffect } from 'react';
import { Card, Button, Modal, Textarea, Title, Divider, Group, Loader } from '@mantine/core';
import STORY_CONTEXT from "../context/STORY_CONTEXT";
import { useParams } from 'react-router';
import { USE_USER } from '../context/USER_CONTEXT';

function AGENT_BOX({ name }) {
    const { state, fetch_first_chapter, fetch_next_chapter, api_error } = useContext(STORY_CONTEXT);
    const [opened, set_opened] = useState(false);
    const [chapter_content, set_chapter_content] = useState("Waiting for the agent to generate a response...");
    const [show_cont_button, set_show_cont_button] = useState(true);
    const [loading, set_loading] = useState(false);

    const { story_id } = useParams();
    const { user_stories } = USE_USER();

    useEffect(() => {
      if (!user_stories?.stories) return;
      
      const current_story = user_stories.stories.find(story => story._id === story_id);
      
      if (current_story) {
          // Use this story's agents and chapters
          set_chapter_content(current_story.story_content[current_story.story_content.length - 1]);  // Get most recent chapter
          
          // Check if we need to show the 'Continue' button
          if (current_story.story_content.length > current_story.chapter_count) {
              set_show_cont_button(false);
          }
      }
  }, [story_id, user_stories]);

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
            size="50%"
            radius="md"
            padding="md"
            styles={{
              content: {
                height: '90vh',
                display: 'flex',
                flexDirection: 'column',
              },
              body: {
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                padding: 0,
              },
            }}
            title={
              <Title
                order={1}
                style={{
                  fontSize: '24px',
                  fontWeight: 600,
                  textAlign: 'center',
                  marginLeft: '15px',
                }}
              >
                {name}
              </Title>
            }
          >
            <div style={{ flex: 1, display: 'flex' }}>

            {/* Scrollable Text Area */}
            <Textarea
              value={chapter_content}
              readOnly
              autosize={false}
              styles={{
                input: {
                  padding: "16px",
                  fontSize: '18px',
                  resize: 'none',
                  overflow: 'auto',
                  flex: 1,
                },
                root: {
                  flex: 1,
                  display: 'flex',
                },
                wrapper: {
                  flex: 1,
                  display: 'flex',
                },
              }}
              style={{
                flex: 1,
                width: '100%',
                padding: '16px'
              }}
            />
            </div>
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
                  color={!loading ? "teal" : undefined}
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
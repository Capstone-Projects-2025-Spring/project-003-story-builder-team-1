import { useState, useContext, useEffect } from 'react';
import { Card, Button, Modal, Textarea, Title, Divider, Group } from '@mantine/core';
import STORY_CONTEXT from "../context/STORY_CONTEXT";

function AGENT_BOX({ name }) {
    const { state, fetch_first_chapter, fetch_next_chapter, api_error } = useContext(STORY_CONTEXT);
    const [opened, set_opened] = useState(false);
    const [chapter_content, set_chapter_content] = useState("Waiting for the agent to generate a response...");
    const [show_cont_button, set_show_cont_button] = useState(true);

    useEffect(() => {
      if (state.current_story?.chapters?.length > 0) {
          set_chapter_content(state.current_story.chapters[state.current_story.chapters.length - 1]); // recent chapter
      }
      if (state.current_story.chapters.length > state.current_story.chapter_count + 1) {
        set_show_cont_button(false);
      }
    }, [state.current_story]);

    const handle_continue = async () => {
      // Handle continue button click
      console.log("Continue button clicked");

      // if chapters length is 1, only outline is available, so fetch first chapter
      if (state.current_story.chapters.length === 1) {
          const first_chapter_success = await fetch_first_chapter(state.current_story.title, state.current_story.story_details, state.current_story.extra_details, state.current_story.chapters[0]);
          if (first_chapter_success) {
              console.log("Successfully fetched first chapter");
          }
          else {
              console.log("First Chapter error");
              console.log("API ERROR: ", api_error)
          }
      }
      // chapters contains more than outline and 1st chapter, so fetch next chapter
      else {
          console.log("previous chapters: ", state.current_story.chapters.slice(1));
          const next_chapter_success = await fetch_next_chapter(state.current_story.title, state.current_story.story_details, state.current_story.extra_details, state.current_story.chapters.slice(1), state.current_story.chapters[0]);
          if (next_chapter_success) {
              console.log("Successfully fetched next chapter");

          }
          else {
              console.log("Next Chapter error");
              console.log("API ERROR: ", api_error)
          }
      }
    }

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
                    <Button size="sm" variant="light" color="teal" onClick={() => handle_continue()}>
                    Continue
                    </Button>
                )}
            </Group>
          </Card>
        </>
      );
}

export default AGENT_BOX;
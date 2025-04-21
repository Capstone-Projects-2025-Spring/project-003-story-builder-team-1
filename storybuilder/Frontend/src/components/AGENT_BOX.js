import { useState, useContext, useEffect, useRef } from 'react';
import { Card, Button, Modal, Textarea, Title, Divider, Group, Loader } from '@mantine/core';
import STORY_CONTEXT from "../context/STORY_CONTEXT";
import { useParams } from 'react-router';
import { USE_USER } from '../context/USER_CONTEXT';
import ReactMarkdown from 'react-markdown';
import { USE_AUTH } from '../context/AUTH_CONTEXT';
import { EventSource } from 'eventsource';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:8080";

function AGENT_BOX({ name, chapter_content }) {
    const { state, fetch_first_chapter, fetch_next_chapter, api_error } = useContext(STORY_CONTEXT);
    const [opened, set_opened] = useState(false);
    // const [chapter_content, set_chapter_content] = useState("Waiting for the agent to generate a response...");
    const [show_cont_button, set_show_cont_button] = useState(true);
    const [loading, set_loading] = useState(false);
    const [edit_modal_open, set_edit_modal_open] = useState(false);
    const [edited_content, set_edited_content] = useState('');

    const { story_id } = useParams();
    const { user_stories } = USE_USER();
    const { user } = USE_AUTH();


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
        {/* View Modal */}
        <Modal
          opened={opened}
          onClose={() => set_opened(false)}
          size="50%"
          radius="md"
          padding="md"
          title={
            <Title component="div" order={3}>
              {name}
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
                  chapter_content?.trim()
                    ? chapter_content
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
  
        {/* Edit Modal */}
        <Modal
          opened={edit_modal_open}
          onClose={() => set_edit_modal_open(false)}
          title={<Title component="div" order={3}>Edit Chapter</Title>}
          size="50%"
          radius="md"
          padding="md"
        >
          <textarea
            value={edited_content}
            onChange={(e) => set_edited_content(e.target.value)}
            style={{
              width: '100%',
              height: '500px',
              backgroundColor: '#2d2d2d',
              color: 'white',
              border: '1px solid #444',
              padding: '10px',
              borderRadius: '8px',
              fontSize: '16px',
              resize: 'vertical',
            }}
          />
          <Group justify="right" mt="md">
            <Button
              variant="light"
              color="teal"
              onClick={() => {
                //set_chapter_content(edited_content);
                set_edit_modal_open(false);
              }}
            >
              Save
            </Button>
          </Group>
        </Modal>
  
        {/* Agent Box Card */}
        <Card shadow="sm" padding="md" radius="md" withBorder style={{ backgroundColor: '#242424' }}>
          <div style={{ padding: '10px' }}>
            <Group gap="xs" align="center">
              <Title order={4} style={{ color: 'white', margin: 0 }}>
                {name}
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
                chapter_content?.trim()
                  ? chapter_content
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
  
            <div style={{ flex: 1, textAlign: 'center' }}>
              <Button
                size="sm"
                variant="light"
                color="orange"
                style={{
                  backgroundColor: 'rgba(255, 165, 0, 0.1)',
                  color: '#ffa500',
                  margin: '0 auto',
                }}
                onClick={() => {
                  set_edited_content(chapter_content);
                  set_edit_modal_open(true);
                }}
              >
                Edit
              </Button>
            </div>
  
            {show_cont_button && (
              <Button
                size="sm"
                variant="light"
                color={!loading ? 'teal' : undefined}
                disabled={loading}
                onClick={handle_continue}
                leftSection={loading && <Loader size="xs" color="green" />}
                style={{
                  backgroundColor: loading ? 'rgba(0, 255, 128, 0.1)' : '',
                  color: loading ? '#66ffb2' : '',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Drafting Chapter' : 'Continue'}
              </Button>
            )}
          </Group>
        </Card>
      </>
    );
  }

export default AGENT_BOX;
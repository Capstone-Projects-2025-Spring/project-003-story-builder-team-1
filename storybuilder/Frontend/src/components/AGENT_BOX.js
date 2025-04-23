import { useState, useEffect } from 'react';
import { Card, Button, Modal, Title, Divider, Group, Loader } from '@mantine/core';
import { USE_STORY } from '../context/STORY_CONTEXT';
import { useParams } from 'react-router';
import { USE_USER } from '../context/USER_CONTEXT';
import ReactMarkdown from 'react-markdown';
import { USE_AUTH } from '../context/AUTH_CONTEXT';

function AGENT_BOX({ name, chapter_content, start_event_stream }) {
    const { should_stream, set_should_stream } = USE_STORY();
    const [opened, set_opened] = useState(false);
    // const [chapter_content, set_chapter_content] = useState("Waiting for the agent to generate a response...");
    const [show_cont_button, set_show_cont_button] = useState(true);
    const [edit_modal_open, set_edit_modal_open] = useState(false);
    const [edited_content, set_edited_content] = useState('');
    const [step, set_step] = useState('');
    const [chapter_number, set_chapter_number] = useState(0);

    const { story_id } = useParams();
    const { user_stories } = USE_USER();
    const { user } = USE_AUTH();

    useEffect(() => {
      if (story_id && user_stories?.stories?.length) {
        const found_story = user_stories.stories.find(
            (story) => story._id === story_id
        );
        const found_story_len = found_story.story_content?.length || 0;
        if (found_story_len === 0) {
            set_step("generate_first_chapter");
            set_chapter_number(1);
        }
        else {
          set_step("generate_next_chapter");
          set_chapter_number(found_story_len + 1);
        }
      }
    }, [user_stories, story_id]);

    const handle_continue = async () => {
      set_should_stream(true); // Show loading spinner
      start_event_stream(user, story_id, step, chapter_number);
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
              resize: 'none',
            }}
          />
          <Group justify="right" mt="md">
            <Button
              variant="light"
              color="teal"
              onClick={() => {
                // set_chapter_content(edited_content); //  save logic
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
              disabled={should_stream}
              style={{
                backgroundColor: 'rgba(255, 165, 0, 0.1)',
                color: '#ffa500',
                margin: '0 auto',
                cursor: should_stream ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s ease-in-out',
              }}
              onMouseEnter={(e) => {
                if (!should_stream) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 165, 0, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 165, 0, 0.1)';
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
                color={!should_stream ? 'teal' : undefined}
                disabled={should_stream}
                onClick={handle_continue}
                leftSection={should_stream && <Loader size="xs" color="green" />}
                style={{
                  backgroundColor: should_stream ? 'rgba(0, 255, 128, 0.1)' : '',
                  color: should_stream ? '#66ffb2' : '',
                  cursor: should_stream ? 'not-allowed' : 'pointer',
                }}
              >
                {should_stream ? 'Drafting Chapter' : 'Continue'}
              </Button>
            )}
          </Group>
        </Card>
      </>
    );
  }

export default AGENT_BOX;
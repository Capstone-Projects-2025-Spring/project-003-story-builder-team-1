import { useState } from 'react';
import { Card, Button, Modal, Title, Divider, Group, Loader } from '@mantine/core';
import { USE_STORY } from '../context/STORY_CONTEXT';
import USE_AXIOS from '../hooks/USE_AXIOS';
import { USE_AUTH } from '../context/AUTH_CONTEXT';

import ReactMarkdown from 'react-markdown';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:8080";


function AGENT_BOX({ name, chapter_content, story_id, agent_id, chapter_number, onActionButtonClick }) {
  const { use_axios } = USE_AXIOS();
  const { should_stream, streaming_action, set_streaming_action, disable_regenerate, set_disable_regenerate, disable_continue, set_disable_continue, } = USE_STORY();

  const [opened, set_opened] = useState(false);
  const [edit_modal_open, set_edit_modal_open] = useState(false);
  const [edited_content, set_edited_content] = useState('');
  const [current_content, set_current_content] = useState(chapter_content);
  const [is_saving, set_is_saving] = useState(false);
  const { user } = USE_AUTH();

  const handle_continue = () => {
    set_streaming_action('continue');
    set_disable_regenerate(true);
    set_disable_continue(true);

    onActionButtonClick('continue');
  };

  const handle_regenerate = () => {
    set_streaming_action('regenerate');
    set_disable_regenerate(true);
    set_disable_continue(true);

    onActionButtonClick('regenerate');
  };

    // save edited chapter
    const handleSaveEditedChapter = async () => {
      set_is_saving(true);
  
      const url = `/api/story/${user}/${story_id}/${agent_id}/${chapter_number}/edit_agent_chapter`;
      const { data, error } = await use_axios(url, 'POST', {edited_content});
  
      if (error) {
        console.error('Error saving chapter:', error);
        set_is_saving(false);
        return;
      }
  
      set_current_content(edited_content);
      set_edit_modal_open(false);
      onActionButtonClick('saved', edited_content);
      set_is_saving(false);
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
        title={<Title order={3}>{name}</Title>}
      >
        <div style={{ padding: 12, backgroundColor: '#2d2d2d', color: '#fff', borderRadius: 8 }}>
          <ReactMarkdown
            children={current_content?.trim() || 'Waiting for the agent to generate a response...'}
            components={{
              p: (props) => <p style={{ fontSize: 18, marginBottom: '1em' }} {...props} />,
            }}
          />
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        opened={edit_modal_open}
        onClose={() => set_edit_modal_open(false)}
        title={<Title order={3}>Edit Chapter</Title>}
        size="50%"
        radius="md"
        padding="md"
      >
        <textarea
          value={edited_content}
          onChange={(e) => set_edited_content(e.target.value)}
          style={{
            width: '100%',
            height: 400,
            backgroundColor: '#2d2d2d',
            color: 'white',
            border: '1px solid #444',
            padding: 10,
            borderRadius: 8,
            fontSize: 16,
            resize: 'none',
          }}
        />
        <Group justify="right" mt="md">
          <Button
            variant="light"
            color="teal"
            onClick={handleSaveEditedChapter}
            disabled={is_saving}
            leftSection={is_saving && <Loader size="xs" />}
          >
            {is_saving ? 'Saving…' : 'Save'}
          </Button>
        </Group>
      </Modal>

      {/* Agent Box Card */}
      <Card shadow="sm" padding="md" radius="md" withBorder style={{ backgroundColor: '#242424' }}>
        <Group style={{ padding: 10 }}>
          <Title order={4} style={{ color: 'white' }}>{name}</Title>
        </Group>
        <Divider my="sm" mt={1} />
        <div style={{
          backgroundColor: '#2d2d2d',
          borderRadius: 8,
          padding: 16,
          color: '#fff',
          maxHeight: 150,
          overflowY: 'auto',
        }}>
          <ReactMarkdown
            children={current_content?.trim() || 'Waiting for the agent to generate a response...'}
            components={{
              p: (props) => <p style={{ fontSize: 16, marginBottom: '0.75em' }} {...props} />,
            }}
          />
        </div>
        <Group justify="space-between" style={{ marginTop: 10 }}>
          <Button size="sm" variant="light" onClick={() => set_opened(true)}>View</Button>
          <Button
            size="sm"
            variant="light"
            color="orange"
            onClick={() => {
              set_edited_content(current_content);
              set_edit_modal_open(true);
            }}
            style={{ backgroundColor: 'rgba(255,165,0,0.1)', color: '#ffa500' }}
          >
            Edit
          </Button>
          {/* your Regenerate & Continue buttons here */}

          {/* Regenerate Button */}
          <Button
            size="sm"
            variant="light"
            color={!(should_stream) ? 'grape' : undefined} // grape = purple
            disabled={disable_regenerate}
            onClick={handle_regenerate}
            leftSection={streaming_action === 'regenerate' && should_stream && <Loader size="xs" color="violet" />}
            style={{
              backgroundColor:
                streaming_action === 'regenerate' && should_stream ? 'rgba(128, 90, 213, 0.1)' : '',
              color:
                streaming_action === 'regenerate' && should_stream ? '#b794f4' : '',
              cursor: should_stream ? 'not-allowed' : 'pointer',
            }}
          >
            {streaming_action === 'regenerate' && should_stream ? 'Regenerating' : 'Regenerate'}
          </Button>

          {/* Continue Button */}
          <Button
            size="sm"
            variant="light"
            color={!should_stream ? 'teal' : undefined}
            disabled={disable_continue}
            onClick={handle_continue}
            leftSection={streaming_action === 'continue' && should_stream && <Loader size="xs" color="green" />}
            style={{
              backgroundColor: streaming_action === 'continue' && should_stream ? 'rgba(0, 255, 128, 0.1)' : '',
              color: streaming_action === 'continue' && should_stream ? '#66ffb2' : '',
              cursor: should_stream ? 'not-allowed' : 'pointer',
            }}
          >
            {streaming_action === 'continue' && should_stream ? 'Drafting' : 'Continue'}
          </Button>
        </Group>
      </Card>
    </>
  );
}


export default AGENT_BOX;

import { useState } from 'react';
import { Card, Button, Modal, Title, Divider, Group, Loader } from '@mantine/core';
import { useParams } from 'react-router';
import { USE_STORY } from '../context/STORY_CONTEXT';
import { USE_USER } from '../context/USER_CONTEXT';
import { USE_AUTH } from '../context/AUTH_CONTEXT';
import USE_AXIOS from '../hooks/USE_AXIOS';
import ReactMarkdown from 'react-markdown';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:8080";

function AGENT_BOX({ name, chapter_content, step, agent_id, chapter_number, onActionButtonClick }) {
  const { should_stream, streaming_action, set_streaming_action, disable_regenerate, set_disable_regenerate, disable_continue, set_disable_continue, disable_edit, set_disable_edit, curr_step, set_curr_step } = USE_STORY();
  const { story_id } = useParams();
  const { fetch_user_data } = USE_USER();
  const { user } = USE_AUTH();
  const { use_axios } = USE_AXIOS();
  const [opened, set_opened] = useState(false);
  const [edit_modal_open, set_edit_modal_open] = useState(false);
  const [edited_content, set_edited_content] = useState('');
  const [current_content, set_current_content] = useState(chapter_content);

  const handle_continue = () => {
    set_streaming_action('continue');
    set_disable_regenerate(true);
    set_disable_continue(true);
    set_disable_edit(true);

    onActionButtonClick('continue');
  };

  const handle_regenerate = () => {
    set_streaming_action('regenerate');
    set_disable_regenerate(true);
    set_disable_continue(true);
    set_disable_edit(true);

    onActionButtonClick('regenerate');
  };

  const handle_save_edit = async () => {
    console.log("user: ", user);
    console.log("story_id: ", story_id);
    console.log("agent_id: ", agent_id);
    console.log("chapter_number: ", chapter_number);
    if (curr_step === "critique") {
      // if we are on critique step, the chapter num has increased because it updates from story_content length. After generate it has incremented, but critique is still the same chapter
      let curr_chapter_num = chapter_number - 1;
      console.log("curr_chapter_num: ", curr_chapter_num);
      // db call to update with edited critique
      const { data: edit_critique_data, error: edit_critique_error } = await use_axios(SERVER_URL + `/db/story/${user}/${story_id}/${agent_id}/${curr_chapter_num}/edit_agent_critique`, 'POST', {critique: edited_content});

      if (edit_critique_data) {
        await fetch_user_data(user);
      } else {
        console.error("Error updating chapter edit:", edit_critique_error);
      }
    }
    else {
      // idk anymore i incrememnted it in story_agents_view for it to work, then i decrememnted back idk
      let curr_chapter_num = chapter_number - 1;
      console.log("curr_chapter_num: ", curr_chapter_num);
      // db call to update db with edited chapter
      const { data: edit_chapter_data, error: edit_chapter_error } = await use_axios(SERVER_URL + `/db/story/${user}/${story_id}/${agent_id}/${curr_chapter_num}/edit_agent_chapter`, 'POST', {content: edited_content});

      if (edit_chapter_data) {
        await fetch_user_data(user);
      } else {
        console.error("Error updating chapter edit:", edit_chapter_error);
      }
    }

    set_current_content(edited_content); // Update displayed content
    set_edit_modal_open(false); // Close modal
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
        title={<Title component="div" order={3}>{name}</Title>}
      >
        <div style={{ padding: '12px', backgroundColor: '#2d2d2d', color: '#fff', borderRadius: '8px' }}>
          <ReactMarkdown
            children={chapter_content?.trim() || "Waiting for the agent to generate a response..."}
            components={{
              p: ({ node, ...props }) => (
                <p style={{ fontSize: '18px', marginBottom: '1em' }} {...props} />
              ),
            }}
          />
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
            resize: 'none',
          }}
        />
        <Group justify="right" mt="md">
          <Button
            variant="light"
            color="teal"
            onClick={handle_save_edit}
          >
            Save
          </Button>
        </Group>
      </Modal>

      {/* Agent Box Card */}
      <Card shadow="sm" padding="md" radius="md" withBorder style={{ backgroundColor: '#242424' }}>
        <div style={{ padding: '10px' }}>
          <Group gap="xs" align="center">
            <Title order={4} style={{ color: 'white', margin: 0 }}>{name}</Title>
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
            children={chapter_content?.trim() || "Waiting for the agent to generate a response..."}
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

          <Button
            size="sm"
            variant="light"
            color={!should_stream ? 'orange' : undefined}
            disabled={disable_edit}
            onClick={() => {
              set_edited_content(chapter_content);
              set_edit_modal_open(true);
            }}
            style={{
              backgroundColor: should_stream ? 'rgba(128, 128, 128, 0.2)' : '',
                color: should_stream ? '#888' : '',
                cursor: should_stream ? 'not-allowed' : 'pointer',
            }}
          >
            Edit
          </Button>

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

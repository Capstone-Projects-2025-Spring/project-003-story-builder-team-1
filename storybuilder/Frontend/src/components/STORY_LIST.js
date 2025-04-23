import { useState, useEffect } from 'react'; 
import { Button, Collapse, Stack, Box, Modal, Divider, Text, Title } from '@mantine/core';
import { Flex } from '@mantine/core';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { useNavigate } from 'react-router';
import { USE_USER } from '../context/USER_CONTEXT';
import USE_AXIOS from '../hooks/USE_AXIOS';
import { USE_AUTH } from '../context/AUTH_CONTEXT';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:8080";

function STORY_LIST() {
  const navigate = useNavigate();
  const [expanded_story, set_expanded_story] = useState(null);
  const { user_stories, fetch_user_data } = USE_USER();
  const [stories, set_stories] = useState([]);
  const [delete_modal_opened, set_delete_modal_opened] = useState(false);
  const [story_to_delete, set_story_to_delete] = useState(null);
  const { use_axios } = USE_AXIOS();
  const { user } = USE_AUTH();

  useEffect(() => {
    set_stories(user_stories.stories);
  }, [user_stories]);

  const toggle_expand = (story_id) => {
    set_expanded_story(expanded_story === story_id ? null : story_id);
  };

  const handle_delete_click = (storyId) => {
    set_story_to_delete(storyId);
    set_delete_modal_opened(true);

  };

  const handle_delete_confirm = async () => {
    const { data, error } = await use_axios(`${SERVER_URL}/db/story/${user}/${story_to_delete}/delete`, "POST", {user, story_to_delete});
    if (data === null) {
      console.error("Error deleting story:", error);
    }
    set_delete_modal_opened(false);
    fetch_user_data(user); // Refresh story list
  };

  return (
    <>
      <Stack spacing="xs" mt="xs" style={{ height: '100%' }}>
        <Button
          fullWidth
          onClick={() => navigate(`/agent_selection`)}
          style={{
            backgroundColor: 'rgba(107, 186, 104, 0.8)',
            color: 'white',
            border: '1px solid #06402B',
          }}
        >
          Generate New Story
        </Button>

        {/* Scrollable story list container */}
        <Box style={{ flex: 1, overflowY: 'auto' }}>
          <Stack spacing="xs" mt="xs">
            {stories.map((story) => (
              <div key={story._id}>
                {/* Story Button */}
                <Button
                  variant="default"
                  color="gray"
                  fullWidth
                  onClick={() => toggle_expand(story._id)}
                  style={{ justifyContent: 'center', position: 'relative' }}
                >
                  <Flex justify="center" align="center" style={{ width: '100%' }}>
                    <span style={{ margin: '0 auto' }}>{story.story_name}</span>
                    {expanded_story === story._id ? (
                      <IconChevronDown size={16} style={{ position: 'absolute', right: 12 }} />
                    ) : (
                      <IconChevronRight size={16} style={{ position: 'absolute', right: 12 }} />
                    )}
                  </Flex>
                </Button>

                {/* Expandable Section */}
                <Collapse in={expanded_story === story._id}>
                  <Stack spacing="xs" mt="xs">
                    <Button variant="filled" color="gray" fullWidth onClick={() => navigate(`/story/${story._id}/view`)}>
                      View Story
                    </Button>
                    <Button variant="filled" color="gray" fullWidth onClick={() => navigate(`/story/${story._id}/best_response`)}>
                      Best Response
                    </Button>
                    <Button variant="filled" color="gray" fullWidth onClick={() => navigate(`/story/${story._id}/agents`)}>
                      Agents
                    </Button>
                                      
                    <Button variant="filled" color="gray" fullWidth onClick={() => handle_delete_click(story._id)}>
                      Delete Story
                    </Button> 
                   
                  </Stack>
                </Collapse>
              </div>
            ))}
          </Stack>
        </Box>
      </Stack>

      {/* Delete Story Modal */}
      <Modal
        opened={delete_modal_opened}
        onClose={() => set_delete_modal_opened(false)}
        title={<Title component="div" order={3}>Delete Story</Title>}
        centered
      >
        <Divider my="sm" mt={1} />
        <Text size="md" align="center" mb="md">
          Are you sure you want to delete this story?
        </Text>
        <Button color="red" fullWidth mt="md" onClick={handle_delete_confirm}>
          Confirm
        </Button>
      </Modal>
    </>
  );
}

export default STORY_LIST;
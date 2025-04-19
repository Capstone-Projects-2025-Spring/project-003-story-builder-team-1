import { useState } from 'react';
import { Button, Collapse, Stack } from '@mantine/core';
import { useNavigate } from 'react-router';
import { IconChevronDown } from '@tabler/icons-react';

function STORY_LIST() {
  const navigate = useNavigate();
  const [expanded_story, set_expanded_story] = useState(null);

  const stories = [{ id: 1, title: 'Story 1' }];

  const toggleExpand = (story_id) => {
    set_expanded_story(expanded_story === story_id ? null : story_id);
  };

  return (
    <Stack spacing="xs" mt="xs">
      {stories.map((story) => {
        const isExpanded = expanded_story === story.id;

        return (
          <div key={story.id}>
            {/* Custom layout button */}
            <Button
              variant="filled"
              fullWidth
              onClick={() => toggleExpand(story.id)}
              styles={{
                root: {
                  position: 'relative',
                  backgroundColor: '#2074c4',
                  color: 'white',
                },
              }}
            >
              <div
                style={{
                  width: '100%',
                  textAlign: 'center',
                }}
              >
                {story.title}
              </div>

              <IconChevronDown
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: `translateY(-50%) ${isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'}`,
                  transition: 'transform 0.2s ease',
                }}
              />
            </Button>

            {/* Expandable Section */}
            <Collapse in={isExpanded}>
              <Stack spacing="xs" mt="xs">
                <Button variant="filled" color="gray" fullWidth onClick={() => navigate(`/story/${story.id}/view`)}>
                  View Story
                </Button>
                <Button variant="filled" color="gray" fullWidth onClick={() => navigate(`/story/${story.id}/best_response`)}>
                  Best Response
                </Button>
                <Button variant="filled" color="gray" fullWidth onClick={() => navigate(`/story/${story.id}/agents`)}>
                  Agents
                </Button>
              </Stack>
            </Collapse>
          </div>
        );
      })}
    </Stack>
  );
}

export default STORY_LIST;
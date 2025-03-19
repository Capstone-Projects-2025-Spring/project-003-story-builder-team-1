import { useState } from 'react';
import { Button, Collapse, Stack } from '@mantine/core';
import { useNavigate } from 'react-router';

function STORY_LIST() {
  const navigate = useNavigate();
  const [expanded_story, set_expanded_story] = useState(null);

  const stories = [
    { id: 1, title: 'Story 1' },
    { id: 2, title: 'Story 2' },
    { id: 3, title: 'Story 3' },
  ];

  const toggleExpand = (storyId) => {
    set_expanded_story(expanded_story === storyId ? null : storyId);
  };

  return (
    <Stack spacing="xs" mt="xs">
      {stories.map((story) => (
        <div key={story.id}>
          {/* Story Button */}
          <Button
            variant="default"
            color="gray"
            fullWidth
            onClick={() => toggleExpand(story.id)}
          >
            {story.title}
          </Button>

          {/* Expandable Section */}
          <Collapse in={expanded_story === story.id}>
            <Stack spacing="xs" mt="xs">
              <Button variant="filled" color="gray" fullWidth onClick={() => navigate(`/story/${story.id}/view`)}>
                View Story
              </Button>
              <Button variant="filled" color="gray" fullWidth onClick={() => navigate(`/story/${story.id}/agents`)}>
                Agents
              </Button>
            </Stack>
          </Collapse>
        </div>
      ))}
    </Stack>
  );
}

export default STORY_LIST;
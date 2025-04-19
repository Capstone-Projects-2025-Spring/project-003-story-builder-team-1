import { useState, useEffect, useContext } from 'react';
import { Button, Collapse, Stack } from '@mantine/core';
import { useNavigate } from 'react-router';
import { USE_USER } from '../context/USER_CONTEXT';

function STORY_LIST() {
  const navigate = useNavigate();
  const [expanded_story, set_expanded_story] = useState(null);
  const { id, user_stories } = USE_USER();
  const [stories, set_stories] = useState([]);

  useEffect(() => {
        set_stories(user_stories.stories);
  }, [user_stories]);

  const toggleExpand = (story_id) => {
    set_expanded_story(expanded_story === story_id ? null : story_id);
  };

  return (
    <Stack spacing="xs" mt="xs">
      <Button variant="outline" color="orange" fullWidth  onClick={() => navigate(`/agent_selection`)}>
        Generate New Story
      </Button>
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
              <Button variant="filled" color="gray" fullWidth onClick={() => navigate(`/story/${story.id}/best_response`)}>
                Best Response
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
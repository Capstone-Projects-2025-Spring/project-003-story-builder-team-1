import { useState, useEffect, useContext } from 'react';
import { Button, Collapse, Stack } from '@mantine/core';
import { useNavigate } from 'react-router';
import { USE_USER } from '../context/USER_CONTEXT';

function STORY_LIST() {
  const navigate = useNavigate();
  const [expanded_story, set_expanded_story] = useState(null);
  const { user_stories } = USE_USER();
  const [stories, set_stories] = useState([]);

  useEffect(() => {
        set_stories(user_stories.stories);
  }, [user_stories]);

  console.log("STORY_LIST: ", user_stories);

  const toggleExpand = (story_id) => {
    set_expanded_story(expanded_story === story_id ? null : story_id);
  };

  return (
    <Stack spacing="xs" mt="xs">
      <Button variant="outline" color="orange" fullWidth  onClick={() => navigate(`/agent_selection`)}>
        Generate New Story
      </Button>
      {stories.map((story) => (
        <div key={story._id}>
          {/* Story Button */}
          <Button
            variant="default"
            color="gray"
            fullWidth
            onClick={() => toggleExpand(story.id)}
          >
            {story.story_name}
          </Button>

          {/* Expandable Section */}
          <Collapse in={expanded_story === story.id}>
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
            </Stack>
          </Collapse>
        </div>
      ))}
    </Stack>
  );
}

export default STORY_LIST;
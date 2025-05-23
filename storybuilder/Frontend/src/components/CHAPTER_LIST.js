import { useState, useEffect } from 'react';
import { Button, Stack, Box } from '@mantine/core';
import { useNavigate, useParams, useLocation } from 'react-router';
import { USE_USER } from '../context/USER_CONTEXT';

function CHAPTER_LIST() {
  const navigate = useNavigate();
  const location = useLocation();
  const { story_id } = useParams();
  const [chapters, set_chapters] = useState([]);
  const { user_stories } = USE_USER();

  console.log("Rendering CHAPTER_LIST")

  useEffect(() => {
    if (story_id && user_stories?.stories) {
      const current_story = user_stories.stories.find(
        (story) => story._id === story_id
      );
      if (current_story) {
        set_chapters(current_story.story_content || []);
      }
    }
  }, [story_id, user_stories]);

  const handle_chapter_click = (index) => {
    if (location.pathname.includes('/agent_history')) {
      navigate(`/story/${story_id}/agent_history/${index}`); // or any other route you'd prefer
    } else {
      navigate(`/story/${story_id}/view/${index}`);
    }
  };

  const handle_view_entire_story = () => {
    navigate(`/story/${story_id}/view`);
  };

  return (
    <Stack spacing="xs" mt="xs" style={{ height: '100%' }}>
      {/* View Entire Story Button */}
      <Button
        variant="default"
        color="gray"
        fullWidth
        onClick={handle_view_entire_story}
      >
        View Entire Story
      </Button>

      <Box
        style={{
          flex: 1,
          overflowY: 'auto',
        }}
      >
      <Stack spacing="xs" mt="xs">
      {/* Chapter Buttons */}
      {chapters.map((chapter, index) => (
        <Button
          key={index}
          variant="default"
          color="gray"
          fullWidth
          onClick={() => handle_chapter_click(index)}
        >
          {index === 0 ? 'Outline' : `Chapter ${index}`}
        </Button>
      ))}
      </Stack>
      </Box>
    </Stack>
  );
}

export default CHAPTER_LIST;
import { useState, useContext, useEffect } from 'react';
import { Button, Stack } from '@mantine/core';
import { useNavigate } from 'react-router';
import STORY_CONTEXT from "../context/STORY_CONTEXT";

function CHAPTER_LIST({ }) {
  const navigate = useNavigate();
  const { state } = useContext(STORY_CONTEXT);
  const [chapters, set_chapters] = useState([]);

  useEffect(() => {
    if (state.current_story) {
        set_chapters(state.current_story.chapters);
    }
  }, [state.current_story]);

  // hardcoded for 1 story for now MUST CHANGE
  const handle_chapter_click = (index) => {
    navigate(`/story/1/view/${index + 1}`);
  };

  // hardcoded for 1 story for now MUST CHANGE
  const handle_view_entire_story = () => {
    navigate(`/story/1/view`);
  };

  return (
    <Stack spacing="xs" mt="xs">
      {/* View Entire Story Button */}
      <Button
        variant="default"
        color="gray"
        fullWidth
        onClick={handle_view_entire_story}
      >
        View Entire Story
      </Button>

      {/* Chapter Buttons */}
      {chapters.map((chapter, index) => (
        <Button
          key={index}
          variant="default"
          color="gray"
          fullWidth
          onClick={() => handle_chapter_click(index)}
        >
          Chapter {index + 1}
        </Button>
      ))}
    </Stack>
  );
}

export default CHAPTER_LIST;
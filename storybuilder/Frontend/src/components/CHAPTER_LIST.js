import { Button, Stack } from '@mantine/core';
import { useNavigate } from 'react-router';

function CHAPTER_LIST({ chapters, storyId }) {
  const navigate = useNavigate();

  const handle_chapter_click = (chapterId) => {
    navigate(`/story/${storyId}/view/${chapterId}`);
  };

  const handle_view_entire_story = () => {
    navigate(`/story/${storyId}/view`);
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
      {chapters.map((chapter) => (
        <Button
          key={chapter.id}
          variant="default"
          color="gray"
          fullWidth
          onClick={() => handle_chapter_click(chapter.id)}
        >
          {chapter.title}
        </Button>
      ))}
    </Stack>
  );
}

export default CHAPTER_LIST;
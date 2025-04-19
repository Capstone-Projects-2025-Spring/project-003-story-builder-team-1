import { useState, useEffect } from 'react';
import { Container, Title, Text } from "@mantine/core";
import { useParams } from 'react-router';
import { USE_USER } from '../context/USER_CONTEXT';

function STORY_VIEW() {
  const { story_id } = useParams();
  const [story_title, set_story_title] = useState("Story Title");
  const [chapters, set_chapters] = useState([]);
  const { user_stories } = USE_USER();

  useEffect(() => {
    if (!story_id || !user_stories?.stories) return;

    const current_story = user_stories.stories.find(
      (story) => story._id === story_id
    );

    if (current_story) {
      set_story_title(current_story.story_name || "Untitled Story");
      set_chapters(current_story.story_content || []);
    }
  }, [story_id, user_stories]);
  
  return (
    <Container fluid style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '100%', margin: 'auto' }}>
      {/* Story Title */}
      <Title order={1} style={{ textAlign: 'center' }}>
        {story_title}
      </Title>

      {/* Chapter Text */}
      <Text size="lg" style={{ textAlign: 'justify', lineHeight: 1.6 }}>
      {chapters.map((chapter, index) => (
        <div key={index} dangerouslySetInnerHTML={{ __html: chapter.replace(/\n/g, '<br />') }} />
      ))}
      </Text>
    </Container>
  );
}

export default STORY_VIEW;
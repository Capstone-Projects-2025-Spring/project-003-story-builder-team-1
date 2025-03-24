import { useState, useContext, useEffect } from 'react';
import { Container, Title, Text } from "@mantine/core";
import STORY_CONTEXT from "../context/STORY_CONTEXT";

function STORY_VIEW({ }) {
    const { state } = useContext(STORY_CONTEXT);
    const [story_title, set_story_title] = useState("Story Title");
    const [chapters, set_chapters] = useState([]);

    useEffect(() => {
      if (state.current_story) {
          set_story_title(state.current_story.title);
          set_chapters(state.current_story.chapters);
      }
    }, [state.current_story]);
    
    return (
      <Container fluid style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '100%', margin: 'auto' }}>
        {/* Story Title */}
        <Title order={1} style={{ textAlign: 'center' }}>
          {story_title}
        </Title>

        {/* Chapter Title ***Chapter Title currently in full response from agent
        <Title order={2} style={{ textAlign: 'center' }}>
          {chapter_title}
        </Title> */}

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
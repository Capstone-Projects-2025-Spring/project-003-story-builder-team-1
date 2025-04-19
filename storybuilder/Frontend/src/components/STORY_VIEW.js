import { useState, useEffect } from 'react';
import { Container, Title, Text } from "@mantine/core";
import { useParams } from 'react-router';
import { USE_USER } from '../context/USER_CONTEXT';
import ReactMarkdown from 'react-markdown';

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
    <Container fluid style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '100%', margin: 'auto' }}>
      {/* Story Title */}
      <Title order={1} style={{ textAlign: 'center' }}>
        {story_title}
      </Title>

      {/* Chapters with markdown and page breaks */}
      {chapters.map((chapter, index) => (
        <div key={index}>
          <div
            style={{
              padding: '16px',
              color: '#white',
              fontSize: '18px',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
            }}
          >
            <ReactMarkdown
              children={chapter}
              components={{
                p: ({ node, ...props }) => <p style={{ marginBottom: '1em' }} {...props} />,
                strong: ({ node, ...props }) => <strong style={{ color: '#dee2e6' }} {...props} />,
              }}
            />
          </div>

          {/* Page break between chapters */}
          {index !== chapters.length - 1 && (
            <hr
              style={{
                margin: '48px auto',
                border: 0,
                height: '2px',
                width: '80%',
                background: '#495057', // subtle divider color
              }}
            />
          )}
        </div>
      ))}
    </Container>
  );
}

export default STORY_VIEW;
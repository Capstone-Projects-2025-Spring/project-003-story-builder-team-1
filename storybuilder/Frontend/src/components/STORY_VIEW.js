import { useState, useContext, useEffect } from 'react';
import { Container, Title } from "@mantine/core";
import ReactMarkdown from 'react-markdown';
import STORY_CONTEXT from "../context/STORY_CONTEXT";

function STORY_VIEW({ }) {
  const { state } = useContext(STORY_CONTEXT);
  const [story_title, set_story_title] = useState("Story Title");
  const [chapters, set_chapters] = useState([]);

  useEffect(() => {
    if (state.current_story) {
      set_story_title(state.current_story.title);
      set_chapters(state.current_story.chapters.slice(1)); // remove outline
    }
  }, [state.current_story]);

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
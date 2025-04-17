import React from 'react';
import { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router';
import { Container, Text } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import STORY_CONTEXT from "../context/STORY_CONTEXT";

function CHAPTER_VIEW() {
    const { state } = useContext(STORY_CONTEXT);
    const { chapter_id } = useParams();
    const [chapters, set_chapters] = useState([]);
    const curr_chapter = parseInt(chapter_id, 10);

    useEffect(() => {
        if (state.current_story) {
            set_chapters(state.current_story.chapters);
        }
    }, [state.current_story]);

    // In case the chapter is not found
    if (!chapters[curr_chapter]) {
        return <p>Chapter not found!</p>;
    }

    return (
        <Container fluid style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '100%', margin: 'auto' }}>
            {/* Chapter Title *** Chapter Title currently in full response from agent
            <Title order={2} style={{ textAlign: 'center' }}>
                {chapter.title}
            </Title> */}

            {/* Chapter Text */}
            <Text size="lg" style={{ textAlign: 'justify', lineHeight: 1.6 }}>
                <ReactMarkdown children={chapters[curr_chapter]} />
            </Text>
        </Container>
    );
}

export default CHAPTER_VIEW;
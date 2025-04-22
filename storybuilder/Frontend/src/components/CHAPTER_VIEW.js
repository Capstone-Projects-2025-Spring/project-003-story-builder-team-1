import React from 'react';
import { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router';
import { Container } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import { USE_USER } from '../context/USER_CONTEXT';

function CHAPTER_VIEW() {
    const { story_id, chapter_id } = useParams();
    const curr_chapter = parseInt(chapter_id, 10);
    const {user_stories} = USE_USER();
    const [chapter_display, set_chapter_display] = useState(null);

    useEffect(() => {
        if (story_id && user_stories?.stories?.length && !isNaN(curr_chapter)) {
            const found_story = user_stories.stories.find(
                (story) => story._id === story_id
            );
            if (found_story && found_story.story_content[curr_chapter]) {
                set_chapter_display(found_story.story_content[curr_chapter].text);
            } else {
                set_chapter_display("Chapter not found.");
            }
        }
    }, [story_id, user_stories, curr_chapter]);


    return (
        <Container fluid style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '100%', margin: 'auto' }}>
            {/* Chapter Title *** Chapter Title currently in full response from agent
            <Title order={2} style={{ textAlign: 'center' }}>
                {chapter.title}
            </Title> */}

            {/* Chapter Text
            <Text size="lg" style={{ textAlign: 'justify', lineHeight: 1.6 }}>
                <ReactMarkdown component="div" children={chapter_display} />
            </Text> */}

            <div
                style={{
                padding: '16px',
                color: '#white',
                fontSize: '18px',
                lineHeight: 1.6,
                }}
            >
                <ReactMarkdown children={chapter_display} />
            </div>
        </Container>
    );
}

export default CHAPTER_VIEW;
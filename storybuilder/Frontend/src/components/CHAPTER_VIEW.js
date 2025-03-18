import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Title, Text } from '@mantine/core';

// Mock data for chapters (you can also pull this from a state management system)
const mockChapters = [
    { id: 1, title: "Chapter 1: A New Journey", text: "Once upon a time, in a land far away..." },
    { id: 2, title: "Chapter 2: The First Challenge", text: "The hero faced a mighty beast in the forest..." },
    { id: 3, title: "Chapter 3: An Unexpected Ally", text: "A mysterious stranger appeared, offering guidance..." },
    { id: 4, title: "Chapter 4: The Darkest Hour", text: "The hero ventured into the dark cave, facing danger..." },
    { id: 5, title: "Chapter 5: The Final Battle", text: "The hero fought valiantly against the ultimate foe..." }
];

function CHAPTER_VIEW() {
    const { chapterId } = useParams();
    const chapter = mockChapters.find(c => c.id === parseInt(chapterId));

    // In case the chapter is not found
    if (!chapter) {
        return <p>Chapter not found!</p>;
    }

    return (
        <Container fluid style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '100%', margin: 'auto' }}>
            {/* Chapter Title */}
            <Title order={2} style={{ textAlign: 'center' }}>
                {chapter.title}
            </Title>

            {/* Chapter Text */}
            <Text size="lg" style={{ textAlign: 'justify', lineHeight: 1.6 }}>
                {chapter.text}
            </Text>
        </Container>
    );
}

export default CHAPTER_VIEW;
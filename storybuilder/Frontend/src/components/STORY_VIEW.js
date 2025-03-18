import { Container, Title, Text } from "@mantine/core";

function STORY_VIEW({ 
  story_title = "The Adventure Begins", 
  chapter_title = "Chapter 1: A New Journey", 
  chapter_text = "Once upon a time, in a land far away, a young hero embarked on an unforgettable journey. The sky was painted with shades of orange and purple as the sun dipped below the horizon. Each step forward brought new challenges, but also new friendships. The adventure had only just begun..." 
  }) {
    return (
      <Container fluid style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '100%', margin: 'auto' }}>
        {/* Story Title */}
        <Title order={1} style={{ textAlign: 'center' }}>
          {story_title}
        </Title>

        {/* Chapter Title */}
        <Title order={2} style={{ textAlign: 'center' }}>
          {chapter_title}
        </Title>

        {/* Chapter Text */}
        <Text size="lg" style={{ textAlign: 'justify', lineHeight: 1.6 }}>
          {chapter_text}
        </Text>
      </Container>
    );
}

export default STORY_VIEW;
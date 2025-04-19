import { Container, Stack } from '@mantine/core';
import { useState, useEffect } from 'react';
import AGENT_BOX from '../components/AGENT_BOX';
import { useParams } from 'react-router';
import { USE_USER } from '../context/USER_CONTEXT';

function STORY_AGENTS_VIEW() {
  const { story_id } = useParams();
  const { user_stories } = USE_USER();
  const [agents, set_agents] = useState([]);

  console.log("user stories: ", user_stories);

  useEffect(() => {
    if (!story_id || !user_stories?.stories) return;

    const current_story = user_stories.stories.find(
      (story) => story._id === story_id
    );

    if (current_story?.agents) {
      set_agents(current_story.agents);
    }
  }, [story_id, user_stories]);

  return (
    <Container fluid style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Stack spacing="md">
        {agents.map((agent) => (
          <AGENT_BOX key={agent.agent} name={agent.agent_name} response={agent.response} />
        ))}
      </Stack>

      {/* Continue Button *** commented out until we get next step implemented
      <Button 
          size="lg"
          variant="filled"
          onClick={() => navigate('/next-step')}
          style={{
          marginTop: 'auto',  // Push the button to the bottom
          alignSelf: 'flex-end',  // Align the button to the right
          }}>
        Continue
      </Button> */}
    </Container>
  );
}

export default STORY_AGENTS_VIEW;
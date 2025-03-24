import { Container, Stack, Button } from '@mantine/core';
import { useNavigate } from 'react-router';
import AGENT_BOX from '../components/AGENT_BOX';

function STORY_AGENTS_VIEW() {
    const navigate = useNavigate();

    // Example agent data (Replace with real data)
    const agents = [
      { id: 1, name: 'Agent 1', response: 'Lorem ipsum dolor sit amet' },
    ];
  
    return (
      <Container fluid style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Stack spacing="md">
          {agents.map((agent) => (
            <AGENT_BOX key={agent.id} name={agent.name} response={agent.response} />
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
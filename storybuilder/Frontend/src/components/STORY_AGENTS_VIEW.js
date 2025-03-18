import { Container, Stack, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import AGENT_BOX from '../components/AGENT_BOX';

function STORY_AGENTS_VIEW() {
    const navigate = useNavigate();

    // Example agent data (Replace with real data)
    const agents = [
      { id: 1, name: 'Agent 1', response: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
      { id: 2, name: 'Agent 2', response: 'Another response from a different agent, providing insight into the story...' },
    ];
  
    return (
      <Container fluid style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Stack spacing="md">
          {agents.map((agent) => (
            <AGENT_BOX key={agent.id} name={agent.name} response={agent.response} />
          ))}
        </Stack>
  
        {/* Continue Button */}
        <Button 
            size="lg"
            variant="filled"
            onClick={() => navigate('/next-step')}
            style={{
            marginTop: 'auto',  // Push the button to the bottom
            alignSelf: 'flex-end',  // Align the button to the right
            }}>
          Continue
        </Button>
      </Container>
    );
}

export default STORY_AGENTS_VIEW;
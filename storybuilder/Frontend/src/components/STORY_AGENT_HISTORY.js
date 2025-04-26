import { Button, Container, Stack, Group } from '@mantine/core';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { USE_USER } from '../context/USER_CONTEXT';
import AGENT_BOX from './AGENT_BOX';

function STORY_AGENT_HISTORY() {
    const [show_response, set_show_response] = useState(false);
    const [show_thoughts, set_show_thoughts] = useState(false);
    const [show_critiques, set_show_critiques] = useState(false);
    const [agent_responses, set_agent_responses] = useState({});
    const [agents, set_agents] = useState([]);
    const { user_stories } = USE_USER();
    const { story_id } = useParams();

    useEffect(() => {
        if (!story_id || !user_stories?.stories) return;
    
        const current_story = user_stories.stories.find((story) => story._id === story_id);
        if (!current_story) return;
    
        set_agents(current_story.agents || []);
    
        const initial_responses = {};
    
        current_story.agents.forEach((agent) => {
          const last_chapter = agent.chapters?.[agent.chapters.length - 1];
          if (last_chapter?.content) {
            initial_responses[agent._id] = last_chapter.content;
          }
        });
    
        set_agent_responses(initial_responses);
      }, [story_id, user_stories]);

    return (
        <Container fluid style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center' }}>
        <Button.Group>
        <Button
            variant={show_response ? "filled" : "default"}
            onClick={() => {
            set_show_response(true);
            set_show_thoughts(false);
            set_show_critiques(false);
            }}
        >
            Response
        </Button>
        <Button
            variant={show_thoughts ? "filled" : "default"}
            onClick={() => {
            set_show_response(false);
            set_show_thoughts(true);
            set_show_critiques(false);
            }}
        >
            Thoughts
        </Button>
        <Button
            variant={show_critiques ? "filled" : "default"}
            onClick={() => {
            set_show_response(false);
            set_show_thoughts(false);
            set_show_critiques(true);
            }}
        >
            Critiques
        </Button>
        </Button.Group>

        {/* Agent Responses */}
        {show_response && (
        <Stack spacing="md" mt={"md"}>
        {agents.map((agent) => (
          <Group key={agent._id} align="flex-start" style={{ width: '100%' }}>
              <AGENT_BOX
                name={agent.agent_name}
                chapter_content={agent_responses[agent._id] || "Waiting for the agent to generate a response..."}
                agent={agent.agent}
              />
          </Group>
        ))}
        </Stack> 
        )}
        </Container>
    );
}

export default STORY_AGENT_HISTORY;
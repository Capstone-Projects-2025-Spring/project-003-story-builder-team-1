import { Container, Stack, Group } from '@mantine/core';
import { useState, useEffect } from 'react';
import AGENT_BOX from '../components/AGENT_BOX';
import AGENT_THOUGHTS from './AGENT_THOUGHTS';
import { useParams } from 'react-router';
import { USE_USER } from '../context/USER_CONTEXT';
import { USE_AUTH } from '../context/AUTH_CONTEXT';
import { USE_STORY } from '../context/STORY_CONTEXT';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:8080";

function STORY_AGENTS_VIEW() {
  const { story_id } = useParams();
  const { user_stories, fetch_user_data } = USE_USER();
  const { user } = USE_AUTH();
  const [agents, set_agents] = useState([]);

  const { should_stream, set_should_stream, start_event_stream, agent_responses, set_agent_responses, agent_thoughts, set_agent_thoughts } = USE_STORY();
  const [stream_params, set_stream_params] = useState({
    step: "generate_outline",
    chapter_number: 0,
  });

  // use effect to reload context with db data when something changes
  useEffect(() => {
    console.log("user stories: ", user_stories);

    if (!story_id || !user_stories?.stories) return;

    const current_story = user_stories.stories.find(
      (story) => story._id === story_id
    );

    if (current_story?.agents) {
      set_agents(current_story.agents);

      // Set up the initial agent responses from their most recent chapters
      const initial_responses = {};
      current_story.agents.forEach(agent => {
        const last_chapter = agent.chapters?.[agent.chapters.length - 1];
        if (last_chapter?.content) {
          initial_responses[agent._id] = last_chapter.content;
        }
      });

      set_agent_responses(initial_responses);
    }

    console.log("Agents: ", current_story.agents);
  }, [story_id, user_stories]);

  useEffect(() => {
    if (!should_stream) return;
  
    const { step, chapterNumber } = stream_params;
    start_event_stream(user, story_id, step, chapterNumber);
  }, [should_stream]);

  return (
    <Container fluid style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Stack spacing="md">
        {agents.map((agent) => (
          <Group key={agent._id} align="flex-start" style={{ width: '100%' }}>
          <div style={{ flex: 0.7 }}>
          <AGENT_BOX
            key={agent._id}
            name={agent.agent_name}
            chapter_content={agent_responses[agent._id] || "Waiting for the agent to generate a response..."}
            agent={agent.agent}
            start_event_stream={start_event_stream}
          />
          </div>
          <div style={{ flex: 0.3 }}>
          <AGENT_THOUGHTS
          key={agent._id}
          chapter_thoughts={agent_thoughts[agent._id] || "Waiting for the agent to gather their thoughts..."}
          />
          </div>
          </Group>
        ))}
      </Stack>
    </Container>
  );
}

export default STORY_AGENTS_VIEW;
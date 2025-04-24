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
  const { user_stories } = USE_USER();
  const { user } = USE_AUTH();

  const [agents, set_agents] = useState([]);
  const [stream_params, set_stream_params] = useState({
    step: "generate_outline",
    chapter_number: 0,
  });

  const {
    should_stream,
    set_should_stream,
    start_event_stream,
    agent_responses,
    set_agent_responses,
    agent_thoughts,
    set_agent_thoughts,
    streamingAction,
    setStreamingAction,
  } = USE_STORY();

  // Setup agents and preload their latest chapter content/thoughts
  useEffect(() => {
    if (!story_id || !user_stories?.stories) return;

    const current_story = user_stories.stories.find((story) => story._id === story_id);
    if (!current_story) return;

    set_agents(current_story.agents || []);

    const initial_responses = {};
    const initial_thoughts = {};

    current_story.agents.forEach((agent) => {
      const last_chapter = agent.chapters?.[agent.chapters.length - 1];
      if (last_chapter?.content) {
        initial_responses[agent._id] = last_chapter.content;
      }
      if (last_chapter?.content_thoughts) {
        initial_thoughts[agent._id] = last_chapter.content_thoughts;
      }
    });

    set_agent_responses(initial_responses);
    set_agent_thoughts(initial_thoughts);
  }, [story_id, user_stories]);

  // Handle button action (regenerate / continue)
  const handleActionButtonClick = (actionType) => {
    setStreamingAction(actionType);
  
    const current_story = user_stories?.stories?.find((story) => story._id === story_id);
    if (!current_story) return;
  
    const story_content = current_story.story_content || [];
    const chapter_count = story_content.length;
    const has_outline = chapter_count >= 1;
    let step = '';
    let chapter_number = 0;
  
    if (actionType === 'regenerate') {
      step = has_outline && chapter_count === 1 ? 'rewrite_outline' : 'rewrite_chapter';
      chapter_number = has_outline && chapter_count === 1 ? 0 : chapter_count;
    } else if (actionType === 'continue') {
      step = has_outline && chapter_count === 1 ? 'generate_first_chapter' : 'generate_next_chapter';
      chapter_number = has_outline && chapter_count === 1 ? 1 : chapter_count + 1;
    }
  
    set_stream_params({ step, chapter_number });
    set_should_stream(true);
  };
  

  // Automatically start streaming once the should_stream flag flips
  useEffect(() => {
    if (!should_stream) return;
    const { step, chapter_number } = stream_params;
    start_event_stream(user, story_id, step, chapter_number);
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
                step={stream_params.step}
                chapter_number={stream_params.chapter_number}
                onActionButtonClick={handleActionButtonClick}
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

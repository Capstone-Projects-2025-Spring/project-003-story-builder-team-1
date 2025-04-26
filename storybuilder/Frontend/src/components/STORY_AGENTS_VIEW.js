import { Container, Stack, Group, Paper, Text } from '@mantine/core';
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
    streaming_action,
    set_streaming_action,
  } = USE_STORY();

    // Map your internal step keys to pretty titles
    const stepTitles = {
      generate_outline:       'Generating Outline',
      generate_first_chapter: 'Generating First Chapter',
      generate_next_chapter:  'Generating Next Chapter',
      rewrite_chapter:        'Rewriting Chapter',
    };
  
    // Figure out which status line to show
    const prettyStep = stepTitles[stream_params.step] || stream_params.step.replace(/_/g, ' ');
    let statusText = 'Select an action to begin drafting.';
    if (streaming_action && !should_stream) {
      statusText = `Ready to ${streaming_action} (Next Step: ${prettyStep})`;
    } else if (should_stream) {
      statusText = `Drafting Step: ${prettyStep}`;
    }

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

  const handleActionButtonClick = (actionType) => {
    if (actionType === 'saved') {
      // just a save event—no streaming
      return;
    }
    if (should_stream) return;

    set_streaming_action(actionType);

    const current_story = user_stories?.stories?.find((story) => story._id === story_id);
    if (!current_story) return;

    const story_content = current_story.story_content || [];
    const chapter_count = story_content.length;

    let step = "";
    let chapter_number = chapter_count;

    if (actionType === 'regenerate') {
      chapter_number -= 1;
      step = chapter_number === 0 ? 'generate_outline' : 'rewrite_chapter';
    } else if (actionType === 'continue') {
      step = chapter_count === 1 ? 'generate_first_chapter' : 'generate_next_chapter';
    }

    set_stream_params({ step, chapter_number });
    set_should_stream(true);
  };

  useEffect(() => {
    if (!should_stream) return;
    const { step, chapter_number } = stream_params;
    start_event_stream(user, story_id, step, chapter_number);
  }, [should_stream]);

  return (
    <Container fluid style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Stack spacing="md">
        
        {/* Visible status box */}
        <Paper withBorder p="md" radius="md">
        <Text size="lg" style={{ fontWeight: 'bold' }}>
           <strong>{statusText}</strong>
         </Text>
        </Paper>

        {agents.map(agent => (
          <Group key={agent._id} align="flex-start" style={{ width: '100%' }}>
            <div style={{ flex: 0.7 }}>
              <AGENT_BOX
                name={agent.agent_name}
                chapter_content={agent_responses[agent._id] || "Waiting for the agent to generate a response..."}
                agent={agent.agent}
                start_event_stream={start_event_stream}
                step={stream_params.step}
                chapter_number={stream_params.chapter_number}
                onActionButtonClick={handleActionButtonClick}
                story_id={story_id}
                agent_id={agent._id}
              />
            </div>
            <div style={{ flex: 0.3 }}>
              <AGENT_THOUGHTS
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

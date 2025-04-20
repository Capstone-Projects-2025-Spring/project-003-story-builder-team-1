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
  const [agent_responses, set_agent_responses] = useState({});  // State to store responses for each agent
  const [agent_thoughts, set_agent_thoughts] = useState({});  // State to store thoughts for each agent
  const { should_stream, set_should_stream } = USE_STORY();
  const [stream_params, set_stream_params] = useState({
    step: "generate_outline",
    chapter_number: 0,
  });


  const start_event_stream = (step = "generate_outline", chapter_number = 0) => {
    const url = `${SERVER_URL}/translator/translate?user_id=${user}&story_id=${story_id}&step=${step}&chapter_number=${chapter_number}`;
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
        const raw = event.data;
        const restored = raw.replace(/\[\[NL\]\]/g, "\n");

        if (restored.startsWith("{\"best")) {
            eventSource.close();
            set_should_stream(false);
            fetch_user_data(user);
            return;
        }

        try {
            const parts = restored.split("|");
            const agent_name = parts[0];
            const agent_id = parts[1];
            let token = parts.slice(2).join("|");

            if (token.startsWith("tool_call: ")) {
              token = token.replace("tool_call: ", "");
              set_agent_thoughts((prev) => ({
                ...prev,
                [agent_id]: (prev[agent_id] || "") + token,
              }));
            }

            set_agent_responses((prev) => ({
              ...prev,
              [agent_id]: (prev[agent_id] || "") + token,
            }));

            // if (token.startsWith("tool_call: ")) {
            //   token = token.replace("tool_call: ", "");
            //   set_agent_thoughts((prev) => ({
            //     ...prev,
            //     [agent_id]: (prev[agent_id] || "") + token,
            //   }));
            // } else {
            //   set_agent_responses((prev) => ({
            //     ...prev,
            //     [agent_id]: (prev[agent_id] || "") + token,
            //   }));
            // }

        } catch (err) {
            console.error("Failed to parse SSE message", err);
        }
    };

    eventSource.onerror = () => {
        console.error("SSE error");
        eventSource.close();
    };
  };

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
    start_event_stream(step, chapterNumber);
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
          />
          </div>
          <div style={{ flex: 0.3 }}>
          <AGENT_THOUGHTS
          key={agent._id}
          chapter_thoughts={agent_thoughts[agent._id] || "Waiting for the agent to generate a response..."}
          />
          </div>
          </Group>
        ))}
      </Stack>
    </Container>
  );
}

export default STORY_AGENTS_VIEW;
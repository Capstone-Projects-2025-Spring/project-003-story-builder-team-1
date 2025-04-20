import { Container, Stack } from '@mantine/core';
import { useState, useEffect } from 'react';
import AGENT_BOX from '../components/AGENT_BOX';
import { useParams } from 'react-router';
import { USE_USER } from '../context/USER_CONTEXT';
import { USE_AUTH } from '../context/AUTH_CONTEXT';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:8080";

function STORY_AGENTS_VIEW() {
  const { story_id } = useParams();
  const { user_stories } = USE_USER();
  const { user } = USE_AUTH();
  const [agents, set_agents] = useState([]);
  const [agent_responses, set_agent_responses] = useState({});  // State to store responses for each agent

  useEffect(() => {
    console.log("user stories: ", user_stories);

    if (!story_id || !user_stories?.stories) return;

    const current_story = user_stories.stories.find(
      (story) => story._id === story_id
    );

    if (current_story?.agents) {
      set_agents(current_story.agents);
    }

    console.log("Agents: ", current_story.agents);
  }, [story_id, user_stories]);

  useEffect(() => {
    if (!user || !story_id) {
      console.log("Skipping SSE setup because user or story_id is missing");
      return;
    }

    const es_url = `${SERVER_URL}/translator/translate?user_id=${user}&story_id=${story_id}&step=generate_outline&chapter_number=0`;

    const eventSource = new EventSource(es_url);

    eventSource.onopen = () => {
      //console.log("SSE connection opened");
    };

    eventSource.onmessage = (event) => {
      try {
        const [agent_name, agent_id, tool_call_str, ...token_parts] = event.data.split(" ");
        const tool_call = tool_call_str === "true";
        const token = token_parts.join(" ");
    
        set_agent_responses((prev) => {
          const prevText = prev[agent_id] || "";
          const updated = {
            ...prev,
            [agent_id]: prevText + token,
          };
          return updated;
        });
    
        // Optional: log the parsed info only
        console.log("Chunk received:", { agent_id, token });
      } catch (err) {
        console.error("Failed to parse SSE event:", err);
      }
    };

    // Clean up SSE connection when component unmounts
    return () => {
      eventSource.close();
    };
  }, [user, story_id]);

  return (
    <Container fluid style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Stack spacing="md">
        {agents.map((agent) => (
          <AGENT_BOX
            key={agent._id}
            name={agent.agent_name}
            chapter_content={agent_responses[agent._id] || "Waiting for the agent to generate a response..."}
            agent={agent.agent}
          />
        ))}
      </Stack>
    </Container>
  );
}

export default STORY_AGENTS_VIEW;
import { Container, Stack, Group, Paper, Text } from '@mantine/core';
import { useState, useEffect } from 'react';
import AGENT_BOX from '../components/AGENT_BOX';
import AGENT_THOUGHTS from './AGENT_THOUGHTS';
import { useParams } from 'react-router';
import { USE_USER } from '../context/USER_CONTEXT';
import { USE_AUTH } from '../context/AUTH_CONTEXT';
import { USE_STORY } from '../context/STORY_CONTEXT';
import USE_AXIOS from '../hooks/USE_AXIOS';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:8080";

function STORY_AGENTS_VIEW() {
  const { story_id } = useParams();
  const { user_stories, fetch_user_data } = USE_USER();
  const { user } = USE_AUTH();
  const { use_axios } = USE_AXIOS();
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
    agent_critiques,
    set_agent_critiques,
    agent_critique_thoughts,
    set_agent_critique_thoughts,
    agent_rewrites,
    set_agent_rewrites,
    agent_rewrite_thoughts,
    set_agent_rewrite_thoughts,
    streaming_action,
    set_streaming_action,
    curr_step,
    set_curr_step
  } = USE_STORY();


  useEffect(() => {
    if (!story_id || !user_stories?.stories) return;

    const current_story = user_stories.stories.find((story) => story._id === story_id);
    if (!current_story) return;

    set_curr_step(current_story.story_step);
    set_agents(current_story.agents || []);

    const initial_responses = {};
    const initial_thoughts = {};
    const initial_critiques = {};
    const initial_critique_thoughts = {};

    current_story.agents.forEach((agent) => {
      const last_chapter = agent.chapters?.[agent.chapters.length - 1];
      if (last_chapter?.content) {
        initial_responses[agent._id] = last_chapter.content;
      }
      if (last_chapter?.content_thoughts) {
        initial_thoughts[agent._id] = last_chapter.content_thoughts;
      }
      if (last_chapter?.critique) {
        initial_critiques[agent._id] = last_chapter.critique;
      }
      if (last_chapter?.critique_thoughts) {
        initial_critique_thoughts[agent._id] = last_chapter.critique_thoughts;
      }
    });

    set_agent_responses(initial_responses);
    set_agent_thoughts(initial_thoughts);
    set_agent_critiques(initial_critiques);
    set_agent_critique_thoughts(initial_critique_thoughts);
  }, [story_id, user_stories]);

  const handleActionButtonClick = async (actionType, agent_id) => {
    if (should_stream) return;

    set_streaming_action(actionType);

    const current_story = user_stories?.stories?.find((story) => story._id === story_id);
    if (!current_story) return;

    const story_content = current_story.story_content || [];
    const chapter_count = story_content.length;
    const current_step = current_story.story_step;
    set_curr_step(current_step);

    let step = "";
    let chapter_number = chapter_count;
    console.log("chapter count in handleactionbuttonclick: ", chapter_count)
    console.log("story content in handleactionbuttonclick: ", story_content);

    // if regenerate button is clicked, check phase and chapter to set steps accordingly
    if (actionType === 'regenerate') {
      console.log("regenerate button curr_step: ", curr_step)
      chapter_number -= 1;
      // if current step is generate, step stays generate
      if (curr_step === 'generate') {
        // regenerate chapter 0 is generating the outline
        if (chapter_number === 0) {
          step = 'generate_outline';
          // regeneate chapter 1 is generating the first chapter
        } else if (chapter_number === 1) {
          step = 'generate_first_chapter';
          // regenerate anything else is generating the next chapter
        } else {
          step = 'generate_next_chapter';
        }
      }
      // if current step is critique, then set steps critique
      else if (curr_step === 'critique') {
        step = chapter_number === 0 ? "critique_outline" : "critique_chapter";
      }
      else if (curr_step === 'rewrite') {
        if (chapter_number === 0) {
          step = 'rewrite_outline';
        } else {
          step = 'rewrite_chapter';
        }
      }
    }
    // if continue button is clicked, check phase and chapter to set steps accordingly
    else if (actionType === 'continue') {
      // if the current step is generate, then set the step to be critique
      if (curr_step === 'generate') {
        chapter_number -= 1;
        if (chapter_number === 0) {
          // db call to update db with this specific agent outline before continuing
          const { data: add_outline_data, error: add_outline_error } = await use_axios(SERVER_URL + `/db/story/${user}/${story_id}/add_outline`, "POST", {outline: agent_responses[agent_id]});

          if (add_outline_data) {
            await fetch_user_data(user);
          } else {
              console.error("Error updating outline:", add_outline_error);
          }
        }

        
        step = chapter_number === 0 ? "critique_outline" : "critique_chapter";
        // db call to update the story step to critique
        const { data: update_story_step_data, error: update_story_step_error } = await use_axios(SERVER_URL + `/db/story/${user}/${story_id}/update_story_step`, "POST", {step: "critique"});

        if (update_story_step_data) {
          await fetch_user_data(user);
        } else {
            console.error("Error updating story step:", update_story_step_error);
        }
        set_curr_step('critique');
      }
      // if current step is critique, then next step is rewrite
      else if (curr_step === 'critique') {
        // db call to update db with this specific agent critique before continuing
        const { data: add_critique_data, error: add_critique_error } = await use_axios(SERVER_URL + `/db/story/${user}/${story_id}/add_critique`, "POST", {chapter_number: chapter_number, critique: agent_critiques[agent_id]});

        if (add_critique_data) {
          await fetch_user_data(user);
        } else {
            console.error("Error updating critique:", add_critique_error);
        }

        chapter_number -= 1;
        step = chapter_number === 0 ? 'rewrite_outline' : 'rewrite_chapter';
        console.log("chapter count when trying to rewrite: ", chapter_count)
        // db call to update the story step to rewrite
        const { data, error } = await use_axios(SERVER_URL + `/db/story/${user}/${story_id}/update_story_step`, "POST", {step: "rewrite"});

        if (data) {
          await fetch_user_data(user);
        } else {
            console.error("Error updating story step:", error);
        }
        set_curr_step('rewrite');
      }
      // if current step is rewite, then next step is to generate
      else if (curr_step === 'rewrite') {
        if (chapter_number === 0) {
          // db call to update db with this specific agent outline before continuing
          const { data: add_outline_data, error: add_outline_error } = await use_axios(SERVER_URL + `/db/story/${user}/${story_id}/add_outline`, "POST", {outline: agent_responses[agent_id]});

          if (add_outline_data) {
            await fetch_user_data(user);
          } else {
              console.error("Error updating outline:", add_outline_error);
          }
        }
        else {
          // db call to update db with this specific agent chapter before continuing
          const { data: add_chapter_data, error: add_chapter_error } = await use_axios(SERVER_URL + `/db/story/${user}/${story_id}/add_chapter`, "POST", {story_chapter_number: chapter_number, text: agent_responses[agent_id]});

          if (add_chapter_data) {
            await fetch_user_data(user);
          } else {
              console.error("Error updating chapter:", add_chapter_error);
          }
        }
        step = chapter_number === 1 ? 'generate_first_chapter' : 'generate_next_chapter';

        // db call to update the story step to rewrite
        const { data, error } = await use_axios(SERVER_URL + `/db/story/${user}/${story_id}/update_story_step`, "POST", {step: "generate"});

        if (data) {
          await fetch_user_data(user);
        } else {
            console.error("Error updating story step:", error);
        }
        set_curr_step('generate');
      }
    }

    set_stream_params({ step, chapter_number });
    set_should_stream(true);
  };

  useEffect(() => {
    if (!should_stream) return;
    const { step, chapter_number } = stream_params;
    start_event_stream(user, story_id, step, chapter_number);
  }, [should_stream]);

  useEffect(() => {
    // Perform regeneration logic after curr_step updates
    if (curr_step === 'critique') {
      console.log("Updated curr_step: ", curr_step);
      // Regeneration logic here (e.g., trigger a regenerate action)
      // You can now safely use curr_step
    }
  }, [curr_step]);

  return (
    <Container fluid style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Visible current phase display */}
      <Paper withBorder p="md" radius="md" mb="md">
        <Text size="lg" style={{ fontWeight: 'bold' }}>
          <strong>Current Phase: {curr_step.toUpperCase()}</strong>
        </Text>
      </Paper>

      <Stack spacing="md">
        {agents.map((agent) => (
          <Group key={agent._id} align="flex-start" style={{ width: '100%' }}>
            <div style={{ flex: 0.7 }}>
              <AGENT_BOX
                name={agent.agent_name}
                chapter_content={
                  curr_step === "critique"
                    ? agent_critiques[agent._id] || "Waiting for the agent to critique..."
                    : agent_responses[agent._id] || "Waiting for the agent to generate a response..."
                }
                agent={agent.agent}
                start_event_stream={start_event_stream}
                step={stream_params.step}
                chapter_number={stream_params.chapter_number + 1} // i didnt think about this to understand why i need a +1 here but the index is off and it works
                onActionButtonClick={(actionType) => handleActionButtonClick(actionType, agent._id)}
                agent_id={agent._id}
              />
            </div>
            <div style={{ flex: 0.3 }}>
              <AGENT_THOUGHTS
                chapter_thoughts={
                  curr_step === "critique"
                    ? agent_critique_thoughts[agent._id] || "Waiting for the agent's critique thoughts..."
                    : agent_thoughts[agent._id] || "Waiting for the agent to gather their thoughts..."
                }
              />
            </div>
          </Group>
        ))}
      </Stack>
    </Container>
  );
}

export default STORY_AGENTS_VIEW;

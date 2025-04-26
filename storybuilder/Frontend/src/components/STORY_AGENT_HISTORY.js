import { Button, Container, Stack, Group, Center, Card, Title, Divider, Modal } from '@mantine/core';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { USE_USER } from '../context/USER_CONTEXT';
import ReactMarkdown from 'react-markdown';

function STORY_AGENT_HISTORY() {
    const [show_content, set_show_content] = useState(false);
    const [show_content_view, set_show_content_view] = useState(false);
    const [show_content_thoughts, set_show_content_thoughts] = useState(false);
    const [show_content_thoughts_view, set_show_content_thoughts_view] = useState(false);
    const [show_critiques, set_show_critiques] = useState(false);
    const [show_critiques_view, set_show_critiques_view] = useState(false);
    const [show_critique_thoughts, set_show_critique_thoughts] = useState(false);
    const [show_critique_thoughts_view, set_show_critique_thoughts_view] = useState(false);
    const [agent_content, set_agent_content] = useState({});
    const [agent_content_thoughts, set_agent_thoughts] = useState({});
    const [agent_critiques, set_agent_critiques] = useState({});
    const [agent_critique_thoughts, set_agent_critique_thoughts] = useState({});
    const [agents, set_agents] = useState([]);
    const [selected_agent, set_selected_agent] = useState(null);
    const { user_stories } = USE_USER();
    const { story_id, chapter_id } = useParams();

    useEffect(() => {
        console.log("Agent History chapter_id: ", chapter_id)
        console.log("Agent History user_stories ", user_stories)
        if (!story_id || !user_stories?.stories || !chapter_id) return;
    
        const current_story = user_stories.stories.find((story) => story._id === story_id);
        if (!current_story) return;
        console.log("Current Story: ", current_story)
    
        set_agents(current_story.agents || []);
    
        const curr_agent_responses = {};
        const curr_agent_thoughts = {};
        const curr_agent_critiques = {};
        const curr_agent_critique_thoughts = {};
        const target_chapter_number = parseInt(chapter_id);
    
        current_story.agents.forEach((agent) => {
            const matching_chapter = agent.chapters?.find(
                (chapter) => chapter.chapter_number === target_chapter_number
            );
            if (matching_chapter?.content) {
                curr_agent_responses[agent._id] = matching_chapter.content;
            }
            if (matching_chapter?.content_thoughts) {
                curr_agent_thoughts[agent._id] = matching_chapter.content_thoughts;
            }
            if (matching_chapter?.critiques) {
                curr_agent_critiques[agent._id] = matching_chapter.critiques;
            }
            if (matching_chapter?.critique_thoughts) {
                curr_agent_critique_thoughts[agent._id] = matching_chapter.critique_thoughts;
            }
        });
    
        set_agent_content(curr_agent_responses);
        set_agent_thoughts(curr_agent_thoughts);
        set_agent_critiques(curr_agent_critiques);
        set_agent_critique_thoughts(curr_agent_critique_thoughts);
    }, [story_id, user_stories, chapter_id]);

    const handle_agent_content_view = (agent) => {
        set_selected_agent(agent);
        set_show_content_view(true);
    }

    const handle_agent_content_thoughts_view = (agent) => {
        set_selected_agent(agent);
        set_show_content_thoughts_view(true);
    }

    const handle_agent_critiques_view = (agent) => {
        set_selected_agent(agent);
        set_show_critiques_view(true);
    }

    const handle_agent_critique_thoughts_view = (agent) => {
        set_selected_agent(agent);
        set_show_critique_thoughts_view(true);
    }


    return (
        <>
        {/* View Agent Content Modal */}
        <Modal
            opened={show_content_view}
            onClose={() => set_show_content_view(false)}
            size="50%"
            radius="md"
            padding="md"
            title={<Title component="div" order={3}>{selected_agent?.agent_name}</Title>}
            >
            <div style={{ padding: '12px', backgroundColor: '#2d2d2d', color: '#fff', borderRadius: '8px' }}>
                <ReactMarkdown
                children={agent_content[selected_agent?._id]}
                components={{
                    p: ({ node, ...props }) => (
                    <p style={{ fontSize: '18px', marginBottom: '1em' }} {...props} />
                    ),
                }}
                />
            </div>
        </Modal>

        {/* View Agent Content Thoughts Modal */}
        <Modal
            opened={show_content_thoughts_view}
            onClose={() => set_show_content_thoughts_view(false)}
            size="50%"
            radius="md"
            padding="md"
            title={<Title component="div" order={3}>{selected_agent?.agent_name}</Title>}
            >
            <div style={{ padding: '12px', backgroundColor: '#2d2d2d', color: '#fff', borderRadius: '8px' }}>
                <ReactMarkdown
                children={agent_content_thoughts[selected_agent?._id]}
                components={{
                    p: ({ node, ...props }) => (
                    <p style={{ fontSize: '18px', marginBottom: '1em' }} {...props} />
                    ),
                }}
                />
            </div>
        </Modal>

        {/* View Agent Critiques Modal */}
        <Modal
            opened={show_critiques_view}
            onClose={() => set_show_critiques_view(false)}
            size="50%"
            radius="md"
            padding="md"
            title={<Title component="div" order={3}>{selected_agent?.agent_name}</Title>}
            >
            <div style={{ padding: '12px', backgroundColor: '#2d2d2d', color: '#fff', borderRadius: '8px' }}>
                <ReactMarkdown
                children={agent_critiques[selected_agent?._id]}
                components={{
                    p: ({ node, ...props }) => (
                    <p style={{ fontSize: '18px', marginBottom: '1em' }} {...props} />
                    ),
                }}
                />
            </div>
        </Modal>

        {/* View Agent Critique Thoughts Modal */}
        <Modal
            opened={show_critique_thoughts_view}
            onClose={() => set_show_critique_thoughts_view(false)}
            size="50%"
            radius="md"
            padding="md"
            title={<Title component="div" order={3}>{selected_agent?.agent_name}</Title>}
            >
            <div style={{ padding: '12px', backgroundColor: '#2d2d2d', color: '#fff', borderRadius: '8px' }}>
                <ReactMarkdown
                children={agent_critique_thoughts[selected_agent?._id]}
                components={{
                    p: ({ node, ...props }) => (
                    <p style={{ fontSize: '18px', marginBottom: '1em' }} {...props} />
                    ),
                }}
                />
            </div>
        </Modal>
        
        <Container fluid style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center' }}>
            {chapter_id ? (
            <>
                <Button.Group>
                <Button
                    variant={show_content ? "filled" : "default"}
                    onClick={() => {
                    set_show_content(true);
                    set_show_content_thoughts(false);
                    set_show_critiques(false);
                    set_show_critique_thoughts(false);
                    }}
                >
                    Content
                </Button>
                <Button
                    variant={show_content_thoughts ? "filled" : "default"}
                    onClick={() => {
                    set_show_content(false);
                    set_show_content_thoughts(true);
                    set_show_critiques(false);
                    set_show_critique_thoughts(false);
                    }}
                >
                    Content Thoughts
                </Button>
                <Button
                    variant={show_critiques ? "filled" : "default"}
                    onClick={() => {
                    set_show_content(false);
                    set_show_content_thoughts(false);
                    set_show_critiques(true);
                    set_show_critique_thoughts(false);
                    }}
                >
                    Critiques
                </Button>
                <Button
                    variant={show_critique_thoughts ? "filled" : "default"}
                    onClick={() => {
                    set_show_content(false);
                    set_show_content_thoughts(false);
                    set_show_critiques(false);
                    set_show_critique_thoughts(true);
                    }}
                >
                    Critique Thoughts
                </Button>
                </Button.Group>

                {/* Agent Content */}
                {show_content && (
                <Stack spacing="md" mt={"md"}>
                    {agents.map((agent) => (
                    <Group key={agent._id} align="flex-start" style={{ width: "100%" }}>
                        <Card
                        shadow="sm"
                        padding="md"
                        radius="md"
                        withBorder
                        style={{ backgroundColor: "#242424" }}
                        >
                        <div style={{ padding: "10px" }}>
                            <Group gap="xs" align="center">
                            <Title order={4} style={{ color: "white", margin: 0 }}>
                                {agent.agent_name}
                            </Title>
                            </Group>
                        </div>

                        <Divider my="sm" mt={1} />

                        <div
                            style={{
                            backgroundColor: "#2d2d2d",
                            borderRadius: "8px",
                            padding: "16px",
                            color: "#fff",
                            maxHeight: "150px",
                            overflowY: "auto",
                            }}
                        >
                            <ReactMarkdown
                            children={agent_content[agent._id]}
                            components={{
                                p: ({ node, ...props }) => (
                                <p
                                    style={{ fontSize: "16px", marginBottom: "0.75em" }}
                                    {...props}
                                />
                                ),
                            }}
                            />
                        </div>

                        <Group justify="space-between" style={{ marginTop: "10px" }}>
                            <Button size="sm" variant="light" onClick={() => handle_agent_content_view(agent)}>
                            View
                            </Button>
                        </Group>
                        </Card>
                    </Group>
                    ))}
                </Stack>
                )}

                {/* Agent Content Thoughts */}
                {show_content_thoughts && (
                <Stack spacing="md" mt={"md"}>
                    {agents.map((agent) => (
                    <Group key={agent._id} align="flex-start" style={{ width: "100%" }}>
                        <Card
                        shadow="sm"
                        padding="md"
                        radius="md"
                        withBorder
                        style={{ backgroundColor: "#242424" }}
                        >
                        <div style={{ padding: "10px" }}>
                            <Group gap="xs" align="center">
                            <Title order={4} style={{ color: "white", margin: 0 }}>
                                {agent.agent_name}
                            </Title>
                            </Group>
                        </div>

                        <Divider my="sm" mt={1} />

                        <div
                            style={{
                            backgroundColor: "#2d2d2d",
                            borderRadius: "8px",
                            padding: "16px",
                            color: "#fff",
                            maxHeight: "150px",
                            overflowY: "auto",
                            }}
                        >
                            <ReactMarkdown
                            children={agent_content_thoughts[agent._id]}
                            components={{
                                p: ({ node, ...props }) => (
                                <p
                                    style={{ fontSize: "16px", marginBottom: "0.75em" }}
                                    {...props}
                                />
                                ),
                            }}
                            />
                        </div>

                        <Group justify="space-between" style={{ marginTop: "10px" }}>
                            <Button size="sm" variant="light" onClick={() => handle_agent_content_thoughts_view(agent)}>
                            View
                            </Button>
                        </Group>
                        </Card>
                    </Group>
                    ))}
                </Stack>
                )}

                {/* Agent Critiques */}
                {show_critiques && (
                <Stack spacing="md" mt={"md"}>
                    {agents.map((agent) => (
                    <Group key={agent._id} align="flex-start" style={{ width: "100%" }}>
                        <Card
                        shadow="sm"
                        padding="md"
                        radius="md"
                        withBorder
                        style={{ backgroundColor: "#242424" }}
                        >
                        <div style={{ padding: "10px" }}>
                            <Group gap="xs" align="center">
                            <Title order={4} style={{ color: "white", margin: 0 }}>
                                {agent.agent_name}
                            </Title>
                            </Group>
                        </div>

                        <Divider my="sm" mt={1} />

                        <div
                            style={{
                            backgroundColor: "#2d2d2d",
                            borderRadius: "8px",
                            padding: "16px",
                            color: "#fff",
                            maxHeight: "150px",
                            overflowY: "auto",
                            }}
                        >
                            <ReactMarkdown
                            children={agent_critiques[agent._id]}
                            components={{
                                p: ({ node, ...props }) => (
                                <p
                                    style={{ fontSize: "16px", marginBottom: "0.75em" }}
                                    {...props}
                                />
                                ),
                            }}
                            />
                        </div>

                        <Group justify="space-between" style={{ marginTop: "10px" }}>
                            <Button size="sm" variant="light" onClick={() => handle_agent_critiques_view(agent)}>
                            View
                            </Button>
                        </Group>
                        </Card>
                    </Group>
                    ))}
                </Stack>
                )}

                {/* Agent Critique Thoughts */}
                {show_critique_thoughts && (
                <Stack spacing="md" mt={"md"}>
                    {agents.map((agent) => (
                    <Group key={agent._id} align="flex-start" style={{ width: "100%" }}>
                        <Card
                        shadow="sm"
                        padding="md"
                        radius="md"
                        withBorder
                        style={{ backgroundColor: "#242424" }}
                        >
                        <div style={{ padding: "10px" }}>
                            <Group gap="xs" align="center">
                            <Title order={4} style={{ color: "white", margin: 0 }}>
                                {agent.agent_name}
                            </Title>
                            </Group>
                        </div>

                        <Divider my="sm" mt={1} />

                        <div
                            style={{
                            backgroundColor: "#2d2d2d",
                            borderRadius: "8px",
                            padding: "16px",
                            color: "#fff",
                            maxHeight: "150px",
                            overflowY: "auto",
                            }}
                        >
                            <ReactMarkdown
                            children={agent_critique_thoughts[agent._id]}
                            components={{
                                p: ({ node, ...props }) => (
                                <p
                                    style={{ fontSize: "16px", marginBottom: "0.75em" }}
                                    {...props}
                                />
                                ),
                            }}
                            />
                        </div>

                        <Group justify="space-between" style={{ marginTop: "10px" }}>
                            <Button size="sm" variant="light" onClick={() => handle_agent_critique_thoughts_view(agent)}>
                            View
                            </Button>
                        </Group>
                        </Card>
                    </Group>
                    ))}
                </Stack>
                )}
            </>
            ) : (
            <Center h={150}>
                Click on a specific chapter to view its agent history!
            </Center>
            )}
        </Container>
        </>
    );
}

export default STORY_AGENT_HISTORY;
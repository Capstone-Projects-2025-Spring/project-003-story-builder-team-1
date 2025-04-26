import { useState } from 'react';
import { CloseButton, Combobox, Input, InputBase, useCombobox, Paper, Button, Stack, Group, Title } from "@mantine/core";
import { USE_USER } from '../context/USER_CONTEXT';
import { useNavigate } from 'react-router';

function AGENT_SELECTION() {
    const { agent_list } = USE_USER();
    const navigate = useNavigate();

    // Pre-create 5 stores at the top level
    const comboboxStores = [
        useCombobox(),
        useCombobox(),
        useCombobox(),
        useCombobox(),
        useCombobox()
    ];

    const [selected_agents, set_selected_agents] = useState([null, null]); // Start with 1

    const handle_confirm = () => {
        console.log("Agents Confirmed:", selected_agents);
        navigate("/prompt", { state: { selected_agents } });
    };

    const handle_agent_change = (index, value) => {
        const new_selected_agents = [...selected_agents];
        new_selected_agents[index] = value;
        set_selected_agents(new_selected_agents);
    };

    const handle_add_agent = () => {
        if (selected_agents.length < 5) {
            set_selected_agents([...selected_agents, null]);
        }
    };

    const handle_remove_agent = () => {
        if (selected_agents.length > 2) {
            set_selected_agents(selected_agents.slice(0, -1));
        }
    };

    const get_options = (index) => {
        return agent_list.map((agent) => (
            <Combobox.Option value={agent.name} key={`${agent._id}-${index}`}>
                {agent.name}
            </Combobox.Option>
        ));
    };

    const all_agents_selected = selected_agents.every((agent) => agent !== null && agent !== '');

    return (
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <Stack spacing="xl">
            <Title order={2} ta="center" mb="sm">
            Select Up To 5 Agent Personas:
            </Title>
                {selected_agents.map((value, index) => {
                    const store = comboboxStores[index];

                    return (
                        <Combobox
                            key={index}
                            store={store}
                            withinPortal={false}
                            onOptionSubmit={(val) => {
                                handle_agent_change(index, val);
                                store.closeDropdown();
                            }}
                        >
                            <Combobox.Target>
                                <InputBase
                                    component="button"
                                    type="button"
                                    pointer
                                    rightSection={
                                        value !== null ? (
                                            <CloseButton
                                                size="sm"
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => handle_agent_change(index, null)}
                                                aria-label="Clear value"
                                            />
                                        ) : (
                                            <Combobox.Chevron />
                                        )
                                    }
                                    onClick={() => store.toggleDropdown()}
                                    rightSectionPointerEvents={value === null ? 'none' : 'all'}
                                >
                                    {value || <Input.Placeholder>Pick an agent</Input.Placeholder>}
                                </InputBase>
                            </Combobox.Target>
                            <Combobox.Dropdown>
                                <Combobox.Options>{get_options(index)}</Combobox.Options>
                            </Combobox.Dropdown>
                        </Combobox>
                    );
                })}

                <Group spacing="xs" grow>
                    <Button
                        onClick={handle_add_agent}
                        disabled={selected_agents.length >= 5}
                        variant="light"
                        color="green"
                    >
                        Add Agent
                    </Button>
                    <Button
                        onClick={handle_remove_agent}
                        disabled={selected_agents.length <= 1}
                        variant="light"
                        color="red"
                    >
                        Remove Agent
                    </Button>
                </Group>

                <Button
                    fullWidth
                    onClick={handle_confirm}
                    variant="filled"
                    color="blue"
                    disabled={!all_agents_selected}
                >
                    Confirm Agents
                </Button>
            </Stack>
        </Paper>
    );
}

export default AGENT_SELECTION;
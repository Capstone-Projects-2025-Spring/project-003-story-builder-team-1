import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppShell, Burger, Group, ScrollArea, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import '@mantine/core/styles.css';
import Story_Prompt_Box from './components/Story_Prompt_Box';
import Input_Text_Area from './components/Input_Text_Area';
import Chat_Area from './components/Chat_Area';
import Use_Messages from './hooks/Use_Messages';
import Side_Button from './components/Side_Button';

function App() {
  const [opened, { toggle }] = useDisclosure();
  const { messages, Send_Message } = Use_Messages();
  
  return (
    <AppShell
      layout="alt"
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      aside={{ width: 300, breakpoint: 'md', collapsed: { desktop: false, mobile: true } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" position="apart">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group style={{ flex: 1, justifyContent: 'center' }}>
            <img src="/logo.png" alt="Logo"></img>
            <Title order={2}>StoryBuilderAI</Title>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">

      </AppShell.Navbar>
      <AppShell.Main>
        <Story_Prompt_Box/>
      </AppShell.Main>
      <AppShell.Aside p="md">

      </AppShell.Aside>
    </AppShell>
  );
}

export default App;

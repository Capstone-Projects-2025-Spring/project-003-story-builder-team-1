import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppShell, Burger, Group, ScrollArea, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import '@mantine/core/styles.css';
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
      navbar={{ width: 350, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      aside={{ width: 350, breakpoint: 'md', collapsed: { desktop: false, mobile: true } }}
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
        <AppShell.Section>
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm"/>
            <Text>Navbar Header</Text>
          </Group>
        </AppShell.Section>
        <AppShell.Section grow my="md" component={ScrollArea}>
          <Group direction="column" spacing="sm">
          {Array(12)
            .fill(0)
            .map((_, index) => (
              <Side_Button key={index} text="Story" onClick={() => console.log("Story Clicked")} h={28} mt="sm" />
            ))}
          </Group>
        </AppShell.Section>
        <AppShell.Section>
          <Group direction="column" spacing="sm">
            <Side_Button text="Agent Creation" onClick={() => console.log("Clicked Agent Creation")} />
            <Side_Button text="Agent Selection" onClick={() => console.log("Clicked Agent Selection")} />
          </Group>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main style={{ display: 'flex', flexDirection: 'column', height: "100vh" }}>
        <Chat_Area messages={messages}/>
        <Input_Text_Area onSend={Send_Message}/>
      </AppShell.Main>
      <AppShell.Aside p="md">Aside</AppShell.Aside>
    </AppShell>
  );
}

export default App;

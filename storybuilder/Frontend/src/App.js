import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppShell, Burger, Group, Skeleton, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import '@mantine/core/styles.css';
import Input_Text_Area from './components/Input_Text_Area';
import Chat_Area from './components/Chat_Area';
import Use_Messages from './hooks/Use_Messages';

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
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <img src="/logo.png" alt="Logo"></img><span className="logo-name">StoryBuilderAI</span>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <Group>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Text>Navbar</Text>
        </Group>
        {Array(15)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} h={28} mt="sm" animate={false} />
          ))}
      </AppShell.Navbar>
      <AppShell.Main style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 2rem)' }}>
        <Chat_Area messages={messages}/>
        <Input_Text_Area onSend={Send_Message}/>
      </AppShell.Main>
      <AppShell.Aside p="md">Aside</AppShell.Aside>
    </AppShell>
  );
}

export default App;

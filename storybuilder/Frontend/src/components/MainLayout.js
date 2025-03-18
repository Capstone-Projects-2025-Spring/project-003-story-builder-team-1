import { AppShell, Burger, Group, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import STORY_LIST from './STORY_LIST';

function MainLayout({ children }) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
        layout="main"
        header={{ height: 60 }}
        navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
        aside={{ width: 300, breakpoint: 'md', collapsed: { desktop: false, mobile: true } }}
        padding="md"
    >
        {/* Header */}
        <AppShell.Header>
        <Group h="100%" px="md" position="apart">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Group style={{ flex: 1, justifyContent: 'center' }}>
                <img src="/logo.png" alt="Logo" />
                <Title order={2} style={{ color: 'white' }}>StoryBuilderAI</Title>
            </Group>
        </Group>
        </AppShell.Header>

        {/* Navbar */}
        <AppShell.Navbar p="md">
        <STORY_LIST />
        </AppShell.Navbar>

        {/* Main Content */}
        <AppShell.Main style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: "70%" }}>{children}</div>
        </AppShell.Main>

        {/* Aside */}
        <AppShell.Aside p="md">
        
        </AppShell.Aside>
    </AppShell>
  );
}

export default MainLayout;
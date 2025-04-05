import { AppShell, Group, Title } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router';
import STORY_LIST from './STORY_LIST';
import CHAPTER_LIST from './CHAPTER_LIST';

function MAIN_LAYOUT({ children }) {
    const location = useLocation();
    const navigate = useNavigate();

    const should_render_chapter_list = location.pathname.includes('/story') && !location.pathname.includes('/agents');

    function handle_logo_click() {
        navigate('/');
    }

    return (
        <AppShell
            layout="main"
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: false } }}
            aside={{ width: 300, breakpoint: 'md', collapsed: { desktop: false, mobile: true } }}
            padding="md"
        >
            {/* Header */}
            <AppShell.Header>
            <Group h="100%" px="md" position="apart">
                <Group style={{ flex: 1, justifyContent: 'center', cursor: 'pointer' }} onClick={handle_logo_click}>
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
                {/* Only render chapter list if on story route*/}
                {should_render_chapter_list && (
                    <CHAPTER_LIST/>
                    )}
            </AppShell.Aside>
        </AppShell>
    );
}

export default MAIN_LAYOUT;
import { AppShell, Group, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { useLocation } from 'react-router';
import STORY_LIST from './STORY_LIST';
import CHAPTER_LIST from './CHAPTER_LIST';

// Mock data for chapters
const mockChapters = [
    { id: 1, title: "Chapter 1: A New Journey", text: "Once upon a time, in a land far away..." },
    { id: 2, title: "Chapter 2: The First Challenge", text: "The hero faced a mighty beast in the forest..." },
    { id: 3, title: "Chapter 3: An Unexpected Ally", text: "A mysterious stranger appeared, offering guidance..." },
    { id: 4, title: "Chapter 4: The Darkest Hour", text: "The hero ventured into the dark cave, facing danger..." },
    { id: 5, title: "Chapter 5: The Final Battle", text: "The hero fought valiantly against the ultimate foe..." }
];

function MAIN_LAYOUT({ children }) {
    const [opened, { toggle }] = useDisclosure();
    const location = useLocation();
    const [selected_chapter, set_selected_chapter] = useState(null);

    const should_render_chapter_list = location.pathname.includes('/story') && !location.pathname.includes('/agents');

    const on_select_chapter = (chapter) => {
        set_selected_chapter(chapter);
    };

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
                {/* Only render chapter list if on story route*/}
                {should_render_chapter_list && (
                    <CHAPTER_LIST/>
                    )}
            </AppShell.Aside>
        </AppShell>
    );
}

export default MAIN_LAYOUT;
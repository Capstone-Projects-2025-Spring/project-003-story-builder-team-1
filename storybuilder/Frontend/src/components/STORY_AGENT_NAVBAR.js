import React from 'react';
import { LinksGroup } from '../NavbarLinksGroup/NavbarLinksGroup';
import { ScrollArea } from '@mantine/core'
import classes from './STORY_AGENT_NAVBAR.module.css';

const story = [
    {
        label: "Story 1",
        links: [
            {label: "View Story"},
            {label: "Agents"}
        ]
    }
];

function STORY_AGENT_NAVBAR() {
    const links = story.map((item) => <LinksGroup {...item} key={item.label} />);

    return (
        <ScrollArea className={classes.links}>
            <div className={classes.linksInner}>{links}</div>
        </ScrollArea>
    );
}

export default STORY_AGENT_NAVBAR;
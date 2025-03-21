import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MantineProvider } from '@mantine/core';
import {story_provider} from './context/STORY_CONTEXT';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <MantineProvider theme={{colorScheme: 'dark'}} defaultColorScheme="dark" withGlobalStyles withNormalizeCSS>
        <story_provider>
            <App />
        </story_provider>
    </MantineProvider>
);
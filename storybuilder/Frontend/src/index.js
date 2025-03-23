import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MantineProvider } from '@mantine/core';
import {Story_Provider} from './context/STORY_CONTEXT';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <MantineProvider theme={{colorScheme: 'dark'}} defaultColorScheme="dark" withGlobalStyles withNormalizeCSS>
        <Story_Provider>
            <App />
        </Story_Provider>
    </MantineProvider>
);
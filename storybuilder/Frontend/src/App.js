import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MAIN_LAYOUT from './components/MAIN_LAYOUT';
import STORY_PROMPT_BOX from './components/STORY_PROMPT_BOX';
import STORY_VIEW from './components/STORY_VIEW';
import STORY_AGENTS_VIEW from './components/STORY_AGENTS_VIEW';
import CHAPTER_VIEW from './components/CHAPTER_VIEW';
import LOGIN from './components/LOGIN';
import CREATE_ACCOUNT from './components/CREATE_ACCOUNT';
import '@mantine/core/styles.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LOGIN/>} />
        <Route path="/account_creation" element={<CREATE_ACCOUNT/>} />
        <Route path="/home" element={<MAIN_LAYOUT><STORY_PROMPT_BOX /></MAIN_LAYOUT>} />
        <Route path="/story/:story_id/view" element={<MAIN_LAYOUT><STORY_VIEW /></MAIN_LAYOUT>} />
        <Route path="/story/:story_id/view/:chapter_id" element={<MAIN_LAYOUT><CHAPTER_VIEW /></MAIN_LAYOUT>} />
        <Route path="/story/:story_id/agents" element={<MAIN_LAYOUT><STORY_AGENTS_VIEW /></MAIN_LAYOUT>} />
      </Routes>
    </Router>
  );
}

export default App;

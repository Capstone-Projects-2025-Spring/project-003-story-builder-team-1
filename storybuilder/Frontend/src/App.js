import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import STORY_PROMPT_BOX from './components/STORY_PROMPT_BOX';
import STORY_VIEW from './components/STORY_VIEW';
import STORY_AGENTS_VIEW from './components/STORY_AGENTS_VIEW';
import '@mantine/core/styles.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout><STORY_PROMPT_BOX /></MainLayout>} />
        <Route path="/story/:id/view" element={<MainLayout><STORY_VIEW /></MainLayout>} />
        <Route path="/story/:id/agents" element={<MainLayout><STORY_AGENTS_VIEW /></MainLayout>} />
      </Routes>
    </Router>
  );
}

export default App;

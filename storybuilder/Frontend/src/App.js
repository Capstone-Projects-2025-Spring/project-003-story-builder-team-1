import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MAIN_LAYOUT from './components/MAIN_LAYOUT';
import STORY_PROMPT_BOX from './components/STORY_PROMPT_BOX';
import STORY_VIEW from './components/STORY_VIEW';
import STORY_AGENTS_VIEW from './components/STORY_AGENTS_VIEW';
import CHAPTER_VIEW from './components/CHAPTER_VIEW';
import LOGIN from './components/LOGIN';
import CREATE_ACCOUNT from './components/CREATE_ACCOUNT';
import HOME from './components/HOME';
import BEST_RESPONSE from './components/BEST_RESPONSE';
import { AUTH_PROVIDER } from './context/AUTH_CONTEXT';
import PROTECTED_ROUTE from './components/PROTECTED_ROUTE';
import { USER_PROVIDER } from './context/USER_CONTEXT';
import AGENT_SELECTION from './components/AGENT_SELECTION';
import { STORY_PROVIDER } from './context/STORY_CONTEXT';
import STORY_AGENT_HISTORY from './components/STORY_AGENT_HISTORY';
import '@mantine/core/styles.css';

function App() {
  return (
    <AUTH_PROVIDER>
    <USER_PROVIDER>
    <STORY_PROVIDER>
    <Router>
      <Routes>
        <Route path="/" element={<LOGIN/>} />
        <Route path="/account_creation" element={<CREATE_ACCOUNT/>} />
        <Route path="/home" element={<PROTECTED_ROUTE><MAIN_LAYOUT><HOME /></MAIN_LAYOUT></PROTECTED_ROUTE>} />   {/* testing the protected routes */}
        <Route path="/agent_selection" element={<PROTECTED_ROUTE><MAIN_LAYOUT><AGENT_SELECTION /></MAIN_LAYOUT></PROTECTED_ROUTE>} />
        <Route path="/prompt" element={<PROTECTED_ROUTE><MAIN_LAYOUT><STORY_PROMPT_BOX /></MAIN_LAYOUT></PROTECTED_ROUTE>} />
        <Route path="/story/:story_id/best_response" element={<PROTECTED_ROUTE><MAIN_LAYOUT><BEST_RESPONSE /></MAIN_LAYOUT></PROTECTED_ROUTE>} />
        <Route path="/story/:story_id/agent_history" element={<PROTECTED_ROUTE><MAIN_LAYOUT><STORY_AGENT_HISTORY/></MAIN_LAYOUT></PROTECTED_ROUTE>} />
        <Route path="/story/:story_id/view" element={<PROTECTED_ROUTE><MAIN_LAYOUT><STORY_VIEW /></MAIN_LAYOUT></PROTECTED_ROUTE>} />
        <Route path="/story/:story_id/view/:chapter_id" element={<PROTECTED_ROUTE><MAIN_LAYOUT><CHAPTER_VIEW /></MAIN_LAYOUT></PROTECTED_ROUTE>} />
        <Route path="/story/:story_id/agents" element={<PROTECTED_ROUTE><MAIN_LAYOUT><STORY_AGENTS_VIEW /></MAIN_LAYOUT></PROTECTED_ROUTE>} />
      </Routes>
    </Router>
    </STORY_PROVIDER>
    </USER_PROVIDER>
    </AUTH_PROVIDER>
  );
}

export default App;

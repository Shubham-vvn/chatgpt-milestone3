import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatScreen } from './components/ChatScreen';
import { ReviewerSandbox } from './components/ReviewerSandbox';
import { PERSONAS } from './data/personas';
import { SEED_CONVERSATIONS } from './data/seedConversations';

export function App() {
  const [theme, setTheme] = useState('dark');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePersonaKey, setActivePersonaKey] = useState('student');

  // Voice Discovery State (Simulates First-Time vs Returning User)
  const [hasUsedVoice, setHasUsedVoice] = useState(() => {
    return localStorage.getItem('hasUsedVoice') === 'true';
  });
  const [onOpenDismissed, setOnOpenDismissed] = useState(false);
  const [contextualDismissed, setContextualDismissed] = useState(false);

  // Chat and draft states
  const [messages, setMessages] = useState(() => SEED_CONVERSATIONS.student);
  const [draftText, setDraftText] = useState('');

  // Synchronize theme with document data attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const activePersona = PERSONAS[activePersonaKey] || PERSONAS.student;

  // Toggle Theme
  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Switch Persona from Sandbox or Menu
  const handleSelectPersona = (key) => {
    setActivePersonaKey(key);
    setMessages(SEED_CONVERSATIONS[key] || []);
    setDraftText('');
    setContextualDismissed(false);
  };

  // Reviewer Sandbox: First-time vs Returning user simulation
  const handleToggleFirstTime = (isReturning) => {
    setHasUsedVoice(isReturning);
    localStorage.setItem('hasUsedVoice', isReturning ? 'true' : 'false');
    if (!isReturning) {
      setOnOpenDismissed(false);
      setContextualDismissed(false);
    }
  };

  // Reviewer Sandbox: Auto-fill 15+ words
  const handleAutoFillFifteenWords = () => {
    const sample = activePersona.fifteenWordSample;
    setDraftText(sample);
    setContextualDismissed(false);
  };

  // Reviewer Sandbox: Force On-Open Nudge
  const handleForceOnOpenNudge = () => {
    setHasUsedVoice(false);
    setOnOpenDismissed(false);
    setDraftText('');
    localStorage.removeItem('hasUsedVoice');
  };

  // Reviewer Sandbox: Hard Reset All
  const handleResetAll = () => {
    localStorage.clear();
    setHasUsedVoice(false);
    setOnOpenDismissed(false);
    setContextualDismissed(false);
    setDraftText('');
    setMessages(SEED_CONVERSATIONS[activePersonaKey] || []);
  };

  // New Chat
  const handleNewChat = () => {
    setMessages([]);
    setDraftText('');
    setContextualDismissed(false);
  };

  return (
    <div className="app-container">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activePersona={activePersona}
        onNewChat={handleNewChat}
      />

      <ChatScreen
        activePersona={activePersona}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        messages={messages}
        setMessages={setMessages}
        hasUsedVoice={hasUsedVoice}
        setHasUsedVoice={setHasUsedVoice}
        onOpenDismissed={onOpenDismissed}
        setOnOpenDismissed={setOnOpenDismissed}
        contextualDismissed={contextualDismissed}
        setContextualDismissed={setContextualDismissed}
        draftText={draftText}
        setDraftText={setDraftText}
      />

      <ReviewerSandbox
        activePersonaKey={activePersonaKey}
        onSelectPersona={handleSelectPersona}
        personas={PERSONAS}
        hasUsedVoice={hasUsedVoice}
        onToggleFirstTime={handleToggleFirstTime}
        onAutoFillFifteenWords={handleAutoFillFifteenWords}
        onForceOnOpenNudge={handleForceOnOpenNudge}
        onResetAll={handleResetAll}
      />
    </div>
  );
}

import React, { useState, useCallback, useRef } from 'react';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageComposer } from './MessageComposer';
import { VoiceActivationModal } from './VoiceActivationModal';
import { useSpeechEngine } from '../hooks/useSpeechEngine';

export function ChatScreen({
  activePersona,
  theme,
  onToggleTheme,
  onToggleSidebar,
  messages,
  setMessages,
  hasUsedVoice,
  setHasUsedVoice,
  onOpenDismissed,
  setOnOpenDismissed,
  contextualDismissed,
  setContextualDismissed,
  draftText,
  setDraftText
}) {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const abortControllerRef = useRef(null);

  const speechEngine = useSpeechEngine(activePersona?.simulatedVoiceScript);

  // Stream assistant AI reply via Server-Sent Events or deterministic client fallback
  const streamAssistantReply = useCallback(async (promptText, inputMethod) => {
    setIsGenerating(true);
    abortControllerRef.current = new AbortController();

    const assistantMsgId = `assistant-${Date.now()}`;
    const initialAssistantMsg = {
      id: assistantMsgId,
      sender: 'assistant',
      text: '',
      inputMethod: 'text',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, initialAssistantMsg]);

    const fallbackResponse = inputMethod === 'voice'
      ? `Received your voice prompt: "${promptText}"\n\n1. **Speed Advantage:** Dictating prompts allows you to convey nuance 3x faster than typing.\n2. **Immediate Review:** Spoken thoughts are converted into actionable text for verification.\n3. **Follow-up:** How would you like to build on this?`
      : `Thanks for your message: "${promptText}"\n\nI have processed your query. If you ever have a longer question or complex study topic, remember that voice input is available right in the composer!`;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          persona: activePersona?.id,
          inputMethod
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok || !response.body) {
        throw new Error('API unavailable, running offline streamer');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();
            if (dataStr === '[DONE]') break;
            try {
              const data = JSON.parse(dataStr);
              if (data.token) {
                accumulatedText += data.token;
                setMessages(prev => prev.map(m => m.id === assistantMsgId ? { ...m, text: accumulatedText } : m));
              }
            } catch (err) {
              // Ignore parse errors on split chunks
            }
          }
        }
      }
    } catch (err) {
      // Offline fallback: smooth client-side token-by-token streaming
      const words = fallbackResponse.split(' ');
      let currentAcc = '';
      for (let i = 0; i < words.length; i++) {
        if (abortControllerRef.current?.signal.aborted) break;
        currentAcc += (i === 0 ? '' : ' ') + words[i];
        setMessages(prev => prev.map(m => m.id === assistantMsgId ? { ...m, text: currentAcc } : m));
        await new Promise(r => setTimeout(r, 35));
      }
    } finally {
      setIsGenerating(false);
    }
  }, [activePersona, setMessages]);

  // Handle standard typed send
  const handleSendText = useCallback((text) => {
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      inputMethod: 'text',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    streamAssistantReply(text, 'text');
  }, [setMessages, streamAssistantReply]);

  // Handle voice prompt completion
  const handleVoiceSubmit = useCallback((spokenText) => {
    // Mark user as having successfully used voice!
    setHasUsedVoice(true);
    localStorage.setItem('hasUsedVoice', 'true');

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: spokenText,
      inputMethod: 'voice',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    streamAssistantReply(spokenText, 'voice');
  }, [setHasUsedVoice, setMessages, streamAssistantReply]);

  return (
    <main className="chat-viewport">
      <ChatHeader
        onToggleSidebar={onToggleSidebar}
        activePersona={activePersona}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      <MessageList
        messages={messages}
        isGenerating={isGenerating}
        activePersona={activePersona}
        onSelectSuggestion={(query) => setDraftText(query)}
      />

      <MessageComposer
        draftText={draftText}
        setDraftText={setDraftText}
        onSendText={handleSendText}
        onOpenVoice={() => setIsVoiceModalOpen(true)}
        hasUsedVoice={hasUsedVoice}
        onOpenDismissed={onOpenDismissed}
        setOnOpenDismissed={setOnOpenDismissed}
        contextualDismissed={contextualDismissed}
        setContextualDismissed={setContextualDismissed}
        isGenerating={isGenerating}
      />

      <VoiceActivationModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSubmit={handleVoiceSubmit}
        activePersona={activePersona}
        speechEngine={speechEngine}
      />
    </main>
  );
}

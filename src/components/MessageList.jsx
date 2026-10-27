import React, { useEffect, useRef } from 'react';
import { MessageItem } from './MessageItem';

export function MessageList({
  messages,
  isGenerating,
  activePersona,
  onSelectSuggestion
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  return (
    <div className="messages-scroll-area">
      <div className="messages-inner-container">
        {messages.length === 0 ? (
          <div className="empty-chat-hero">
            <div className="hero-logo">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
              </svg>
            </div>
            <h1 className="hero-title">What can I help with today?</h1>
            <p className="hero-subtitle">
              Hello, {activePersona?.name}! Ask a question by typing or tap the microphone to speak hands-free.
            </p>

            {activePersona?.suggestedQuery && (
              <button
                type="button"
                className="thread-item"
                style={{
                  marginTop: 14,
                  maxWidth: 520,
                  textAlign: 'left',
                  border: '1px solid var(--border-medium)',
                  padding: '10px 14px'
                }}
                onClick={() => onSelectSuggestion(activePersona.suggestedQuery)}
              >
                <span>💡 Try asking: "{activePersona.suggestedQuery}"</span>
              </button>
            )}
          </div>
        ) : (
          messages.map((msg, index) => (
            <MessageItem
              key={msg.id || index}
              message={msg}
              isStreaming={isGenerating && index === messages.length - 1 && msg.sender === 'assistant'}
            />
          ))
        )}
        <div ref={bottomRef} style={{ height: 1 }} />
      </div>
    </div>
  );
}

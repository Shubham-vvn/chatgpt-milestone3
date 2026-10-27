import React from 'react';
import { Mic } from 'lucide-react';

export function MessageItem({ message, isStreaming = false }) {
  const isUser = message.sender === 'user';
  const isVoice = message.inputMethod === 'voice';

  return (
    <div className={`message-row ${isUser ? 'user' : 'assistant'}`}>
      {!isUser && (
        <div className="message-avatar assistant" title="ChatGPT">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
          </svg>
        </div>
      )}

      <div className="message-body">
        {isUser && isVoice && (
          <span className="voice-source-badge">
            <Mic size={11} /> Spoken via Voice
          </span>
        )}

        <div className="message-bubble">
          {message.text}
          {isStreaming && <span className="streaming-cursor" />}
        </div>
      </div>

      {isUser && (
        <div className="message-avatar user" title="You">
          U
        </div>
      )}
    </div>
  );
}

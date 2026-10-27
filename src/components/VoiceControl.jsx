import React from 'react';
import { Mic } from 'lucide-react';

export function VoiceControl({ isPulsing = false, onClick, disabled = false }) {
  return (
    <button
      type="button"
      className={`voice-mic-btn ${isPulsing ? 'pulsing' : ''}`}
      onClick={onClick}
      disabled={disabled}
      title="Try talking instead — tap to start voice input"
      aria-label="Activate Voice Input"
    >
      <Mic size={19} />
    </button>
  );
}

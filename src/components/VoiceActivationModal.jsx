import React, { useEffect, useState, useRef } from 'react';
import { X, Check, Mic, Sparkles, RefreshCw, Volume2 } from 'lucide-react';
import { AudioWaveform } from './AudioWaveform';

export function VoiceActivationModal({
  isOpen,
  onClose,
  onSubmit,
  activePersona,
  speechEngine
}) {
  const {
    isListening,
    transcript,
    interimTranscript,
    fullTranscript,
    isSimulated,
    audioLevel,
    duration,
    micPermission,
    startListening,
    stopListening,
    cancelListening,
    toggleDemoMode
  } = speechEngine;

  const [editableText, setEditableText] = useState('');
  const wasOpenRef = useRef(false);

  // When modal opens, trigger startListening ONCE
  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      wasOpenRef.current = true;
      setEditableText('');
      startListening(activePersona?.simulatedVoiceScript);
    } else if (!isOpen && wasOpenRef.current) {
      wasOpenRef.current = false;
      cancelListening();
    }
  }, [isOpen, activePersona, startListening, cancelListening]);

  // Keep editableText synced with incoming speech until user manually edits
  useEffect(() => {
    if (fullTranscript) {
      setEditableText(fullTranscript);
    }
  }, [fullTranscript]);

  if (!isOpen) return null;

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCancel = () => {
    cancelListening();
    onClose();
  };

  const handleSubmit = () => {
    const textToSend = editableText.trim() || fullTranscript || activePersona?.simulatedVoiceScript;
    if (textToSend) {
      onSubmit(textToSend);
    }
    stopListening();
    onClose();
  };

  const handleUseSampleScript = () => {
    toggleDemoMode(activePersona?.simulatedVoiceScript);
  };

  const handleRetryMic = () => {
    startListening();
  };

  return (
    <div className="voice-modal-backdrop" role="dialog" aria-modal="true" aria-label="ChatGPT Voice Mode">
      {/* Top Header Bar */}
      <div className="voice-modal-header">
        <div className="voice-status-pill">
          <span
            className="voice-status-dot"
            style={{
              backgroundColor: isSimulated ? '#f59e0b' : '#ef4444',
              boxShadow: isSimulated ? '0 0 10px rgba(245, 158, 11, 0.6)' : '0 0 10px rgba(239, 68, 68, 0.6)'
            }}
          />
          <span>
            {isSimulated ? 'Demo Voice' : 'Live Mic'} • {formatDuration(duration)}
          </span>
        </div>

        {/* Switch Mode Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            className="sandbox-btn"
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              borderColor: isSimulated ? 'var(--brand-green)' : 'var(--border-medium)'
            }}
            onClick={isSimulated ? handleRetryMic : handleUseSampleScript}
            title={isSimulated ? 'Switch to real microphone' : 'Simulate voice with sample prompt'}
          >
            {isSimulated ? (
              <>
                <Mic size={13} /> Switch to Live Mic
              </>
            ) : (
              <>
                <Sparkles size={13} /> Test with Sample Voice
              </>
            )}
          </button>

          <button
            className="nudge-dismiss-btn"
            onClick={handleCancel}
            title="Cancel voice mode (Esc)"
            aria-label="Close voice mode"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Center Visualizer & Live Transcript Area */}
      <div className="voice-modal-center">
        {/* Dynamic Waveform Visualizer */}
        <AudioWaveform audioLevel={audioLevel} isListening={isListening} />

        {/* Live / Editable Transcript Area */}
        <div className="live-transcript-box" style={{ width: '100%', maxWidth: 580 }}>
          {editableText || interimTranscript ? (
            <div style={{ width: '100%' }}>
              <textarea
                className="composer-textarea"
                style={{
                  width: '100%',
                  textAlign: 'center',
                  fontSize: '18px',
                  fontWeight: 500,
                  lineHeight: 1.5,
                  minHeight: '60px',
                  borderBottom: '1px dashed var(--border-medium)',
                  paddingBottom: '8px'
                }}
                value={editableText + (interimTranscript && !editableText.endsWith(interimTranscript) ? ' ' + interimTranscript : '')}
                onChange={(e) => setEditableText(e.target.value)}
                placeholder="Spoken words appear here..."
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: 4 }}>
                ✏️ Live transcript is editable before sending
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <p className="transcript-placeholder" style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>
                {isSimulated
                  ? 'Streaming sample voice prompt...'
                  : 'Listening... Speak into your microphone'}
              </p>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {isSimulated ? 'Demonstration mode active' : 'Speak clearly or tap "Test with Sample Voice"'}
              </span>
            </div>
          )}
        </div>

        {/* Quick Sample Query Chip */}
        {activePersona?.simulatedVoiceScript && (
          <button
            type="button"
            className="thread-item"
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              borderRadius: '9999px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              maxWidth: 520,
              whiteSpace: 'normal',
              textAlign: 'center'
            }}
            onClick={() => handleUseSampleScript()}
            title="Click to auto-speak this persona question"
          >
            <span>💡 Sample: "{activePersona.simulatedVoiceScript}"</span>
          </button>
        )}
      </div>

      {/* Bottom Action Controls */}
      <div className="voice-modal-controls">
        <button
          type="button"
          className="voice-action-btn cancel"
          onClick={handleCancel}
          title="Discard voice prompt and keep your original text draft"
        >
          <X size={18} />
          <span>Cancel</span>
        </button>

        <button
          type="button"
          className="voice-action-btn submit"
          onClick={handleSubmit}
          title="Send transcribed prompt to ChatGPT"
        >
          <Check size={18} />
          <span>Send Spoken Prompt</span>
        </button>
      </div>
    </div>
  );
}

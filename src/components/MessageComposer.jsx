import React, { useRef, useEffect } from 'react';
import { ArrowUp, Paperclip } from 'lucide-react';
import { VoiceControl } from './VoiceControl';
import { OnOpenNudge } from './OnOpenNudge';
import { ContextualNudge } from './ContextualNudge';
import { useWordCounter } from '../hooks/useWordCounter';

export function MessageComposer({
  draftText,
  setDraftText,
  onSendText,
  onOpenVoice,
  hasUsedVoice,
  onOpenDismissed,
  setOnOpenDismissed,
  contextualDismissed,
  setContextualDismissed,
  isGenerating
}) {
  const textareaRef = useRef(null);
  const { wordCount, isThresholdMet } = useWordCounter(draftText, 15);

  // Auto-resize textarea height to fit content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`;
  }, [draftText]);

  // Determine Nudge Visibility
  // On-Open Nudge: User has never used voice, nudge not dismissed, and user hasn't typed a long draft yet
  const showOnOpen = !hasUsedVoice && !onOpenDismissed && wordCount < 5;

  // Contextual Nudge: User typed >= 15 words, not dismissed for this draft, takes priority
  const showContextual = isThresholdMet && !contextualDismissed;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!draftText.trim() || isGenerating) return;
    onSendText(draftText.trim());
    setDraftText('');
    setContextualDismissed(false); // Reset dismissal for next fresh draft
  };

  const handleVoiceActivation = () => {
    onOpenVoice();
  };

  return (
    <div className="composer-fixed-bottom">
      <div className="composer-tray">
        {/* Solution A: Proactive On-Open Nudge */}
        <OnOpenNudge
          isVisible={showOnOpen && !showContextual}
          onActivate={handleVoiceActivation}
          onDismiss={() => setOnOpenDismissed(true)}
        />

        {/* Solution B: Contextual 15-Word Nudge */}
        <ContextualNudge
          isVisible={showContextual}
          wordCount={wordCount}
          onActivate={handleVoiceActivation}
          onDismiss={() => setContextualDismissed(true)}
        />

        {/* Input Card Container */}
        <div className="composer-input-card">
          <button
            type="button"
            className="sidebar-toggle-btn"
            style={{ padding: 6 }}
            title="Attach files (Simulated)"
            aria-label="Attach files"
          >
            <Paperclip size={18} />
          </button>

          <textarea
            ref={textareaRef}
            className="composer-textarea"
            placeholder="Message ChatGPT..."
            rows={1}
            value={draftText}
            onChange={(e) => {
              setDraftText(e.target.value);
              // If draft is completely erased, reset contextual dismissal
              if (!e.target.value.trim()) {
                setContextualDismissed(false);
              }
            }}
            onKeyDown={handleKeyDown}
            disabled={isGenerating}
          />

          <div className="composer-actions-right">
            {/* Pulsing Voice Control */}
            <VoiceControl
              isPulsing={showOnOpen || showContextual}
              onClick={handleVoiceActivation}
              disabled={isGenerating}
            />

            {/* Send Button */}
            <button
              type="button"
              className="send-btn"
              onClick={handleSend}
              disabled={!draftText.trim() || isGenerating}
              title="Send message"
              aria-label="Send message"
            >
              <ArrowUp size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <p className="composer-caption">
          ChatGPT can make mistakes. Verify important info. Try voice input for 3x faster prompts.
        </p>
      </div>
    </div>
  );
}

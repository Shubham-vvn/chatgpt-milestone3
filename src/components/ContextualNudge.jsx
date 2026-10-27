import React from 'react';
import { Zap, X } from 'lucide-react';

export function ContextualNudge({ isVisible, wordCount, onActivate, onDismiss }) {
  if (!isVisible) return null;

  const handleDismiss = (e) => {
    e.stopPropagation();
    onDismiss();
  };

  return (
    <div
      className="contextual-nudge-bubble"
      onClick={onActivate}
      role="tooltip"
      aria-live="polite"
      title="Click to speak your thoughts instead of typing"
    >
      <div className="nudge-badge-icon" style={{ background: '#f59e0b' }}>
        <Zap size={13} fill="currentColor" />
      </div>

      <span className="nudge-copy">
        Save time — try talking instead.
      </span>

      <button
        type="button"
        className="nudge-dismiss-btn"
        onClick={handleDismiss}
        aria-label="Dismiss contextual voice recommendation"
        title="Dismiss"
      >
        <X size={15} />
      </button>

      <div className="nudge-tail-anchor" style={{ right: 28 }} />
    </div>
  );
}

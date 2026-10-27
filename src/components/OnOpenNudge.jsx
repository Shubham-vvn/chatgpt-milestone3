import React from 'react';
import { Mic, X } from 'lucide-react';

export function OnOpenNudge({ isVisible, onActivate, onDismiss }) {
  if (!isVisible) return null;

  const handleDismiss = (e) => {
    e.stopPropagation();
    onDismiss();
  };

  return (
    <div
      className="on-open-nudge-bubble"
      onClick={onActivate}
      role="tooltip"
      aria-live="polite"
      title="Click to try voice input"
    >
      <div className="nudge-badge-icon">
        <Mic size={13} />
      </div>

      <span className="nudge-copy">
        Try talking instead — just tap and speak.
      </span>

      <button
        type="button"
        className="nudge-dismiss-btn"
        onClick={handleDismiss}
        aria-label="Dismiss voice recommendation"
        title="Dismiss"
      >
        <X size={15} />
      </button>

      <div className="nudge-tail-anchor" />
    </div>
  );
}

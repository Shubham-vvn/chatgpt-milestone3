import React, { useState } from 'react';
import { Sliders, RotateCcw, Sparkles, User, MessageCircle, X } from 'lucide-react';

export function ReviewerSandbox({
  activePersonaKey,
  onSelectPersona,
  personas,
  hasUsedVoice,
  onToggleFirstTime,
  onAutoFillFifteenWords,
  onForceOnOpenNudge,
  onResetAll
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="reviewer-sandbox-dock">
      {!isOpen ? (
        <button
          type="button"
          className="sandbox-toggle-btn"
          onClick={() => setIsOpen(true)}
          title="Open Reviewer & Demo Sandbox Controls"
        >
          <Sliders size={15} />
          <span>Reviewer Sandbox</span>
        </button>
      ) : (
        <div className="sandbox-panel" role="region" aria-label="Reviewer Controls">
          <div className="sandbox-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sliders size={14} /> Reviewer Sandbox
            </span>
            <button
              type="button"
              className="nudge-dismiss-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close sandbox"
            >
              <X size={15} />
            </button>
          </div>

          {/* Persona Switcher */}
          <div className="sandbox-section">
            <span className="sandbox-label">Active Persona</span>
            <div className="sandbox-btn-group" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
              {Object.keys(personas).map((key) => {
                const p = personas[key];
                return (
                  <button
                    key={key}
                    type="button"
                    className={`sandbox-btn ${activePersonaKey === key ? 'active' : ''}`}
                    onClick={() => onSelectPersona(key)}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* User History Status */}
          <div className="sandbox-section">
            <span className="sandbox-label">Voice History Status</span>
            <div className="sandbox-btn-group">
              <button
                type="button"
                className={`sandbox-btn ${!hasUsedVoice ? 'active' : ''}`}
                onClick={() => onToggleFirstTime(false)}
              >
                First-Time User
              </button>
              <button
                type="button"
                className={`sandbox-btn ${hasUsedVoice ? 'active' : ''}`}
                onClick={() => onToggleFirstTime(true)}
              >
                Returning User
              </button>
            </div>
          </div>

          {/* Quick Triggers */}
          <div className="sandbox-section">
            <span className="sandbox-label">Trigger Nudges (1-Click)</span>
            <button
              type="button"
              className="sandbox-btn action-primary"
              onClick={onAutoFillFifteenWords}
              title="Fills 16 words into the composer to immediately trigger the Contextual Nudge"
            >
              ⚡ Fill 15+ Words (Contextual Nudge)
            </button>

            <button
              type="button"
              className="sandbox-btn"
              onClick={onForceOnOpenNudge}
              title="Resets dismissal to test the On-Open Nudge"
              style={{ marginTop: 4 }}
            >
              🎙️ Force On-Open Nudge
            </button>
          </div>

          {/* Hard Reset */}
          <div className="sandbox-section" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 10 }}>
            <button
              type="button"
              className="sandbox-btn"
              onClick={onResetAll}
              style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
              title="Reset all states and local storage"
            >
              <RotateCcw size={12} style={{ display: 'inline', marginRight: 5 }} />
              Reset All Prototype State
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

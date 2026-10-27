import React from 'react';
import { Menu, Sparkles, Sun, Moon } from 'lucide-react';

export function ChatHeader({
  onToggleSidebar,
  activePersona,
  theme,
  onToggleTheme
}) {
  return (
    <header className="chat-header">
      <div className="header-left">
        <button
          type="button"
          className="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          title="Toggle sidebar"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        <div className="model-badge" title="ChatGPT Model">
          <span>ChatGPT</span>
          <span className="model-version">4o</span>
        </div>
      </div>

      <div className="header-right">
        {activePersona && (
          <div className="persona-tag" title={activePersona.description}>
            <Sparkles size={13} />
            <span>{activePersona.badge}</span>
          </div>
        )}

        <button
          type="button"
          className="sidebar-toggle-btn"
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}

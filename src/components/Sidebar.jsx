import React from 'react';
import { Plus, MessageSquare, PanelLeftClose } from 'lucide-react';

export function Sidebar({
  isOpen,
  onClose,
  activePersona,
  onNewChat
}) {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`} aria-label="Conversation history">
      <div className="sidebar-header">
        <button
          type="button"
          className="new-chat-btn"
          onClick={onNewChat}
          title="Start fresh conversation"
        >
          <Plus size={16} />
          <span>New chat</span>
        </button>

        <button
          type="button"
          className="sidebar-toggle-btn"
          onClick={onClose}
          title="Close sidebar"
          aria-label="Close sidebar"
          style={{ marginLeft: 8 }}
        >
          <PanelLeftClose size={18} />
        </button>
      </div>

      <div className="sidebar-threads">
        <div className="thread-section-label">Today</div>
        <div className="thread-item active">
          <MessageSquare size={14} style={{ marginRight: 8, flexShrink: 0 }} />
          <span className="thread-title">Voice Discovery Demo</span>
        </div>

        <div className="thread-section-label" style={{ marginTop: 12 }}>Previous 7 Days</div>
        <div className="thread-item">
          <MessageSquare size={14} style={{ marginRight: 8, flexShrink: 0 }} />
          <span className="thread-title">Sprint Planning Notes</span>
        </div>
        <div className="thread-item">
          <MessageSquare size={14} style={{ marginRight: 8, flexShrink: 0 }} />
          <span className="thread-title">Biology Exam Prep Flashcards</span>
        </div>
        <div className="thread-item">
          <MessageSquare size={14} style={{ marginRight: 8, flexShrink: 0 }} />
          <span className="thread-title">AI Marketing Strategy</span>
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="user-profile-badge">
          <div className="user-avatar">{activePersona?.avatar || 'U'}</div>
          <div className="user-info">
            <span className="user-name">{activePersona?.name || 'User'}</span>
            <span className="user-role">{activePersona?.role || 'Free Account'}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

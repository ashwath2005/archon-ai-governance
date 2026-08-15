import React from 'react';
import { Keyboard, X } from 'lucide-react';
import { Button } from './Button';

export const ShortcutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'J', desc: 'Navigate to Next Rubric Section' },
    { key: 'K', desc: 'Navigate to Previous Rubric Section' },
    { key: '1', desc: 'Select Decision [ YES ] for Active Criterion' },
    { key: '2', desc: 'Select Decision [ NO ] for Active Criterion' },
    { key: '3', desc: 'Select Decision [ DEFERRED ] for Active Criterion' },
    { key: '⌘ K / Ctrl K', desc: 'Open Command Palette' },
    { key: '?', desc: 'Toggle Keyboard Shortcuts Cheatsheet' },
    { key: 'ESC', desc: 'Close Active Modal / Overlay' }
  ];

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 200 }}>
      <div
        className="modal-content animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '480px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--archon-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Keyboard size={18} style={{ color: 'var(--archon-cyan)' }} />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--archon-text)' }}>
              KEYBOARD POWER SHORTCUTS
            </h3>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ padding: '4px' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          {shortcuts.map((sc, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                background: 'var(--archon-bg)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--archon-border)'
              }}
            >
              <span style={{ fontSize: '0.775rem', color: 'var(--archon-text-secondary)' }}>{sc.desc}</span>
              <kbd className="mono" style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'var(--archon-surface)', borderRadius: '4px', border: '1px solid var(--archon-border-hover)', color: 'var(--archon-cyan)', fontWeight: 700 }}>
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'right' }}>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

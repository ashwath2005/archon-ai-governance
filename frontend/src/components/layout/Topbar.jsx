import React, { useState, useEffect } from 'react';
import { CommandPalette } from './CommandPalette';
import { useAuth } from '../../context/AuthContext';
import { Plus, Search, ChevronRight, Cpu, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Topbar = () => {
  const { isIntern } = useAuth();
  const [cmdOpen, setCmdOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'ARCHON COMMAND CENTER';
    if (path.includes('/submissions/new')) return 'NEW ARCHITECTURE SUBMISSION';
    if (path.includes('/submissions/')) return 'WORKSTATION REVIEW';
    if (path.includes('/submissions')) return 'ARCHITECTURE REGISTRY';
    if (path.includes('/rubric')) return 'ARCHITECTURE STANDARD';
    if (path.includes('/analytics')) return 'GOVERNANCE INTELLIGENCE';
    return 'WORKSPACE';
  };

  return (
    <>
      <header className="topbar">
        {/* Monospace Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem' }}>
          <span className="mono" style={{ color: 'var(--archon-text-muted)', letterSpacing: '0.04em' }}>ARCHON OS</span>
          <ChevronRight size={12} style={{ color: 'var(--archon-text-muted)' }} />
          <span className="mono" style={{ fontWeight: 600, color: 'var(--archon-cyan)', letterSpacing: '0.04em' }}>{getBreadcrumb()}</span>
        </div>

        {/* Action Controls & AI Intelligence Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* AI Status Badge */}
          <div
            className="mono"
            style={{
              fontSize: '0.65rem',
              padding: '3px 8px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--archon-cyan-bg)',
              border: '1px solid var(--archon-cyan-border)',
              color: 'var(--archon-cyan)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={11} /> ARCHON AI ACTIVE
          </div>

          {/* Search Trigger */}
          <button
            onClick={() => setCmdOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ padding: '5px 10px', color: 'var(--archon-text-muted)', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}>
              <Search size={13} /> Quick Search...
            </span>
            <kbd className="mono" style={{ fontSize: '0.65rem', background: 'var(--archon-bg)', padding: '1px 4px', borderRadius: '3px', border: '1px solid var(--archon-border)', color: 'var(--archon-text-secondary)' }}>
              ⌘K
            </kbd>
          </button>

          {isIntern && (
            <Link to="/submissions/new" className="btn btn-primary btn-sm">
              <Plus size={13} /> Submit Architecture
            </Link>
          )}
        </div>
      </header>

      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
    </>
  );
};

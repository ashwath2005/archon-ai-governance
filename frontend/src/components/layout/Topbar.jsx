import React, { useState, useEffect } from 'react';
import { CommandPalette } from './CommandPalette';
import { useAuth } from '../../context/AuthContext';
import { Plus, Search, ChevronRight, Sparkles } from 'lucide-react';
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
    if (path.includes('/dashboard')) return 'Command Center';
    if (path.includes('/submissions/new')) return 'New Submission';
    if (path.includes('/submissions/')) return 'Workstation Review';
    if (path.includes('/submissions')) return 'Architecture Registry';
    if (path.includes('/rubric')) return 'Rubric Standard';
    if (path.includes('/analytics')) return 'Governance Intelligence';
    return 'Workspace';
  };

  return (
    <>
      <header className="topbar">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
          <span style={{ color: 'var(--archon-text-muted)', fontWeight: 500 }}>ARCHON</span>
          <ChevronRight size={13} style={{ color: 'var(--archon-text-muted)' }} />
          <span style={{ fontWeight: 600, color: 'var(--archon-text)' }}>{getBreadcrumb()}</span>
        </div>

        {/* Action Controls & AI Intelligence Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* AI Status Badge */}
          <span className="badge-premium badge-cyan" style={{ fontSize: '0.7rem' }}>
            <Sparkles size={12} /> AI Copilot Active
          </span>

          {/* Search Trigger */}
          <button
            onClick={() => setCmdOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              color: 'var(--archon-text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: '#0e0e11',
              borderColor: 'rgba(255, 255, 255, 0.08)'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem' }}>
              <Search size={13} /> Search...
            </span>
            <kbd style={{ fontSize: '0.68rem', background: 'rgba(255, 255, 255, 0.06)', padding: '1px 5px', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--archon-text-secondary)', fontFamily: 'var(--font-mono)' }}>
              ⌘K
            </kbd>
          </button>

          {isIntern && (
            <Link to="/submissions/new" className="btn btn-primary btn-sm" style={{ borderRadius: '8px', padding: '6px 12px' }}>
              <Plus size={13} /> Submit Architecture
            </Link>
          )}
        </div>
      </header>

      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
    </>
  );
};

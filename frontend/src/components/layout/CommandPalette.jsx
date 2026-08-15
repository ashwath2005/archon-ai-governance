import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, BarChart2, BookOpen, Download, LayoutDashboard, Sparkles, ArrowRight } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

export const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      return;
    }
    const fetchQuickList = async () => {
      try {
        const res = await axiosClient.get('/submissions?size=5');
        if (res.success) {
          setSubmissions(res.data.content || []);
        }
      } catch (err) {
        console.error('Command Palette fetch failed', err);
      }
    };
    fetchQuickList();
  }, [isOpen]);

  if (!isOpen) return null;

  const staticCommands = [
    { label: 'Go to Command Center', category: 'Navigation', icon: LayoutDashboard, action: () => navigate('/dashboard') },
    { label: 'Open Architecture Registry', category: 'Navigation', icon: FileText, action: () => navigate('/submissions') },
    { label: 'Governance Intelligence', category: 'Navigation', icon: BarChart2, action: () => navigate('/analytics') },
    { label: 'Explore Architecture Standard', category: 'Navigation', icon: BookOpen, action: () => navigate('/rubric') },
    {
      label: 'Export Submissions CSV Report',
      category: 'Actions',
      icon: Download,
      action: async () => {
        window.open('http://localhost:8080/api/submissions/export', '_blank');
      }
    }
  ];

  const filteredCommands = staticCommands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  const filteredSubmissions = submissions.filter((s) =>
    s.projectTitle.toLowerCase().includes(query.toLowerCase()) ||
    s.internName.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (action) => {
    action();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 200 }}>
      <div
        className="modal-content animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '560px',
          padding: 0,
          background: 'var(--archon-surface-elevated)',
          border: '1px solid var(--archon-border-subtle)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.9)'
        }}
      >
        {/* Input Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', borderBottom: '1px solid var(--archon-border)' }}>
          <Search size={16} style={{ color: 'var(--archon-cyan)' }} />
          <input
            autoFocus
            type="text"
            placeholder="Type to search projects, navigation, actions... (ESC to exit)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%',
              border: 'none',
              background: 'transparent',
              fontSize: '0.875rem',
              color: 'var(--archon-text)',
              outline: 'none'
            }}
          />
          <kbd className="mono" style={{ fontSize: '0.65rem', padding: '2px 5px', background: 'var(--archon-bg)', borderRadius: '3px', border: '1px solid var(--archon-border)', color: 'var(--archon-text-muted)' }}>
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '340px', overflowY: 'auto', padding: '8px' }}>
          {filteredCommands.length > 0 && (
            <div style={{ marginBottom: '10px' }}>
              <div className="mono" style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--archon-text-muted)', padding: '6px 10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                COMMANDS & NAVIGATION
              </div>
              {filteredCommands.map((cmd, i) => (
                <div
                  key={i}
                  onClick={() => handleSelect(cmd.action)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontSize: '0.825rem',
                    color: 'var(--archon-text)',
                    transition: 'background var(--motion-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--archon-surface-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <cmd.icon size={15} style={{ color: 'var(--archon-cyan)' }} />
                    <span>{cmd.label}</span>
                  </div>
                  <ArrowRight size={12} style={{ color: 'var(--archon-text-muted)' }} />
                </div>
              ))}
            </div>
          )}

          {filteredSubmissions.length > 0 && (
            <div>
              <div className="mono" style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--archon-text-muted)', padding: '6px 10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                PROJECT REGISTRY
              </div>
              {filteredSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => handleSelect(() => navigate(`/submissions/${sub.id}`))}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontSize: '0.825rem',
                    color: 'var(--archon-text)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--archon-surface-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{sub.projectTitle}</div>
                    <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--archon-text-muted)' }}>{sub.internName} • {sub.projectDomain}</div>
                  </div>
                  <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--archon-cyan)' }}>Open →</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

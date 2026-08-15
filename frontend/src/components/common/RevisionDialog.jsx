import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

export const RevisionDialog = ({ isOpen, onClose, onConfirm, submitting, reviewerNotes, setReviewerNotes }) => {
  const sections = [
    '0 · Decision Gate',
    '1 · RAG Architecture',
    '2 · Agentic AI',
    '3 · Fine-Tuning',
    '4 · Distillation',
    '5 · LLMOps'
  ];

  const [selectedSections, setSelectedSections] = useState([]);

  if (!isOpen) return null;

  const toggleSection = (sec) => {
    setSelectedSections((prev) =>
      prev.includes(sec) ? prev.filter((s) => s !== sec) : [...prev, sec]
    );
  };

  const handleSend = () => {
    const sectionPrefix = selectedSections.length > 0
      ? `[Requested Revisions for: ${selectedSections.join(', ')}]\n`
      : '';
    onConfirm(sectionPrefix + reviewerNotes);
  };

  return (
    <div className="cmd-overlay" onClick={onClose}>
      <div className="cmd-modal" style={{ maxWidth: '500px', padding: '24px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ background: 'var(--warning-bg)', color: 'var(--warning-text)', padding: '10px', borderRadius: '8px' }}>
            <AlertTriangle size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Request Revision</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
              Specify which sections require reasoning adjustments or code updates.
            </p>
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
            Flagged Sections
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            {sections.map((sec) => (
              <label
                key={sec}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: selectedSections.includes(sec) ? 'var(--warning-bg)' : 'var(--bg-primary)',
                  color: selectedSections.includes(sec) ? 'var(--warning-text)' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedSections.includes(sec)}
                  onChange={() => toggleSection(sec)}
                />
                {sec}
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
            Reviewer Feedback / Instructions
          </label>
          <textarea
            rows={4}
            value={reviewerNotes}
            onChange={(e) => setReviewerNotes(e.target.value)}
            placeholder="Explain specifically what reasoning is missing or what changes are required..."
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button className="btn btn-warning" onClick={handleSend} disabled={submitting || !reviewerNotes.trim()}>
            {submitting ? 'Sending...' : 'Request Revision'}
          </button>
        </div>
      </div>
    </div>
  );
};

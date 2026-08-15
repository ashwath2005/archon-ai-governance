import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';

export const ApprovalDialog = ({ isOpen, onClose, onConfirm, submitting, reasoningIncluded }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <CheckCircle2 size={20} style={{ color: 'var(--archon-success)' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--archon-text)' }}>
            APPROVE ARCHITECTURE SUBMISSION?
          </h3>
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--archon-text-secondary)', marginBottom: '14px', lineHeight: 1.4 }}>
          This action will transition the architecture submission status to <strong style={{ color: 'var(--archon-success)' }}>APPROVED</strong> and log an immutable entry in the audit timeline.
        </p>

        {!reasoningIncluded && (
          <div style={{ background: 'var(--archon-warning-bg)', border: '1px solid var(--archon-warning-border)', color: 'var(--archon-warning)', padding: '8px 12px', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={14} /> Attention: Architectural reasoning is missing or unverified for one or more criteria.
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <Button variant="secondary" size="sm" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="success" size="sm" onClick={onConfirm} disabled={submitting}>
            {submitting ? 'Approving...' : 'Confirm Approval'}
          </Button>
        </div>
      </div>
    </div>
  );
};

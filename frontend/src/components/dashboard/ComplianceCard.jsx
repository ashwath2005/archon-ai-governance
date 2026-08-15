import React from 'react';
import { ProgressRing } from '../common/ProgressRing';
import { CheckSquare, XCircle } from 'lucide-react';

export const ComplianceCard = ({ summary }) => {
  const rate = summary?.reasoningRate || 0;

  return (
    <div style={{ background: 'var(--archon-surface)', border: '1px solid var(--archon-border)', borderRadius: 'var(--radius-lg)', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '14px', color: 'var(--archon-text)' }}>
        ARCHITECTURE REASONING COMPLIANCE
      </h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <ProgressRing percentage={rate} size={84} />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.775rem' }}>
            <CheckSquare size={14} style={{ color: 'var(--archon-success)' }} />
            <span>Verified Reasoning: <strong className="mono" style={{ color: 'var(--archon-text)' }}>{summary?.reasoningIncluded || 0}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.775rem' }}>
            <XCircle size={14} style={{ color: 'var(--archon-danger)' }} />
            <span>Missing Reasoning: <strong className="mono" style={{ color: 'var(--archon-text)' }}>{summary?.reasoningMissing || 0}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};

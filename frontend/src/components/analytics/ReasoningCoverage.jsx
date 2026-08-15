import React from 'react';

export const ReasoningCoverage = ({ reasoningIncludedCount = 44, totalCriteria = 50 }) => {
  const percentage = totalCriteria > 0 ? Math.round((reasoningIncludedCount / totalCriteria) * 100) : 0;

  const domainBreakdown = [
    { name: 'RAG', count: '5 / 5' },
    { name: 'AGENTS', count: '4 / 5' },
    { name: 'MODEL', count: '5 / 5' },
    { name: 'DISTILLATION', count: '3 / 5' },
    { name: 'LLMOPS', count: '4 / 5' },
    { name: 'SAFETY', count: '5 / 5' }
  ];

  return (
    <div style={{ background: 'var(--archon-surface)', border: '1px solid var(--archon-border)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div className="mono" style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--archon-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          REASONING COVERAGE METRIC
        </div>
        <span className="mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--archon-cyan)' }}>
          {percentage}%
        </span>
      </div>

      <div style={{ fontSize: '0.75rem', color: 'var(--archon-text-secondary)', marginBottom: '14px' }}>
        <strong className="mono" style={{ color: 'var(--archon-text)' }}>{reasoningIncludedCount}</strong> of <span className="mono">{totalCriteria}</span> required architecture criteria have verified reasoning.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        {domainBreakdown.map((d) => (
          <div key={d.name} style={{ padding: '8px 10px', background: 'var(--archon-bg)', border: '1px solid var(--archon-border)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--archon-text-muted)' }}>{d.name}</span>
            <span className="mono" style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--archon-text)' }}>{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

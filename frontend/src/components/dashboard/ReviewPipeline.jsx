import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ReviewPipeline = ({ summary }) => {
  const navigate = useNavigate();

  const total = summary?.totalSubmissions || 0;
  const notReviewed = summary?.notReviewed || 0;
  const needsRevision = summary?.needsRevision || 0;
  const approved = summary?.approved || 0;

  const stages = [
    { key: 'SUBMITTED', label: 'SUBMITTED', count: total, color: 'var(--archon-text-muted)', border: 'var(--archon-border)', bg: 'var(--archon-surface-card)', path: '/submissions' },
    { key: 'NOT_REVIEWED', label: 'NOT REVIEWED', count: notReviewed, color: 'var(--archon-cyan)', border: 'var(--archon-cyan-border)', bg: 'var(--archon-cyan-bg)', path: '/submissions?status=NOT_REVIEWED' },
    { key: 'NEEDS_REVISION', label: 'NEEDS REVISION', count: needsRevision, color: 'var(--archon-warning)', border: 'var(--archon-warning-border)', bg: 'var(--archon-warning-bg)', path: '/submissions?status=NEEDS_REVISION' },
    { key: 'APPROVED', label: 'APPROVED', count: approved, color: 'var(--archon-success)', border: 'var(--archon-success-border)', bg: 'var(--archon-success-bg)', path: '/submissions?status=APPROVED' }
  ];

  return (
    <div className="card-award">
      <div className="mono" style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--archon-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
        INTERACTIVE REVIEW PIPELINE FLOW
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
        {stages.map((st, idx) => (
          <React.Fragment key={st.key}>
            <div
              onClick={() => navigate(st.path)}
              style={{
                flex: 1,
                minWidth: '130px',
                padding: '14px 12px',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${st.border}`,
                borderLeft: `3px solid ${st.color}`,
                background: st.bg,
                cursor: 'pointer',
                transition: 'all 0.22s var(--spring-bounce)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="mono" style={{ fontSize: '0.65rem', fontWeight: 700, color: st.color }}>
                  ● {st.label}
                </span>
              </div>
              <div className="mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--archon-text)', marginTop: '4px' }}>
                {st.count}
              </div>
            </div>
            {idx < stages.length - 1 && (
              <ChevronRight size={14} style={{ color: 'var(--archon-text-muted)', flexShrink: 0 }} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

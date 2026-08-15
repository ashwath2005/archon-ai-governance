import React from 'react';

export const GovernanceScore = ({ score = 91.4, reasoningScore = 96, completenessScore = 88, safetyScore = 94, reviewQuality = 91 }) => {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="card-award" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Animated Glowing Score Ring */}
        <div style={{ position: 'relative', width: '92px', height: '92px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="92" height="92" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx="46"
              cy="46"
              r={radius}
              stroke="var(--archon-border)"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="46"
              cy="46"
              r={radius}
              stroke="var(--archon-cyan)"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.8s var(--spring-bounce)' }}
            />
          </svg>
          <div style={{ position: 'absolute', textAlign: 'center' }}>
            <div className="mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--archon-cyan)', lineHeight: 1 }}>
              {score}
            </div>
            <div className="mono" style={{ fontSize: '0.55rem', color: 'var(--archon-text-muted)', marginTop: '2px' }}>/ 100</div>
          </div>
        </div>

        <div>
          <div className="mono" style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--archon-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            ARCHON GOVERNANCE SCORE
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--archon-text)', marginTop: '2px' }}>
            Optimal System Governance Rating
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--archon-text-secondary)', marginTop: '2px' }}>
            System-wide architectural compliance & evidence validation
          </div>
        </div>
      </div>

      {/* Sub-Metrics Progress Scale */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px 24px', flex: 1, maxWidth: '380px' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--archon-text-muted)', marginBottom: '3px' }}>
            <span>REASONING</span>
            <span className="mono" style={{ color: 'var(--archon-cyan)' }}>{reasoningScore}%</span>
          </div>
          <div style={{ height: '4px', background: 'var(--archon-bg)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: `${reasoningScore}%`, height: '100%', background: 'var(--archon-cyan)', transition: 'width 0.6s var(--spring-bounce)' }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--archon-text-muted)', marginBottom: '3px' }}>
            <span>COMPLETENESS</span>
            <span className="mono" style={{ color: 'var(--archon-indigo)' }}>{completenessScore}%</span>
          </div>
          <div style={{ height: '4px', background: 'var(--archon-bg)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: `${completenessScore}%`, height: '100%', background: 'var(--archon-indigo)', transition: 'width 0.6s var(--spring-bounce)' }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--archon-text-muted)', marginBottom: '3px' }}>
            <span>SAFETY</span>
            <span className="mono" style={{ color: 'var(--archon-success)' }}>{safetyScore}%</span>
          </div>
          <div style={{ height: '4px', background: 'var(--archon-bg)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: `${safetyScore}%`, height: '100%', background: 'var(--archon-success)', transition: 'width 0.6s var(--spring-bounce)' }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--archon-text-muted)', marginBottom: '3px' }}>
            <span>REVIEW QUALITY</span>
            <span className="mono" style={{ color: 'var(--archon-warning)' }}>{reviewQuality}%</span>
          </div>
          <div style={{ height: '4px', background: 'var(--archon-bg)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: `${reviewQuality}%`, height: '100%', background: 'var(--archon-warning)', transition: 'width 0.6s var(--spring-bounce)' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

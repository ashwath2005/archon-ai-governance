import React from 'react';

export const MetricCard = ({ icon: Icon, label, value, description, iconColor = 'var(--archon-cyan)' }) => {
  return (
    <div
      style={{
        background: 'var(--archon-surface)',
        border: '1px solid var(--archon-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--archon-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </span>
        {Icon && (
          <div style={{ background: 'var(--archon-bg)', color: iconColor, padding: '6px', borderRadius: 'var(--radius-sm)', display: 'flex', border: '1px solid var(--archon-border)' }}>
            <Icon size={14} />
          </div>
        )}
      </div>
      <div className="mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--archon-text)' }}>
        {value}
      </div>
      {description && (
        <div style={{ fontSize: '0.725rem', color: 'var(--archon-text-muted)', marginTop: '4px' }}>
          {description}
        </div>
      )}
    </div>
  );
};

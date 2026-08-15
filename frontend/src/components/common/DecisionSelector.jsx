import React from 'react';

export const DecisionSelector = ({ options, value, onChange, disabled }) => {
  const getStyleForOption = (opt, isSelected) => {
    if (!isSelected) {
      return {
        background: 'var(--archon-surface)',
        border: '1px solid var(--archon-border)',
        color: 'var(--archon-text-secondary)'
      };
    }

    switch (opt) {
      case 'YES':
        return {
          background: 'var(--archon-success-bg)',
          border: '1px solid var(--archon-success-border)',
          color: 'var(--archon-success)'
        };
      case 'NO':
        return {
          background: 'var(--archon-danger-bg)',
          border: '1px solid var(--archon-danger-border)',
          color: 'var(--archon-danger)'
        };
      case 'DEFERRED':
      default:
        return {
          background: 'var(--archon-warning-bg)',
          border: '1px solid var(--archon-warning-border)',
          color: 'var(--archon-warning)'
        };
    }
  };

  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
      {options.map((opt) => {
        const isSelected = value === opt;
        const optStyle = getStyleForOption(opt, isSelected);

        return (
          <button
            key={opt}
            type="button"
            disabled={disabled}
            onClick={() => onChange(opt)}
            className="mono"
            style={{
              padding: '5px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'all var(--motion-fast)',
              ...optStyle
            }}
          >
            [ {opt} ]
          </button>
        );
      })}
    </div>
  );
};

import React from 'react';
import { Check, Clock, AlertTriangle, CheckCircle2, User, ArrowRight } from 'lucide-react';

export const ReviewTimeline = ({ history = [] }) => {
  if (!history || history.length === 0) {
    return <div style={{ fontSize: '0.75rem', color: 'var(--archon-text-muted)', padding: '8px 0' }}>No audit history events recorded.</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {history.map((event, index) => (
        <div key={event.id || index} style={{ display: 'flex', gap: '10px', position: 'relative' }}>
          {/* Vertical connecting line */}
          {index < history.length - 1 && (
            <div style={{ position: 'absolute', left: '7px', top: '18px', bottom: '-12px', width: '1px', background: 'var(--archon-border)' }} />
          )}

          <div style={{ padding: '3px', borderRadius: '50%', background: 'var(--archon-bg)', border: '1px solid var(--archon-border)', color: 'var(--archon-cyan)', zIndex: 1, height: '16px', width: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Clock size={10} />
          </div>

          <div style={{ flex: 1, fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="mono" style={{ fontWeight: 700, color: 'var(--archon-text)' }}>{event.action}</span>
              <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--archon-text-muted)' }}>{event.timestamp}</span>
            </div>
            <div style={{ color: 'var(--archon-text-secondary)', fontSize: '0.7rem', marginTop: '2px' }}>
              Actor: <strong style={{ color: 'var(--archon-text)' }}>{event.actorName}</strong>
            </div>
            {event.notes && (
              <div style={{ marginTop: '4px', padding: '6px 8px', background: 'var(--archon-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--archon-border)', color: 'var(--archon-text-muted)', fontSize: '0.7rem' }}>
                "{event.notes}"
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

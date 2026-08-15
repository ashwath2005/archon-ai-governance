import React, { useState, useEffect } from 'react';
import { Terminal, ChevronUp, ChevronDown, Activity, ShieldCheck } from 'lucide-react';

export const GovernanceTerminal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState([
    { time: '11:52:04', tag: 'KERNEL_INIT', msg: 'ARCHON Governance Kernel v2.4 initialized', type: 'cyan' },
    { time: '11:52:05', tag: 'SEC_SCAN', msg: 'Guardrail PII filter active (0 risks detected)', type: 'success' },
    { time: '11:52:06', tag: 'AUDIT_SYNC', msg: 'Immutable DB hash verified (SHA-256 ok)', type: 'success' },
    { time: '11:52:08', tag: 'REASON_CHK', msg: 'Reasoning compliance rule >5 chars enforced', type: 'info' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const sampleEvents = [
        { tag: 'METRIC_SYNC', msg: 'Governance score recalculation complete (91.4/100)', type: 'cyan' },
        { tag: 'AUDIT_LOG', msg: 'Review timeline event appended to audit chain', type: 'success' },
        { tag: 'PII_CHECK', msg: 'Zero unmasked sensitive tokens detected in workspace', type: 'success' },
        { tag: 'DAG_VERIFY', msg: 'Architecture pipeline nodes connected & verified', type: 'info' }
      ];
      const randomEv = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];

      setLogs((prev) => [
        ...prev.slice(-6),
        { time: timeStr, tag: randomEv.tag, msg: randomEv.msg, type: randomEv.type }
      ]);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '20px',
        zIndex: 90,
        width: isOpen ? '420px' : '260px',
        background: 'var(--archon-surface-elevated)',
        border: '1px solid var(--archon-border-hover)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.9)',
        transition: 'all 0.28s var(--spring-bounce)'
      }}
    >
      {/* Drawer Header */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          cursor: 'pointer',
          borderBottom: isOpen ? '1px solid var(--archon-border)' : 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Terminal size={14} style={{ color: 'var(--archon-cyan)' }} />
          <span className="mono" style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--archon-text)' }}>
            ARCHON TTY LOG v2.4
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="status-pill status-approved" style={{ fontSize: '0.55rem', padding: '1px 5px' }}>
            LIVE
          </span>
          {isOpen ? <ChevronDown size={14} style={{ color: 'var(--archon-text-muted)' }} /> : <ChevronUp size={14} style={{ color: 'var(--archon-text-muted)' }} />}
        </div>
      </div>

      {/* Drawer Log List */}
      {isOpen && (
        <div className="animate-fade-in" style={{ padding: '10px 12px', maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.7rem' }}>
          {logs.map((log, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'baseline', gap: '8px', lineHeight: 1.3 }}>
              <span className="mono" style={{ color: 'var(--archon-text-muted)', fontSize: '0.65rem' }}>{log.time}</span>
              <span className="mono" style={{ color: 'var(--archon-cyan)', fontWeight: 700, fontSize: '0.625rem' }}>[{log.tag}]</span>
              <span style={{ color: 'var(--archon-text-secondary)', flex: 1 }}>{log.msg}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

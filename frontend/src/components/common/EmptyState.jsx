import React from 'react';
import { FolderOpen } from 'lucide-react';

export const EmptyState = ({ title = "No data found", description = "There are no records matching your request.", action }) => {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px border var(--border-color)' }}>
      <FolderOpen size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px', maxWidth: '400px', margin: '0 auto 20px auto' }}>{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export const ErrorState = ({ title = 'Something went wrong', message = 'Unable to load content from server.', onRetry }) => {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)' }}>
      <div style={{ display: 'inline-flex', background: 'var(--danger-bg)', color: 'var(--danger-text)', padding: '12px', borderRadius: '50%', marginBottom: '12px' }}>
        <AlertCircle size={24} />
      </div>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{title}</h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px', maxWidth: '400px', margin: '0 auto 16px auto' }}>{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          <RotateCcw size={14} /> Try Again
        </Button>
      )}
    </div>
  );
};

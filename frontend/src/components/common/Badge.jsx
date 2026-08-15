import React from 'react';
import { CheckCircle2, AlertCircle, Clock, Check, X } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  switch (status) {
    case 'APPROVED':
      return (
        <span className="status-hex status-approved">
          <CheckCircle2 size={11} /> APPROVED
        </span>
      );
    case 'NEEDS_REVISION':
      return (
        <span className="status-hex status-revision">
          <AlertCircle size={11} /> REVISION
        </span>
      );
    case 'NOT_REVIEWED':
    default:
      return (
        <span className="status-hex status-not-reviewed">
          <Clock size={11} /> NOT REVIEWED
        </span>
      );
  }
};

export const ReasoningBadge = ({ included }) => {
  return included ? (
    <span className="status-hex status-approved" style={{ fontSize: '0.65rem' }}>
      <Check size={11} /> VALID
    </span>
  ) : (
    <span className="status-hex status-revision" style={{ fontSize: '0.65rem' }}>
      <X size={11} /> MISSING
    </span>
  );
};

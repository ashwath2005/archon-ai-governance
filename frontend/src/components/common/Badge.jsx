import React from 'react';
import { CheckCircle2, AlertCircle, Clock, Check, X } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  switch (status) {
    case 'APPROVED':
      return (
        <span className="badge-premium badge-emerald">
          <span className="badge-dot" /> Approved
        </span>
      );
    case 'NEEDS_REVISION':
      return (
        <span className="badge-premium badge-amber">
          <span className="badge-dot" /> Needs Revision
        </span>
      );
    case 'NOT_REVIEWED':
    default:
      return (
        <span className="badge-premium badge-cyan">
          <span className="badge-dot" /> Not Reviewed
        </span>
      );
  }
};

export const ReasoningBadge = ({ included }) => {
  return included ? (
    <span className="badge-premium badge-emerald" style={{ fontSize: '0.7rem' }}>
      <Check size={11} /> Verified
    </span>
  ) : (
    <span className="badge-premium badge-amber" style={{ fontSize: '0.7rem' }}>
      <X size={11} /> Missing
    </span>
  );
};

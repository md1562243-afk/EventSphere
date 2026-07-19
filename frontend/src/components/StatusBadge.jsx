import React from 'react';

const STYLES = {
  Approved: 'bg-success/10 text-success',
  Confirmed: 'bg-success/10 text-success',
  Pending: 'bg-pendingc/10 text-pendingc',
  Rejected: 'bg-errorc/10 text-errorc',
  Cancelled: 'bg-errorc/10 text-errorc'
};

export default function StatusBadge({ status }) {
  return (
    <span className={`badge ${STYLES[status] || 'bg-slate-100 text-body'}`}>
      {status}
    </span>
  );
}

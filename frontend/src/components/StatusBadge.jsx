import React from 'react';

const STYLES = {
  Approved: 'bg-badgebg text-badgetext',
  Confirmed: 'bg-badgebg text-badgetext',
  Pending: 'bg-pendingc/10 text-pendingc',
  Rejected: 'bg-errorc/10 text-errorc',
  Cancelled: 'bg-errorc/10 text-errorc'
};

export default function StatusBadge({ status }) {
  return (
    <span className={`badge ${STYLES[status] || 'bg-searchbg text-body'}`}>
      {status}
    </span>
  );
}
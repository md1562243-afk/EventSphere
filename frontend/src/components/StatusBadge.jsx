import React from 'react';

const STATUS_STYLES = {
  Approved: 'bg-badgebg text-badgetext',
  Confirmed: 'bg-badgebg text-badgetext',
  Pending: 'bg-pendingc/10 text-pendingc',
  Rejected: 'bg-errorc/10 text-errorc',
  Cancelled: 'bg-errorc/10 text-errorc'
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || 'bg-badgebg text-badgetext';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${style}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
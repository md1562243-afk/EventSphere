import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api/axios';

const links = [
  { to: '/admin/dashboard', label: 'Overview', end: true },
  { to: '/admin/organizers', label: 'Organizers' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/events', label: 'Events' },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/payments', label: 'Payments' }
];

const TABS = ['Pending', 'Confirmed'];

export default function AdminPayments() {
  const [tab, setTab] = useState('Pending');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/admin/payments', { params: { status: tab } }).then((res) => setPayments(res.data.payments)).finally(() => setLoading(false));
  };

  useEffect(load, [tab]);

  const confirm = async (id) => {
    await api.put(`/admin/payments/${id}/confirm`);
    load();
  };

  return (
    <DashboardLayout title="Verify Payments" links={links}>
      <div className="flex gap-2 mb-5">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-sm font-semibold rounded-full px-4 py-1.5 transition duration-250 ${
              tab === t ? 'bg-primary text-white' : 'bg-slate-100 text-body hover:bg-primary/10'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-body">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Event</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.payment_id} className="border-t border-slate-50">
                  <td className="py-3 px-4 text-body">#{p.payment_id}</td>
                  <td className="py-3 px-4 text-body">#{p.booking_id}</td>
                  <td className="py-3 px-4 font-medium text-heading">{p.event_name || 'Custom Event'}</td>
                  <td className="py-3 px-4">{p.user_first_name} {p.user_last_name}</td>
                  <td className="py-3 px-4">{p.payment_method}</td>
                  <td className="py-3 px-4">৳{Number(p.payment_amount).toLocaleString()}</td>
                  <td className="py-3 px-4">{p.payment_date} {p.payment_time}</td>
                  <td className="py-3 px-4"><StatusBadge status={p.payment_status} /></td>
                  <td className="py-3 px-4">
                    {p.payment_status === 'Pending' && (
                      <button onClick={() => confirm(p.payment_id)} className="text-success text-xs font-semibold hover:underline">
                        Confirm
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && payments.length === 0 && (
                <tr><td colSpan={9} className="py-8 text-center text-body">No {tab.toLowerCase()} payments.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

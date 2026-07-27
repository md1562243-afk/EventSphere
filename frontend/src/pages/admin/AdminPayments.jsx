import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../api/axios';

const links = [
  { to: '/admin/dashboard', label: 'Overview', end: true },
  { to: '/admin/organizers', label: 'Organizers' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/events', label: 'Events' },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/payments', label: 'Payments' },
  { to: '/admin/create-admin', label: 'Add Admin' },
  { to: '/admin/profile', label: 'Profile' }
];

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/admin/payments').then((res) => setPayments(res.data.payments)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const confirm = async (id) => {
    await api.put(`/admin/payments/${id}/confirm`);
    load();
  };

  return (
    <DashboardLayout title="Verify Payments" links={links}>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-body">
                <th className="py-3 px-4">Payment ID</th>
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.payment_id} className="border-t border-slate-50">
                  <td className="py-3 px-4 text-body">#{p.payment_id}</td>
                  <td className="py-3 px-4 text-body">#{p.booking_id}</td>
                  <td className="py-3 px-4">{p.payment_method}</td>
                  <td className="py-3 px-4">৳{Number(p.payment_amount).toLocaleString()}</td>
                  <td className="py-3 px-4">
                    {p.admin_id ? (
                      <span className="text-success text-xs font-semibold">Confirmed</span>
                    ) : (
                      <span className="text-pendingc text-xs font-semibold">Pending</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {!p.admin_id && (
                      <button onClick={() => confirm(p.payment_id)} className="text-success text-xs font-semibold hover:underline">
                        Confirm
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && payments.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-body">No payments yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../api/axios';
import { formatTime12hr } from '../../utils/formatTime';

const links = [
  { to: '/user/dashboard', label: 'Overview', end: true },
  { to: '/user/bookings', label: 'Booking History' },
  { to: '/user/payments', label: 'Payment History' },
  { to: '/user/profile', label: 'Profile' }
];

export default function UserPayments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    api.get('/users/payments').then((res) => setPayments(res.data.payments));
  }, []);

  return (
    <DashboardLayout title="Payment History" links={links}>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-body">
                <th className="py-3 px-4">Event</th>
                <th className="py-3 px-4">Event Date</th>
                <th className="py-3 px-4">Event Time</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.payment_id} className="border-t border-slate-50">
                  <td className="py-3 px-4">{p.event_name || 'Custom Event'}</td>
                  <td className="py-3 px-4">{p.event_date}</td>
                  <td className="py-3 px-4">{formatTime12hr(p.event_time)}</td>
                  <td className="py-3 px-4">{p.payment_method}</td>
                  <td className="py-3 px-4">৳{Number(p.payment_amount).toLocaleString()}</td>
                  <td className="py-3 px-4">
                    {p.admin_id ? (
                      <span className="text-success text-xs font-semibold">Confirmed</span>
                    ) : (
                      <span className="text-pendingc text-xs font-semibold">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-body">No payments yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
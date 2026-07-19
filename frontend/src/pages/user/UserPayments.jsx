import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api/axios';

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
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.payment_id} className="border-t border-slate-50">
                  <td className="py-3 px-4">{p.event_name || 'Custom Event'}</td>
                  <td className="py-3 px-4">{p.payment_method}</td>
                  <td className="py-3 px-4">৳{Number(p.payment_amount).toLocaleString()}</td>
                  <td className="py-3 px-4"><StatusBadge status={p.payment_status} /></td>
                  <td className="py-3 px-4">{p.payment_date} {p.payment_time}</td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-body">No payments yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

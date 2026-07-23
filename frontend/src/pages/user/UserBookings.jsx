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

const METHODS = ['bKash', 'Nagad', 'Credit Card', 'Debit Card', 'Cash'];

// Derives the dashboard state for a custom-event booking purely from how many
// Payment rows exist and their statuses — no extra columns needed.
//   1 row,  Pending             -> 'submitted'            (awaiting first verification)
//   1 row,  Confirmed           -> 'awaiting_remaining'    (show 'Pay Remaining Amount')
//   2 rows, 2nd Pending         -> 'remaining_submitted'   (awaiting second verification)
//   2 rows, both Confirmed      -> 'fully_paid'
function getPaymentState(b) {
  if (b.event_id) return null; // normal event bookings don't use this custom-payment flow
  const paid = Number(b.paid);
  const due = Number(b.due);
  const count = Number(b.payment_count || 0);
  if (count === 0) return null;
  if (count === 1 && paid === 0) return 'submitted';
  if (count === 1 && paid > 0 && due === 0) return 'awaiting_remaining';
  if (count === 2 && due > 0) return 'remaining_submitted';
  if (count === 2 && due === 0) return 'fully_paid';
  return null;
}

export default function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);
  const [method, setMethod] = useState(METHODS[0]);

  const load = () => {
    api.get('/users/bookings').then((res) => setBookings(res.data.bookings)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const cancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    await api.put(`/users/bookings/${id}/cancel`);
    load();
  };

  const submitRemaining = async (id) => {
    await api.post(`/users/bookings/${id}/pay-remaining`, { payment_method: method });
    setPayingId(null);
    load();
  };

  return (
    <DashboardLayout title="Booking History" links={links}>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-body">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Event</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Venue</th>
                <th className="py-3 px-4">Paid / Due</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                const state = getPaymentState(b);
                return (
                  <tr key={b.booking_id} className="border-t border-slate-50">
                    <td className="py-3 px-4 text-body">#{b.booking_id}</td>
                    <td className="py-3 px-4">{b.event_name || `Custom · ${b.event_type || ''}`}</td>
                    <td className="py-3 px-4">{b.event_date}</td>
                    <td className="py-3 px-4">{b.event_venue}</td>
                    <td className="py-3 px-4">
                      ৳{Number(b.paid).toLocaleString()} / ৳{Number(b.due).toLocaleString()}
                      {state === 'submitted' && (
                        <p className="text-xs text-pendingc mt-0.5">Waiting for admin verification</p>
                      )}
                      {state === 'remaining_submitted' && (
                        <p className="text-xs text-pendingc mt-0.5">Remaining payment submitted — waiting for verification</p>
                      )}
                      {state === 'fully_paid' && (
                        <p className="text-xs text-success mt-0.5">Payment complete</p>
                      )}
                    </td>
                    <td className="py-3 px-4"><StatusBadge status={b.booking_status} /></td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {(b.booking_status === 'Pending' || b.booking_status === 'Confirmed') && (
                          <button onClick={() => cancel(b.booking_id)} className="text-errorc text-xs font-semibold hover:underline">
                            Cancel
                          </button>
                        )}
                        {state === 'awaiting_remaining' && payingId !== b.booking_id && (
                          <button onClick={() => setPayingId(b.booking_id)} className="text-primary text-xs font-semibold hover:underline">
                            Pay Remaining Amount
                          </button>
                        )}
                      </div>
                      {payingId === b.booking_id && (
                        <div className="flex items-center gap-2 mt-2">
                          <select className="input-field !py-1.5 text-xs" value={method} onChange={(e) => setMethod(e.target.value)}>
                            {METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
                          </select>
                          <button onClick={() => submitRemaining(b.booking_id)} className="btn-primary !px-3 !py-1.5 text-xs">Submit</button>
                          <button onClick={() => setPayingId(null)} className="text-body text-xs">Cancel</button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {!loading && bookings.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-body">No bookings yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
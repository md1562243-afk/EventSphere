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

  // Shown only for custom requests (no linked event) that have exactly one
  // Confirmed payment so far — the hallmark of an Advance plan awaiting its
  // second installment. Full-payment bookings won't show this since a single
  // Confirmed payment there already covers everything.
  const canPayRemaining = (b) => !b.event_id && Number(b.paid) > 0 && Number(b.due) === 0 && b.booking_status === 'Confirmed';

  // The other side of the same state: an advance was requested and is sitting
  // Pending, waiting on the admin to confirm it before the remaining-balance
  // option can appear.
  const awaitingAdvanceConfirmation = (b) => !b.event_id && Number(b.paid) === 0 && Number(b.due) > 0 && b.booking_status === 'Pending';

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
              {bookings.map((b) => (
                <tr key={b.booking_id} className="border-t border-slate-50">
                  <td className="py-3 px-4 text-body">#{b.booking_id}</td>
                  <td className="py-3 px-4">{b.event_name || `Custom · ${b.event_type || ''}`}</td>
                  <td className="py-3 px-4">{b.event_date}</td>
                  <td className="py-3 px-4">{b.event_venue}</td>
                  <td className="py-3 px-4">
                    ৳{Number(b.paid).toLocaleString()} / ৳{Number(b.due).toLocaleString()}
                    {awaitingAdvanceConfirmation(b) && (
                      <p className="text-xs text-pendingc mt-0.5">Awaiting admin confirmation</p>
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
                      {canPayRemaining(b) && payingId !== b.booking_id && (
                        <button onClick={() => setPayingId(b.booking_id)} className="text-primary text-xs font-semibold hover:underline">
                          Pay Remaining Balance
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
              ))}
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
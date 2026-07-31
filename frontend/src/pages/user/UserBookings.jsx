import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api/axios';
import { formatTime12hr } from '../../utils/formatTime';

const links = [
  { to: '/user/dashboard', label: 'Overview', end: true },
  { to: '/user/bookings', label: 'Booking History' },
  { to: '/user/payments', label: 'Payment History' },
  { to: '/user/profile', label: 'Profile' }
];

export default function UserBookings() {
  const [bookings, setBookings] = useState([]);

  const load = () => {
    api.get('/users/bookings').then((res) => setBookings(res.data.bookings));
  };

  useEffect(load, []);

  const cancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    await api.put(`/users/bookings/${id}/cancel`);
    load();
  };

  return (
    <DashboardLayout title="Booking History" links={links}>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-searchbg">
              <tr className="text-left text-body">
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Event Date</th>
                <th className="py-3 px-4">Event Time</th>
                <th className="py-3 px-4">Venue</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Event ID</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.booking_id} className="border-t border-divider">
                  <td className="py-3 px-4 text-body">#{b.booking_id}</td>
                  <td className="py-3 px-4">{b.event_date}</td>
                  <td className="py-3 px-4">{formatTime12hr(b.event_time)}</td>
                  <td className="py-3 px-4">{b.event_venue}</td>
                  <td className="py-3 px-4"><StatusBadge status={b.booking_status} /></td>
                  <td className="py-3 px-4">{b.event_id ? `#${b.event_id}` : '—'}</td>
                  <td className="py-3 px-4">
                    {(b.booking_status === 'Pending' || b.booking_status === 'Confirmed') && (
                      <button onClick={() => cancel(b.booking_id)} className="text-errorc text-xs font-semibold hover:underline">
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-body">No bookings yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
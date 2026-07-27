import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api/axios';
import { formatTime12hr } from '../../utils/formatTime';

const links = [
  { to: '/admin/dashboard', label: 'Overview', end: true },
  { to: '/admin/organizers', label: 'Organizers' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/events', label: 'Events' },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/payments', label: 'Payments' },
  { to: '/admin/create-admin', label: 'Add Admin' }
];

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);

  const load = () => {
    api.get('/admin/bookings').then((res) => setBookings(res.data.bookings));
  };

  useEffect(load, []);

  return (
    <DashboardLayout title="Monitor Bookings" links={links}>
      <p className="text-sm text-body mb-5">
        Organizers are assigned automatically (randomly, from Approved organizers) once payment is confirmed on the Payments page.
      </p>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-body">
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">User ID</th>
                <th className="py-3 px-4">Event</th>
                <th className="py-3 px-4">Date / Time</th>
                <th className="py-3 px-4">Venue</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Total Cost</th>
                <th className="py-3 px-4">Paid / Due</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.booking_id} className="border-t border-slate-50">
                  <td className="py-3 px-4 text-body">#{b.booking_id}</td>
                  <td className="py-3 px-4">#{b.user_id}</td>
                  <td className="py-3 px-4 font-medium text-heading">{b.event_name || 'Unassigned custom event'}</td>
                  <td className="py-3 px-4">{b.event_date} {formatTime12hr(b.event_time)}</td>
                  <td className="py-3 px-4">{b.event_venue}</td>
                  <td className="py-3 px-4"><StatusBadge status={b.booking_status} /></td>
                  <td className="py-3 px-4">৳{(Number(b.paid) + Number(b.due)).toLocaleString()}</td>
                  <td className="py-3 px-4">৳{Number(b.paid).toLocaleString()} / ৳{Number(b.due).toLocaleString()}</td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr><td colSpan={8} className="py-8 text-center text-body">No bookings yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api/axios';
import { formatTime12hr } from '../../utils/formatTime';

const links = [
  { to: '/organizer/dashboard', label: 'Overview', end: true },
  { to: '/organizer/events', label: 'My Events' },
  { to: '/organizer/events/new', label: 'Create Event' },
  { to: '/organizer/bookings', label: 'Bookings' },
  { to: '/organizer/profile', label: 'Profile' }
];

export default function OrganizerBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get('/organizers/bookings').then((res) => setBookings(res.data.bookings));
  }, []);

  return (
    <DashboardLayout title="Bookings" links={links}>
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
                <th className="py-3 px-4">User ID</th>
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
                  <td className="py-3 px-4">#{b.user_id}</td>
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
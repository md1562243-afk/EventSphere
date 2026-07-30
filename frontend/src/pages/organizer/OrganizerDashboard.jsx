import React, { useEffect, useState } from 'react';
import { CalendarDays, TicketCheck, DollarSign } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import StatCard from '../../components/StatCard';
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

export default function OrganizerDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/organizers/dashboard').then((res) => setData(res.data));
  }, []);

  return (
    <DashboardLayout title="Overview" links={links}>
      {data ? (
        <>
          <div className="grid sm:grid-cols-3 gap-5 mb-8">
            <StatCard icon={CalendarDays} label="Total Events" value={data.dashboard.total_events} />
            <StatCard icon={TicketCheck} label="Total Bookings" value={data.dashboard.total_bookings} />
            <StatCard icon={DollarSign} label="Revenue" value={`৳${Number(data.dashboard.revenue).toLocaleString()}`} />
          </div>

          <div className="card p-6">
            <h3 className="font-bold mb-4">Recent Bookings</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-body border-b border-white/5">
                    <th className="py-2">Booking ID</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Event Date</th>
                    <th className="py-2">Event Time</th>
                    <th className="py-2">Venue</th>
                    <th className="py-2">User ID</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent_bookings.map((b) => (
                    <tr key={b.booking_id} className="border-b border-white/5">
                      <td className="py-3">#{b.booking_id}</td>
                      <td className="py-3"><StatusBadge status={b.booking_status} /></td>
                      <td className="py-3">{b.event_date}</td>
                      <td className="py-3">{formatTime12hr(b.event_time)}</td>
                      <td className="py-3">{b.event_venue}</td>
                      <td className="py-3">#{b.user_id}</td>
                    </tr>
                  ))}
                  {data.recent_bookings.length === 0 && (
                    <tr><td colSpan={6} className="py-6 text-center text-body">No bookings yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <p className="text-body">Loading...</p>
      )}
    </DashboardLayout>
  );
}
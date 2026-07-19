import React, { useEffect, useState } from 'react';
import { CalendarDays, TicketCheck, DollarSign } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api/axios';

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
            <StatCard icon={CalendarDays} label="Total Events" value={data.dashboard.total_events} accent="primary" />
            <StatCard icon={TicketCheck} label="Total Bookings" value={data.dashboard.total_bookings} accent="secondary" />
            <StatCard icon={DollarSign} label="Revenue" value={`৳${Number(data.dashboard.revenue).toLocaleString()}`} accent="primary" />
          </div>

          <div className="card p-6">
            <h3 className="font-bold mb-4">Recent Bookings</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-body border-b border-slate-100">
                    <th className="py-2">Event</th>
                    <th className="py-2">Booked By</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent_bookings.map((b) => (
                    <tr key={b.booking_id} className="border-b border-slate-50">
                      <td className="py-3">{b.event_name}</td>
                      <td className="py-3">{b.user_first_name} {b.user_last_name}</td>
                      <td className="py-3"><StatusBadge status={b.booking_status} /></td>
                    </tr>
                  ))}
                  {data.recent_bookings.length === 0 && (
                    <tr><td colSpan={3} className="py-6 text-center text-body">No bookings yet.</td></tr>
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

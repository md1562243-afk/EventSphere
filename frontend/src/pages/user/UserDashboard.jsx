import React, { useEffect, useState } from 'react';
import { CalendarCheck, Clock, CheckCircle, CreditCard } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api/axios';
import { formatTime12hr } from '../../utils/formatTime';

const links = [
  { to: '/user/dashboard', label: 'Overview', end: true },
  { to: '/user/bookings', label: 'Booking History' },
  { to: '/user/payments', label: 'Payment History' },
  { to: '/user/profile', label: 'Profile' }
];

export default function UserDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/users/dashboard').then((res) => setData(res.data));
  }, []);

  return (
    <DashboardLayout title="Overview" links={links}>
      {data ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <StatCard icon={CalendarCheck} label="Total Bookings" value={data.dashboard.total_bookings} accent="primary" />
            <StatCard icon={Clock} label="Upcoming Events" value={data.dashboard.upcoming_events} accent="secondary" />
            <StatCard icon={CheckCircle} label="Completed Events" value={data.dashboard.completed_events} accent="success" />
            <StatCard icon={CreditCard} label="Pending Payments" value={data.dashboard.pending_payments} accent="accent" />
          </div>

          <div className="card p-6">
            <h3 className="font-bold mb-4">Recent Bookings</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-body border-b border-slate-100">
                    <th className="py-2">Booking ID</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Event Date</th>
                    <th className="py-2">Event Time</th>
                    <th className="py-2">Venue</th>
                    <th className="py-2">Event ID</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent_bookings.map((b) => (
                    <tr key={b.booking_id} className="border-b border-slate-50">
                      <td className="py-3">#{b.booking_id}</td>
                      <td className="py-3"><StatusBadge status={b.booking_status} /></td>
                      <td className="py-3">{b.event_date}</td>
                      <td className="py-3">{formatTime12hr(b.event_time)}</td>
                      <td className="py-3">{b.event_venue}</td>
                      <td className="py-3">{b.event_id ? `#${b.event_id}` : '—'}</td>
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
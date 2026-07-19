import React, { useEffect, useState } from 'react';
import { Users, Clock, CreditCard, DollarSign, TrendingUp } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import StatCard from '../../components/StatCard';
import api from '../../api/axios';

const links = [
  { to: '/admin/dashboard', label: 'Overview', end: true },
  { to: '/admin/organizers', label: 'Organizers' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/events', label: 'Events' },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/payments', label: 'Payments' }
];

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard').then((res) => setData(res.data.dashboard));
  }, []);

  return (
    <DashboardLayout title="Platform Overview" links={links}>
      {data ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <StatCard icon={Users} label="Total Users" value={data.total_users} accent="primary" />
          <StatCard icon={Users} label="Total Organizers" value={data.total_organizers} accent="secondary" />
          <StatCard icon={Clock} label="Pending Organizers" value={data.pending_organizer_requests} accent="accent" />
          <StatCard icon={CreditCard} label="Pending Payments" value={data.pending_payments} accent="accent" />
          <StatCard icon={DollarSign} label="Total Revenue" value={`৳${Number(data.total_revenue).toLocaleString()}`} accent="success" />
          <StatCard icon={TrendingUp} label="Total Events" value={data.total_events} accent="secondary" />
        </div>
      ) : (
        <p className="text-body">Loading...</p>
      )}
    </DashboardLayout>
  );
}

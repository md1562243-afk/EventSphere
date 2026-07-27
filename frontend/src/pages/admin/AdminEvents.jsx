import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api/axios';

const links = [
  { to: '/admin/dashboard', label: 'Overview', end: true },
  { to: '/admin/organizers', label: 'Organizers' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/events', label: 'Events' },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/payments', label: 'Payments' },
  { to: '/admin/create-admin', label: 'Add Admin' },
  { to: '/admin/profile', label: 'Profile' }
];

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/admin/events').then((res) => setEvents(res.data.events)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const approve = async (id) => {
    await api.put(`/admin/events/${id}/approve`);
    load();
  };

  const remove = async (id) => {
    if (window.confirm('Delete this event?')) {
      await api.delete(`/admin/events/${id}`);
      load();
    }
  };

  return (
    <DashboardLayout title="Supervise Events" links={links}>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-body">
                <th className="py-3 px-4">Event ID</th>
                <th className="py-3 px-4">Event Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Organizer ID</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.event_id} className="border-t border-slate-50">
                  <td className="py-3 px-4 text-body">#{e.event_id}</td>
                  <td className="py-3 px-4 font-medium text-heading">{e.event_name}</td>
                  <td className="py-3 px-4">{e.event_type}</td>
                  <td className="py-3 px-4">৳{Number(e.ticket_price).toLocaleString()}</td>
                  <td className="py-3 px-4">#{e.organizer_id}</td>
                  <td className="py-3 px-4"><StatusBadge status={e.event_status} /></td>
                  <td className="py-3 px-4">
                    <div className="flex gap-3 text-xs font-semibold">
                      {e.event_status === 'Pending' && (
                        <button onClick={() => approve(e.event_id)} className="text-success hover:underline">Approve</button>
                      )}
                      <button onClick={() => remove(e.event_id)} className="text-errorc hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && events.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-body">No events yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
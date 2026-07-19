import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, Plus } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../api/axios';

const links = [
  { to: '/organizer/dashboard', label: 'Overview', end: true },
  { to: '/organizer/events', label: 'My Events' },
  { to: '/organizer/events/new', label: 'Create Event' },
  { to: '/organizer/bookings', label: 'Bookings' },
  { to: '/organizer/profile', label: 'Profile' }
];

export default function OrganizerEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get('/organizers/events').then((res) => setEvents(res.data.events)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async (id) => {
    if (!window.confirm('Delete this event? This cannot be undone.')) return;
    await api.delete(`/organizers/events/${id}`);
    load();
  };

  return (
    <DashboardLayout title="My Events" links={links}>
      <div className="flex justify-end mb-4">
        <Link to="/organizer/events/new" className="btn-primary flex items-center gap-2 !px-5 !py-2.5 text-sm">
          <Plus size={16} /> Create Event
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-body">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Event</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Venue</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.event_id} className="border-t border-slate-50">
                  <td className="py-3 px-4 text-body">#{e.event_id}</td>
                  <td className="py-3 px-4 font-medium text-heading">{e.event_name}</td>
                  <td className="py-3 px-4">{e.event_type}</td>
                  <td className="py-3 px-4">{e.event_date}</td>
                  <td className="py-3 px-4">{e.event_venue}</td>
                  <td className="py-3 px-4">৳{Number(e.ticket_price).toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-3">
                      <Link to={`/organizer/events/${e.event_id}/edit`} className="text-primary"><Pencil size={15} /></Link>
                      <button onClick={() => remove(e.event_id)} className="text-errorc"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && events.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-body">No events yet. Create your first one!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

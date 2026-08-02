import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
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

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'lowest_price', label: 'Lowest Price' },
  { value: 'highest_price', label: 'Highest Price' }
];

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');

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

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
  };

  const filtered = events
    .filter((e) => (search ? String(e.event_id).includes(search) : true))
    .sort((a, b) => {
      if (sort === 'lowest_price') return Number(a.ticket_price) - Number(b.ticket_price);
      if (sort === 'highest_price') return Number(b.ticket_price) - Number(a.ticket_price);
      return b.event_id - a.event_id; // newest
    });

  return (
    <DashboardLayout title="Supervise Events" links={links}>
      <p className="text-sm text-body mb-5">
        Approving an event makes it visible on Browse — as "What We Offer" if it's a reusable template, or "Custom Requests" if it's tied to one specific booking.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" size={16} />
            <input
              className="input-field !pl-10"
              placeholder="Search by Event ID..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary !px-5 !py-2.5 text-sm">Search</button>
        </form>
        <div className="flex gap-2">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSort(opt.value)}
              className={`text-xs font-semibold rounded-full px-3.5 py-2 transition duration-250 ${
                sort === opt.value ? 'bg-primary text-white' : 'bg-searchbg text-body hover:bg-primary/10'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-searchbg">
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
              {filtered.map((e) => (
                <tr key={e.event_id} className="border-t border-divider">
                  <td className="py-3 px-4 text-body">{e.event_id}</td>
                  <td className="py-3 px-4 font-medium text-heading">{e.event_name}</td>
                  <td className="py-3 px-4">{e.event_type}</td>
                  <td className="py-3 px-4">৳{Number(e.ticket_price).toLocaleString()}</td>
                  <td className="py-3 px-4">{e.organizer_id}</td>
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
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-body">No events found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
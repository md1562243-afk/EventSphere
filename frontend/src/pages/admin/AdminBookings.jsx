import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
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
  { to: '/admin/create-admin', label: 'Add Admin' },
  { to: '/admin/profile', label: 'Profile' }
];

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [exactMode, setExactMode] = useState(false);

  const load = () => {
    api.get('/admin/bookings').then((res) => setBookings(res.data.bookings));
  };

  useEffect(load, []);

  const handleChange = (e) => {
    setSearchInput(e.target.value);
    setExactMode(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setExactMode(true);
  };

  const filtered = bookings.filter((b) => {
    if (!searchInput.trim()) return true;
    const idStr = String(b.booking_id);
    return exactMode ? idStr === searchInput.trim() : idStr.includes(searchInput.trim());
  });

  return (
    <DashboardLayout title="Monitor Bookings" links={links}>
      <form onSubmit={handleSearch} className="flex gap-2 mb-5 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" size={16} />
          <input
            className="input-field !pl-10"
            placeholder="Search by Booking ID..."
            value={searchInput}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn-primary !px-5 !py-2.5 text-sm">Search</button>
      </form>

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
              {filtered.map((b) => (
                <tr key={b.booking_id} className="border-t border-divider">
                  <td className="py-3 px-4 text-body">{b.booking_id}</td>
                  <td className="py-3 px-4">{b.event_date}</td>
                  <td className="py-3 px-4">{formatTime12hr(b.event_time)}</td>
                  <td className="py-3 px-4">{b.event_venue}</td>
                  <td className="py-3 px-4"><StatusBadge status={b.booking_status} /></td>
                  <td className="py-3 px-4">{b.event_id ? b.event_id : '—'}</td>
                  <td className="py-3 px-4">{b.user_id}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-body">No bookings found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
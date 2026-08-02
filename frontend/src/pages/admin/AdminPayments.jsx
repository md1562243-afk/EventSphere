import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
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

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    api.get('/admin/payments').then((res) => setPayments(res.data.payments)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const confirm = async (id) => {
    await api.put(`/admin/payments/${id}/confirm`);
    load();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
  };

  const filtered = payments.filter((p) =>
    search ? String(p.payment_id).includes(search) : true
  );

  return (
    <DashboardLayout title="Verify Payments" links={links}>
      <form onSubmit={handleSearch} className="flex gap-2 mb-5 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" size={16} />
          <input
            className="input-field !pl-10"
            placeholder="Search by Payment ID..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary !px-5 !py-2.5 text-sm">Search</button>
      </form>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-searchbg">
              <tr className="text-left text-body">
                <th className="py-3 px-4">Payment ID</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.payment_id} className="border-t border-divider">
                  <td className="py-3 px-4 text-body">{p.payment_id}</td>
                  <td className="py-3 px-4">{p.payment_method}</td>
                  <td className="py-3 px-4">৳{Number(p.payment_amount).toLocaleString()}</td>
                  <td className="py-3 px-4">{p.booking_id}</td>
                  <td className="py-3 px-4">
                    {!p.admin_id && (
                      <button onClick={() => confirm(p.payment_id)} className="text-success text-xs font-semibold hover:underline">
                        Confirm
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-body">No payments found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
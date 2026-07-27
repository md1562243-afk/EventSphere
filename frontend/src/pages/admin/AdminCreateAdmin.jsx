import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
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

export default function AdminCreateAdmin() {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await api.post('/admin/create', form);
      setStatus({ type: 'success', message: `Admin "${res.data.admin.email}" created successfully.` });
      setForm({ first_name: '', last_name: '', email: '', password: '' });
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create admin';
      setStatus({ type: 'error', message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Add New Admin" links={links}>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={8}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {status && (
          <p className={status.type === 'success' ? 'text-green-600' : 'text-red-600'}>
            {status.message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          <UserPlus size={18} />
          {loading ? 'Creating...' : 'Create Admin'}
        </button>
      </form>
    </DashboardLayout>
  );
}
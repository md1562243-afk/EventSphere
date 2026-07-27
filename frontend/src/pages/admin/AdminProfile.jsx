import React, { useEffect, useState } from 'react';
import { Phone, Plus, Trash2 } from 'lucide-react';
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

export default function AdminProfile() {
  const [admin, setAdmin] = useState(null);
  const [newPhone, setNewPhone] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);

  const load = () => {
    api.get('/admin/profile').then((res) => setAdmin(res.data.admin));
  };

  useEffect(load, []);

  const addPhone = async (e) => {
    e.preventDefault();
    if (!newPhone.trim()) return;
    setAdding(true);
    setError(null);
    try {
      await api.post('/admin/phones', { phone_no: newPhone.trim() });
      setNewPhone('');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add phone number');
    } finally {
      setAdding(false);
    }
  };

  const removePhone = async (phone) => {
    if (!window.confirm(`Remove ${phone}?`)) return;
    await api.delete(`/admin/phones/${phone}`);
    load();
  };

  return (
    <DashboardLayout title="Profile" links={links}>
      {admin ? (
        <div className="card p-6 sm:p-8 max-w-lg space-y-6">
          <div>
            <p className="text-sm text-body">Name</p>
            <p className="font-medium text-heading">{admin.first_name} {admin.last_name}</p>
          </div>
          <div>
            <p className="text-sm text-body">Email</p>
            <p className="font-medium text-heading">{admin.email}</p>
          </div>

          <div>
            <p className="text-sm text-body mb-2">Phone Numbers</p>
            {admin.phones && admin.phones.length > 0 ? (
              <ul className="space-y-2">
                {admin.phones.map((phone) => (
                  <li key={phone} className="flex items-center justify-between border rounded-lg px-3 py-2">
                    <span className="flex items-center gap-2 text-sm">
                      <Phone size={14} className="text-body" /> {phone}
                    </span>
                    <button onClick={() => removePhone(phone)} className="text-errorc">
                      <Trash2 size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-body">No phone numbers added yet.</p>
            )}
          </div>

          <form onSubmit={addPhone} className="flex gap-2">
            <input
              className="input-field flex-1"
              placeholder="Add a phone number"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
            />
            <button type="submit" disabled={adding} className="btn-primary flex items-center gap-1 !px-4 disabled:opacity-50">
              <Plus size={16} /> Add
            </button>
          </form>
          {error && <p className="text-errorc text-sm">{error}</p>}
        </div>
      ) : (
        <p className="text-body">Loading...</p>
      )}
    </DashboardLayout>
  );
}
import React, { useEffect, useState } from 'react';
import { Phone, Plus, X, User, Mail } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../api/axios';

const links = [
  { to: '/admin/dashboard', label: 'Overview', end: true },
  { to: '/admin/profile', label: 'My Profile' },
  { to: '/admin/organizers', label: 'Organizers' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/events', label: 'Events' },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/payments', label: 'Payments' },
  { to: '/admin/create-admin', label: 'Add Admin' }
];

export default function AdminProfile() {
  const [profile, setProfile] = useState(null);
  const [newPhone, setNewPhone] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = () => {
    setLoading(true);
    api.get('/admin/profile')
      .then((res) => setProfile(res.data.admin))
      .catch(() => setMessage({ type: 'error', text: 'Failed to load profile' }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const addPhone = async (e) => {
    e.preventDefault();
    if (!newPhone.trim()) return;
    setMessage(null);
    try {
      await api.post('/admin/phones', { phone_no: newPhone.trim() });
      setNewPhone('');
      setMessage({ type: 'success', text: 'Phone number added' });
      loadProfile();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to add phone' });
    }
  };

  const removePhone = async (phone) => {
    if (!window.confirm(`Remove ${phone}?`)) return;
    try {
      await api.delete(`/admin/phones/${encodeURIComponent(phone)}`);
      loadProfile();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to remove phone' });
    }
  };

  if (loading) return <DashboardLayout title="My Profile" links={links}><p className="text-body">Loading...</p></DashboardLayout>;

  return (
    <DashboardLayout title="My Profile" links={links}>
      {profile ? (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Profile Info */}
          <div className="card p-6">
            <h2 className="text-lg font-bold mb-5">Account Details</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary grid place-items-center">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-xs text-body">Full Name</p>
                  <p className="font-semibold text-heading">{profile.first_name} {profile.last_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-secondary/10 text-secondary grid place-items-center">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs text-body">Email</p>
                  <p className="font-semibold text-heading">{profile.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Phone Numbers */}
          <div className="card p-6">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <Phone size={18} /> Phone Numbers
            </h2>

            {profile.phones && profile.phones.length > 0 ? (
              <div className="space-y-2 mb-5">
                {profile.phones.map((phone) => (
                  <div key={phone} className="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-2.5">
                    <span className="text-sm font-medium text-heading">{phone}</span>
                    <button
                      onClick={() => removePhone(phone)}
                      className="text-errorc hover:bg-red-50 p-1 rounded transition"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-body mb-5">No phone numbers added yet.</p>
            )}

            <form onSubmit={addPhone} className="flex gap-2">
              <input
                type="tel"
                className="input-field flex-1 text-sm"
                placeholder="Enter phone number..."
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
              />
              <button type="submit" className="btn-primary flex items-center gap-1 px-4">
                <Plus size={14} /> Add
              </button>
            </form>

            {message && (
              <p className={`text-sm mt-3 ${message.type === 'error' ? 'text-errorc' : 'text-success'}`}>
                {message.text}
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-body">Failed to load profile.</p>
      )}
    </DashboardLayout>
  );
}
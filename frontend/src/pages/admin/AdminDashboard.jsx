import React, { useEffect, useState } from 'react';
import { Users, Clock, CreditCard, DollarSign, TrendingUp, Phone, Plus, X } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import StatCard from '../../components/StatCard';
import api from '../../api/axios';

const links = [
  { to: '/admin/dashboard', label: 'Overview', end: true },
  { to: '/admin/organizers', label: 'Organizers' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/events', label: 'Events' },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/payments', label: 'Payments' },
  { to: '/admin/create-admin', label: 'Add Admin' }
];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [newPhone, setNewPhone] = useState('');
  const [phoneMsg, setPhoneMsg] = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard').then((res) => setData(res.data.dashboard));
    loadProfile();
  }, []);

  const loadProfile = () => {
    api.get('/admin/profile')
      .then((res) => setProfile(res.data.admin))
      .catch(() => setProfile(null));
  };

  const addPhone = async (e) => {
    e.preventDefault();
    if (!newPhone.trim()) return;
    setPhoneMsg(null);
    try {
      await api.post('/admin/phones', { phone_no: newPhone.trim() });
      setNewPhone('');
      setPhoneMsg({ type: 'success', text: 'Phone added' });
      loadProfile();
    } catch (err) {
      setPhoneMsg({ type: 'error', text: err.response?.data?.message || 'Failed to add phone' });
    }
  };

  const removePhone = async (phone) => {
    if (!window.confirm(`Remove ${phone}?`)) return;
    try {
      await api.delete(`/admin/phones/${encodeURIComponent(phone)}`);
      loadProfile();
    } catch (err) {
      setPhoneMsg({ type: 'error', text: 'Failed to remove phone' });
    }
  };

  return (
    <DashboardLayout title="Platform Overview" links={links}>
      {data ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          <StatCard icon={Users} label="Total Users" value={data.total_users} accent="primary" />
          <StatCard icon={Users} label="Total Organizers" value={data.total_organizers} accent="secondary" />
          <StatCard icon={Clock} label="Pending Organizers" value={data.pending_organizer_requests} accent="accent" />
          <StatCard icon={CreditCard} label="Pending Payments" value={data.pending_payments} accent="accent" />
          <StatCard icon={DollarSign} label="Total Revenue" value={`৳${Number(data.total_revenue).toLocaleString()}`} accent="success" />
          <StatCard icon={TrendingUp} label="Total Events" value={data.total_events} accent="secondary" />
        </div>
      ) : (
        <p className="text-body mb-10">Loading stats...</p>
      )}

      {/* Admin Profile & Phones */}
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4">My Profile</h2>
        {profile ? (
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-body mb-1">Name</p>
              <p className="font-semibold text-heading mb-3">{profile.first_name} {profile.last_name}</p>
              <p className="text-sm text-body mb-1">Email</p>
              <p className="font-semibold text-heading">{profile.email}</p>
            </div>

            <div>
              <p className="text-sm text-body mb-3 flex items-center gap-2">
                <Phone size={14} /> Phone Numbers
              </p>
              {profile.phones && profile.phones.length > 0 ? (
                <div className="space-y-2 mb-4">
                  {profile.phones.map((phone) => (
                    <div key={phone} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                      <span className="text-sm font-medium">{phone}</span>
                      <button onClick={() => removePhone(phone)} className="text-errorc hover:text-red-700">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-body mb-4">No phone numbers added.</p>
              )}

              <form onSubmit={addPhone} className="flex gap-2">
                <input
                  type="tel"
                  className="input-field flex-1 text-sm"
                  placeholder="Add phone number..."
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                />
                <button type="submit" className="btn-primary flex items-center gap-1 px-3">
                  <Plus size={14} /> Add
                </button>
              </form>
              {phoneMsg && (
                <p className={`text-xs mt-2 ${phoneMsg.type === 'error' ? 'text-errorc' : 'text-success'}`}>
                  {phoneMsg.text}
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-body">Loading profile...</p>
        )}
      </div>
    </DashboardLayout>
  );
}
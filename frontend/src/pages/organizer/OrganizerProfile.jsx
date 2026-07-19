import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api/axios';

const links = [
  { to: '/organizer/dashboard', label: 'Overview', end: true },
  { to: '/organizer/events', label: 'My Events' },
  { to: '/organizer/events/new', label: 'Create Event' },
  { to: '/organizer/bookings', label: 'Bookings' },
  { to: '/organizer/profile', label: 'Profile' }
];

export default function OrganizerProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ first_name: '', last_name: '' });
  const [newPhone, setNewPhone] = useState('');
  const [message, setMessage] = useState(null);
  const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '' });
  const [pwMessage, setPwMessage] = useState(null);

  const load = () => {
    api.get('/organizers/profile').then((res) => {
      setProfile(res.data.organizer);
      setForm({ first_name: res.data.organizer.first_name, last_name: res.data.organizer.last_name });
    });
  };

  useEffect(load, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    await api.put('/organizers/profile', form);
    setMessage('Profile updated');
    load();
  };

  const addPhone = async () => {
    if (!newPhone) return;
    await api.post('/organizers/phone', { phone_no: newPhone });
    setNewPhone('');
    load();
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPwMessage(null);
    try {
      await api.put('/organizers/change-password', passwordForm);
      setPwMessage({ type: 'success', text: 'Password changed' });
      setPasswordForm({ current_password: '', new_password: '' });
    } catch (err) {
      setPwMessage({ type: 'error', text: err.response?.data?.message || 'Failed to change password' });
    }
  };

  if (!profile) return <DashboardLayout title="Profile" links={links}><p className="text-body">Loading...</p></DashboardLayout>;

  return (
    <DashboardLayout title="Profile" links={links}>
      <div className="grid lg:grid-cols-2 gap-6">
        <form onSubmit={saveProfile} className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Personal Information</h3>
            <StatusBadge status={profile.status} />
          </div>
          <div>
            <label className="block text-sm font-medium text-heading mb-1">First name</label>
            <input className="input-field" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-heading mb-1">Last name</label>
            <input className="input-field" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-heading mb-1">Email</label>
            <input className="input-field bg-slate-50" value={profile.email} disabled />
          </div>
          {message && <p className="text-success text-sm">{message}</p>}
          <button type="submit" className="btn-primary">Save Changes</button>
        </form>

        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-bold mb-4">Phone Numbers</h3>
            <div className="space-y-2 mb-4">
              {profile.phones?.map((phone) => (
                <div key={phone} className="bg-slate-50 rounded-btn px-4 py-2 text-sm">{phone}</div>
              ))}
              {(!profile.phones || profile.phones.length === 0) && <p className="text-sm text-body">No phone numbers added.</p>}
            </div>
            <div className="flex gap-2">
              <input className="input-field" placeholder="Add phone number" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
              <button onClick={addPhone} className="btn-outline !px-4">Add</button>
            </div>
          </div>

          <form onSubmit={changePassword} className="card p-6 space-y-4">
            <h3 className="font-bold">Change Password</h3>
            <input type="password" required placeholder="Current password" className="input-field" value={passwordForm.current_password} onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })} />
            <input type="password" required placeholder="New password" className="input-field" value={passwordForm.new_password} onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })} />
            {pwMessage && <p className={`text-sm ${pwMessage.type === 'error' ? 'text-errorc' : 'text-success'}`}>{pwMessage.text}</p>}
            <button type="submit" className="btn-outline">Update Password</button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

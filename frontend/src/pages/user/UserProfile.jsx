import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../api/axios';

const links = [
  { to: '/user/dashboard', label: 'Overview', end: true },
  { to: '/user/bookings', label: 'Booking History' },
  { to: '/user/payments', label: 'Payment History' },
  { to: '/user/profile', label: 'Profile' }
];

export default function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ first_name: '', last_name: '' });
  const [newPhone, setNewPhone] = useState('');
  const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '' });
  const [message, setMessage] = useState(null);
  const [pwMessage, setPwMessage] = useState(null);

  const load = () => {
    api.get('/users/profile').then((res) => {
      setProfile(res.data.user);
      setForm({ first_name: res.data.user.first_name, last_name: res.data.user.last_name });
    });
  };

  useEffect(load, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    await api.put('/users/profile', form);
    setMessage('Profile updated');
    load();
  };

  const addPhone = async () => {
    if (!newPhone) return;
    await api.post('/users/phone', { phone_no: newPhone });
    setNewPhone('');
    load();
  };

  const removePhone = async (phone) => {
    await api.delete(`/users/phone/${phone}`);
    load();
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPwMessage(null);
    try {
      await api.put('/users/change-password', passwordForm);
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
          <h3 className="font-bold">Personal Information</h3>
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
                <div key={phone} className="flex items-center justify-between bg-slate-50 rounded-btn px-4 py-2 text-sm">
                  {phone}
                  <button onClick={() => removePhone(phone)}><Trash2 size={14} className="text-errorc" /></button>
                </div>
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

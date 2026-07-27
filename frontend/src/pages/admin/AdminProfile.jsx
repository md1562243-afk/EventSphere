import React, { useEffect, useState } from 'react';
import { Phone, Plus, Trash2, Pencil } from 'lucide-react';
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
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [nameError, setNameError] = useState(null);

  const [newPhone, setNewPhone] = useState('');
  const [adding, setAdding] = useState(false);
  const [phoneError, setPhoneError] = useState(null);

  const load = () => {
    api.get('/admin/profile').then((res) => {
      setAdmin(res.data.admin);
      setFirstName(res.data.admin.first_name);
      setLastName(res.data.admin.last_name);
    });
  };

  useEffect(load, []);

  const saveName = async (e) => {
    e.preventDefault();
    setSavingName(true);
    setNameError(null);
    try {
      await api.put('/admin/profile', { first_name: firstName, last_name: lastName });
      setEditing(false);
      load();
    } catch (err) {
      setNameError(err.response?.data?.message || 'Failed to update name');
    } finally {
      setSavingName(false);
    }
  };

  const addPhone = async (e) => {
    e.preventDefault();
    if (!newPhone.trim()) return;
    setAdding(true);
    setPhoneError(null);
    try {
      await api.post('/admin/phones', { phone_no: newPhone.trim() });
      setNewPhone('');
      load();
    } catch (err) {
      setPhoneError(err.response?.data?.message || 'Failed to add phone number');
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
            <div className="flex items-center justify-between">
              <p className="text-sm text-body">Name</p>
              {!editing && (
                <button onClick={() => setEditing(true)} className="text-primary text-xs font-semibold flex items-center gap-1 hover:underline">
                  <Pencil size={13} /> Edit
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={saveName} className="mt-2 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    className="input-field"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                  <input
                    className="input-field"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
                {nameError && <p className="text-errorc text-xs">{nameError}</p>}
                <div className="flex gap-2">
                  <button type="submit" disabled={savingName} className="btn-primary !px-4 !py-1.5 text-xs disabled:opacity-50">
                    {savingName ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEditing(false); setFirstName(admin.first_name); setLastName(admin.last_name); setNameError(null); }}
                    className="text-body text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <p className="font-medium text-heading">{admin.first_name} {admin.last_name}</p>
            )}
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
          {phoneError && <p className="text-errorc text-sm">{phoneError}</p>}
        </div>
      ) : (
        <p className="text-body">Loading...</p>
      )}
    </DashboardLayout>
  );
}
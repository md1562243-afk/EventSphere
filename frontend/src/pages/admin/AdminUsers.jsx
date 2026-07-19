import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../api/axios';

const links = [
  { to: '/admin/dashboard', label: 'Overview', end: true },
  { to: '/admin/organizers', label: 'Organizers' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/events', label: 'Events' },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/payments', label: 'Payments' }
];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const load = () => {
    api.get('/admin/users').then((res) => setUsers(res.data.users));
  };

  useEffect(load, []);

  const remove = async (id) => {
    if (!window.confirm('Remove this user?')) return;
    await api.delete(`/admin/users/${id}`);
    load();
  };

  return (
    <DashboardLayout title="Manage Users" links={links}>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-body">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.user_id} className="border-t border-slate-50">
                  <td className="py-3 px-4 text-body">#{u.user_id}</td>
                  <td className="py-3 px-4 font-medium text-heading">{u.first_name} {u.last_name}</td>
                  <td className="py-3 px-4">{u.email}</td>
                  <td className="py-3 px-4">{u.phone_numbers || '—'}</td>
                  <td className="py-3 px-4">
                    <button onClick={() => remove(u.user_id)} className="text-errorc text-xs font-semibold hover:underline">Remove</button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-body">No users yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

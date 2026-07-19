import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api/axios';

const links = [
  { to: '/admin/dashboard', label: 'Overview', end: true },
  { to: '/admin/organizers', label: 'Organizers' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/events', label: 'Events' },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/payments', label: 'Payments' }
];

const TABS = ['Pending', 'Approved', 'Rejected'];

export default function AdminOrganizers() {
  const [tab, setTab] = useState('Pending');
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/admin/organizers', { params: { status: tab } }).then((res) => setOrganizers(res.data.organizers)).finally(() => setLoading(false));
  };

  useEffect(load, [tab]);

  const approve = async (id) => { await api.put(`/admin/organizers/${id}/approve`); load(); };
  const reject = async (id) => { await api.put(`/admin/organizers/${id}/reject`); load(); };
  const remove = async (id) => { if (window.confirm('Remove this organizer?')) { await api.delete(`/admin/organizers/${id}`); load(); } };

  return (
    <DashboardLayout title="Organizer Approvals" links={links}>
      <div className="flex gap-2 mb-5">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-sm font-semibold rounded-full px-4 py-1.5 transition duration-250 ${
              tab === t ? 'bg-primary text-white' : 'bg-slate-100 text-body hover:bg-primary/10'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-body">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {organizers.map((o) => (
                <tr key={o.organizer_id} className="border-t border-slate-50">
                  <td className="py-3 px-4 text-body">#{o.organizer_id}</td>
                  <td className="py-3 px-4 font-medium text-heading">{o.first_name} {o.last_name}</td>
                  <td className="py-3 px-4">{o.email}</td>
                  <td className="py-3 px-4">{o.phone_numbers || '—'}</td>
                  <td className="py-3 px-4"><StatusBadge status={o.status} /></td>
                  <td className="py-3 px-4">
                    <div className="flex gap-3 text-xs font-semibold">
                      {o.status === 'Pending' && (
                        <>
                          <button onClick={() => approve(o.organizer_id)} className="text-success hover:underline">Approve</button>
                          <button onClick={() => reject(o.organizer_id)} className="text-errorc hover:underline">Reject</button>
                        </>
                      )}
                      <button onClick={() => remove(o.organizer_id)} className="text-body hover:underline">Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && organizers.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-body">No {tab.toLowerCase()} organizers.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

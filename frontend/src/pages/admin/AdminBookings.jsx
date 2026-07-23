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

function AssignModal({ booking, organizers, onClose, onAssign }) {
  const [organizerId, setOrganizerId] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');

  const submit = async () => {
    if (!organizerId) return;
    await onAssign(booking.booking_id, {
      organizer_id: organizerId,
      event_name: eventName || `Custom Event #${booking.booking_id}`,
      event_type: eventType || 'Other',
      ticket_price: ticketPrice || 0.01
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center z-50 p-4">
      <div className="card p-6 w-full max-w-md">
        <h3 className="font-bold mb-4">Assign Organizer</h3>
        <div className="space-y-3">
          <select className="input-field" value={organizerId} onChange={(e) => setOrganizerId(e.target.value)}>
            <option value="">Select organizer...</option>
            {organizers.map((o) => <option key={o.organizer_id} value={o.organizer_id}>#{o.organizer_id} — {o.first_name} {o.last_name}</option>)}
          </select>
          <input className="input-field" placeholder="Event name" value={eventName} onChange={(e) => setEventName(e.target.value)} />
          <input className="input-field" placeholder="Event type" value={eventType} onChange={(e) => setEventType(e.target.value)} />
          <input type="number" className="input-field" placeholder="Ticket price (or agreed budget)" value={ticketPrice} onChange={(e) => setTicketPrice(e.target.value)} />
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={submit} className="btn-primary flex-1">Assign</button>
          <button onClick={onClose} className="btn-outline flex-1">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [modalBooking, setModalBooking] = useState(null);

  const load = () => {
    api.get('/admin/bookings').then((res) => setBookings(res.data.bookings));
    api.get('/admin/organizers', { params: { status: 'Approved' } }).then((res) => setOrganizers(res.data.organizers));
  };

  useEffect(load, []);

  const handleAssign = async (bookingId, payload) => {
    await api.put(`/admin/bookings/${bookingId}/assign-organizer`, payload);
    setModalBooking(null);
    load();
  };

  return (
    <DashboardLayout title="Monitor Bookings" links={links}>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-body">
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">User ID</th>
                <th className="py-3 px-4">Event</th>
                <th className="py-3 px-4">Date / Time</th>
                <th className="py-3 px-4">Venue</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Total Cost</th>
                <th className="py-3 px-4">Paid / Due</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.booking_id} className="border-t border-slate-50">
                  <td className="py-3 px-4 text-body">#{b.booking_id}</td>
                  <td className="py-3 px-4">#{b.user_id}</td>
                  <td className="py-3 px-4 font-medium text-heading">{b.event_name || 'Unassigned custom event'}</td>
                  <td className="py-3 px-4">{b.event_date} {b.event_time}</td>
                  <td className="py-3 px-4">{b.event_venue}</td>
                  <td className="py-3 px-4"><StatusBadge status={b.booking_status} /></td>
                  <td className="py-3 px-4">৳{(Number(b.paid) + Number(b.due)).toLocaleString()}</td>
                  <td className="py-3 px-4">৳{Number(b.paid).toLocaleString()} / ৳{Number(b.due).toLocaleString()}</td>
                  <td className="py-3 px-4">
                    {!b.event_id && (
                      <button onClick={() => setModalBooking(b)} className="text-primary text-xs font-semibold hover:underline">
                        Assign Organizer
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr><td colSpan={8} className="py-8 text-center text-body">No bookings yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalBooking && (
        <AssignModal booking={modalBooking} organizers={organizers} onClose={() => setModalBooking(null)} onAssign={handleAssign} />
      )}
    </DashboardLayout>
  );
}
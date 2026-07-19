import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../api/axios';

const links = [
  { to: '/organizer/dashboard', label: 'Overview', end: true },
  { to: '/organizer/events', label: 'My Events' },
  { to: '/organizer/events/new', label: 'Create Event' },
  { to: '/organizer/bookings', label: 'Bookings' },
  { to: '/organizer/profile', label: 'Profile' }
];

const EMPTY = { event_name: '', event_type: '', event_date: '', event_time: '', event_venue: '', ticket_price: '' };

const EVENT_TYPES = [
  'Conference', 'Workshop', 'Seminar', 'Concert', 'Festival',
  'Wedding', 'Birthday Party', 'Corporate Event', 'Networking',
  'Sports', 'Exhibition', 'Charity', 'Other'
];

export default function OrganizerEventForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) {
      api.get(`/events/${id}`).then((res) => {
        const e = res.data.event;
        setForm({
          event_name: e.event_name, event_type: e.event_type,
          event_date: e.event_date, event_time: e.event_time, event_venue: e.event_venue,
          ticket_price: e.ticket_price
        });
      });
    }
  }, [id, isEdit]);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (isEdit) {
        await api.put(`/organizers/events/${id}`, form);
      } else {
        await api.post('/organizers/events', form);
      }
      navigate('/organizer/events');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save event');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title={isEdit ? 'Edit Event' : 'Create Event'} links={links}>
      <form onSubmit={handleSubmit} className="card p-6 sm:p-8 max-w-2xl space-y-5">
        <div>
          <label className="block text-sm font-medium text-heading mb-1">Event Name</label>
          <input required className="input-field" value={form.event_name} onChange={update('event_name')} />
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-heading mb-1">Event Type</label>
            <select required className="input-field" value={form.event_type} onChange={update('event_type')}>
              <option value="" disabled>Select a category...</option>
              {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-heading mb-1">Venue</label>
            <input required className="input-field" value={form.event_venue} onChange={update('event_venue')} />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-heading mb-1">Date</label>
            <input type="date" required className="input-field" value={form.event_date} onChange={update('event_date')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-heading mb-1">Time</label>
            <input type="time" required className="input-field" value={form.event_time} onChange={update('event_time')} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-heading mb-1">Ticket Price (৳)</label>
          <input type="number" min={1} required className="input-field" value={form.ticket_price} onChange={update('ticket_price')} />
        </div>

        {error && <p className="text-errorc text-sm">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
          {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Publish Event'}
        </button>
      </form>
    </DashboardLayout>
  );
}

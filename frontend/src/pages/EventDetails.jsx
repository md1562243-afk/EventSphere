import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Ticket, Share2, ArrowLeft, CalendarDays, MapPin, Clock } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TimeInput12hr from '../components/TimeInput12hr';

const METHODS = ['bKash', 'Nagad', 'Credit Card', 'Debit Card', 'Cash'];

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState('bKash');
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventVenue, setEventVenue] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    api.get(`/events/${id}`)
      .then((res) => setEvent(res.data.event))
      .catch(() => setMessage({ type: 'error', text: 'Event not found' }))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async () => {
    if (!isAuthenticated || role !== 'User') {
      navigate('/login/user');
      return;
    }
    if (!eventName.trim() || !eventDate || !eventTime || !eventVenue) {
      setMessage({ type: 'error', text: 'Please fill in event name, date, time and venue' });
      return;
    }
    const selectedDate = new Date(eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setMessage({ type: 'error', text: 'Event date cannot be in the past' });
      return;
    }

    setSubmitting(true);
    setMessage(null);
    try {
      const res = await api.post('/users/bookings/custom', {
        source_event_id: Number(id),
        event_name: eventName,
        event_type: event.event_type,
        event_date: eventDate,
        event_time: eventTime,
        event_venue: eventVenue,
        payment_method: method
      });
      setMessage({ type: 'success', text: 'Request submitted! Payment is pending admin verification.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Request failed' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container-app py-20 text-center text-body">Loading event...</div>;
  if (!event) return <div className="container-app py-20 text-center text-body">Event not found. <Link to="/events" className="text-primary">Browse events</Link></div>;

  return (
    <div className="container-app py-10">
      <Link to="/events" className="inline-flex items-center gap-2 text-sm text-body hover:text-primary mb-6">
        <ArrowLeft size={16} /> Back to events
      </Link>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <span className="badge bg-primary/10 text-primary mb-3">{event.event_type}</span>
          <h1 className="text-3xl mb-4">{event.event_name}</h1>

          <div className="card p-6">
            <h3 className="font-bold mb-3">About this event type</h3>
            <p className="text-body text-sm leading-relaxed">
              This is a {event.event_type.toLowerCase()} event package starting at ৳{Number(event.ticket_price).toLocaleString()}.
              Give it your own name and pick your preferred date, time and venue to request it for your own occasion.
            </p>
          </div>
        </div>

        <div>
          <div className="card p-6 sticky top-24">
            <div className="flex items-center justify-between mb-5">
              <span className="text-2xl font-extrabold text-heading flex items-center gap-1">
                <Ticket size={18} className="text-accent" /> ৳{Number(event.ticket_price).toLocaleString()}
              </span>
              <button className="text-body hover:text-primary" aria-label="Share event" onClick={() => navigator.clipboard?.writeText(window.location.href)}>
                <Share2 size={18} />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-medium text-body mb-1">Event Name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Sarah & Tom's Wedding"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-body mb-1">Event Date</label>
                <div className="relative">
                  <CalendarDays size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    className="input-field !pl-10"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-body mb-1">Event Time</label>
                <TimeInput12hr value={eventTime} onChange={setEventTime} />
              </div>
              <div>
                <label className="block text-xs font-medium text-body mb-1">Venue</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    className="input-field !pl-10"
                    placeholder="Enter venue address"
                    value={eventVenue}
                    onChange={(e) => setEventVenue(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <label className="block text-sm font-medium text-heading mb-1">Payment method</label>
            <select className="input-field mb-4" value={method} onChange={(e) => setMethod(e.target.value)}>
              {METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>

            <div className="flex items-center justify-between mb-5 text-sm">
              <span className="text-body">Total</span>
              <span className="font-bold text-heading">৳{Number(event.ticket_price).toLocaleString()}</span>
            </div>

            {message && (
              <p className={`text-sm mb-4 ${message.type === 'error' ? 'text-errorc' : 'text-success'}`}>{message.text}</p>
            )}

            <button onClick={handleBook} disabled={submitting} className="btn-accent w-full text-center disabled:opacity-60">
              {submitting ? 'Submitting...' : 'Request This Event'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CalendarDays, MapPin, Ticket, Share2, ArrowLeft } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { formatTime12hr } from '../utils/formatTime';

const METHODS = ['bKash', 'Nagad', 'Credit Card', 'Debit Card', 'Cash'];

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState('bKash');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    api.get(`/events/${id}`)
      .then((res) => setEvent(res.data.event))
      .catch(() => setMessage({ type: 'error', text: 'Event not found' }))
      .finally(() => setLoading(false));
  }, [id]);

  const isBookingClosed = (() => {
    if (!event) return false;
    const eventDateTime = new Date(`${event.event_date}T${event.event_time}`);
    return new Date() > eventDateTime;
  })();

  const handleBook = async () => {
    if (!isAuthenticated || role !== 'User') {
      navigate('/login/user');
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await api.post('/users/bookings', { event_id: Number(id), payment_method: method });
      setMessage({ type: 'success', text: `Booking created! Total ৳${res.data.total_amount}. Payment is pending admin verification.` });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Booking failed' });
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

          <div className="flex flex-wrap gap-6 text-sm text-body mb-6">
            <span className="flex items-center gap-2">
              <CalendarDays size={16} /> {event.event_date} · {formatTime12hr(event.event_time)}
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={16} /> {event.event_venue}
            </span>
          </div>

          <div className="card p-6">
            <h3 className="font-bold mb-2">Organizer</h3>
            <p className="text-body text-sm">{event.organizer_first_name} {event.organizer_last_name} (ID #{event.organizer_id})</p>
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

            {!isBookingClosed && (
              <>
                <label className="block text-sm font-medium text-heading mb-1">Payment method</label>
                <select className="input-field mb-4" value={method} onChange={(e) => setMethod(e.target.value)}>
                  {METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>

                <div className="flex items-center justify-between mb-5 text-sm">
                  <span className="text-body">Total</span>
                  <span className="font-bold text-heading">৳{Number(event.ticket_price).toLocaleString()}</span>
                </div>
              </>
            )}

            {message && (
              <p className={`text-sm mb-4 ${message.type === 'error' ? 'text-errorc' : 'text-success'}`}>{message.text}</p>
            )}

            <button
              onClick={handleBook}
              disabled={submitting || isBookingClosed}
              className={`w-full text-center disabled:opacity-60 disabled:cursor-not-allowed ${
                isBookingClosed
                  ? 'bg-slate-300 text-slate-600 font-semibold py-3 rounded-xl'
                  : 'btn-accent'
              }`}
            >
              {isBookingClosed ? 'Booking Closed' : submitting ? 'Booking...' : 'Book Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
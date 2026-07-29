import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { CalendarDays, MapPin, Ticket } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import TimeInput12hr from '../components/TimeInput12hr';

const METHODS = ['bKash', 'Nagad', 'Credit Card', 'Debit Card', 'Cash'];
const EVENT_TYPES = [
  'Conference', 'Workshop', 'Seminar', 'Concert', 'Festival',
  'Wedding', 'Birthday Party', 'Corporate Event', 'Networking',
  'Sports', 'Exhibition', 'Charity', 'Other'
];

export default function RequestCustomEvent() {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedType = searchParams.get('type') || '';
  const sourceEventId = searchParams.get('event_id') || '';

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: { event_type: preselectedType }
  });
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const price = useWatch({ control, name: 'ticket_price' });

  const onSubmit = async (data) => {
    if (!isAuthenticated || role !== 'User') {
      navigate('/login/user');
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      const payload = { ...data };
      if (sourceEventId) payload.source_event_id = Number(sourceEventId);
      await api.post('/users/bookings/custom', payload);
      setMessage({ type: 'success', text: 'Your custom event request has been submitted! Our admin team will verify your payment shortly.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Submission failed' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-app py-12 max-w-2xl">
      <h1 className="text-3xl mb-2">Request a Custom Event</h1>
      <p className="text-body mb-8">
        {preselectedType
          ? `You're requesting a ${preselectedType} event — give it your own name, date, time and venue.`
          : "Tell us what you're planning and we'll take care of the rest."}
      </p>

      {!isAuthenticated && (
        <div className="card p-4 mb-6 bg-primary/5 text-sm text-heading">
          You'll need to <a href="/login/user" className="text-primary font-semibold">log in</a> to submit a request.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="card p-6 sm:p-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-heading mb-1">Event Name</label>
          <input className="input-field" {...register('event_name', { required: true })} />
          {errors.event_name && <p className="text-errorc text-xs mt-1">Event name is required</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-heading mb-1">Event Type</label>
          <select
            className={`input-field ${preselectedType ? 'pointer-events-none bg-slate-50' : ''}`}
            {...register('event_type', { required: true })}
          >
            <option value="" disabled>Select a category...</option>
            {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          {errors.event_type && <p className="text-errorc text-xs mt-1">Event type is required</p>}
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-heading mb-1">Preferred Date</label>
            <div className="relative">
              <CalendarDays size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input type="date" className="input-field !pl-10" {...register('event_date', { required: true })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-heading mb-1">Preferred Time</label>
            <Controller
              name="event_time"
              control={control}
              rules={{ required: true }}
              defaultValue=""
              render={({ field }) => (
                <TimeInput12hr required value={field.value} onChange={field.onChange} />
              )}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-heading mb-1">Venue</label>
          <div className="relative">
            <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input className="input-field !pl-10" {...register('event_venue', { required: true })} />
          </div>
          {errors.event_venue && <p className="text-errorc text-xs mt-1">Venue is required</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-heading mb-1">Price (৳)</label>
          <div className="relative">
            <Ticket size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input type="number" min={1} className="input-field !pl-10" {...register('ticket_price', { required: true, min: 1 })} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-heading mb-2">Payment Method</label>
          <select className="input-field" {...register('payment_method', { required: true })}>
            {METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        {price > 0 && (
          <p className="text-sm text-body">
            You'll pay the full ৳{Number(price).toLocaleString()} now.
          </p>
        )}

        {message && (
          <p className={`text-sm ${message.type === 'error' ? 'text-errorc' : 'text-success'}`}>{message.text}</p>
        )}

        <button type="submit" disabled={submitting} className="btn-accent w-full disabled:opacity-60">
          {submitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
}
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const METHODS = ['bKash', 'Nagad', 'Credit Card', 'Debit Card', 'Cash'];
const EVENT_TYPES = [
  'Conference', 'Workshop', 'Seminar', 'Concert', 'Festival',
  'Wedding', 'Birthday Party', 'Corporate Event', 'Networking',
  'Sports', 'Exhibition', 'Charity', 'Other'
];

export default function RequestCustomEvent() {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, control, formState: { errors } } = useForm({ defaultValues: { payment_plan: 'Full' } });
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const budget = useWatch({ control, name: 'estimated_budget' });
  const plan = useWatch({ control, name: 'payment_plan' });
  const half = budget ? Math.round((Number(budget) / 2) * 100) / 100 : 0;

  const onSubmit = async (data) => {
    if (!isAuthenticated || role !== 'User') {
      navigate('/login/user');
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      await api.post('/users/bookings/custom', data);
      setMessage({ type: 'success', text: 'Your custom event request has been submitted! Our admin team will verify payment and assign an organizer.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Submission failed' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-app py-12 max-w-2xl">
      <h1 className="text-3xl mb-2">Request a Custom Event</h1>
      <p className="text-body mb-8">Tell us what you're planning and we'll take care of the rest.</p>

      {!isAuthenticated && (
        <div className="card p-4 mb-6 bg-primary/5 text-sm text-heading">
          You'll need to <a href="/login/user" className="text-primary font-semibold">log in</a> to submit a request.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="card p-6 sm:p-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-heading mb-1">Event Type</label>
          <select className="input-field" {...register('event_type', { required: true })}>
            <option value="" disabled>Select a category...</option>
            {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          {errors.event_type && <p className="text-errorc text-xs mt-1">Event type is required</p>}
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-heading mb-1">Preferred Date</label>
            <input type="date" className="input-field" {...register('event_date', { required: true })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-heading mb-1">Preferred Time</label>
            <input type="time" className="input-field" {...register('event_time', { required: true })} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-heading mb-1">Venue</label>
          <input className="input-field" placeholder="Preferred venue or area" {...register('venue', { required: true })} />
        </div>

        <div>
          <label className="block text-sm font-medium text-heading mb-1">Total Attendance</label>
          <input type="number" min={1} className="input-field" {...register('expected_attendees', { required: true, min: 1 })} />
        </div>

        <div>
          <label className="block text-sm font-medium text-heading mb-1">Estimated Budget (৳)</label>
          <input type="number" min={1} required className="input-field" {...register('estimated_budget', { required: true, min: 1 })} />
        </div>

        <div>
          <label className="block text-sm font-medium text-heading mb-2">Payment Method</label>
          <select className="input-field" {...register('payment_method', { required: true })}>
            {METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-heading mb-2">Payment Plan</label>
          <div className="grid sm:grid-cols-2 gap-3">
            <label className={`card p-4 cursor-pointer border-2 ${plan === 'Full' ? 'border-primary' : 'border-transparent'}`}>
              <input type="radio" value="Full" className="mr-2" {...register('payment_plan')} />
              <span className="font-semibold">Full Payment</span>
              <p className="text-xs text-body mt-1">Pay the complete amount now.</p>
            </label>
            <label className={`card p-4 cursor-pointer border-2 ${plan === 'Advance' ? 'border-primary' : 'border-transparent'}`}>
              <input type="radio" value="Advance" className="mr-2" {...register('payment_plan')} />
              <span className="font-semibold">Advance Payment (50%)</span>
              <p className="text-xs text-body mt-1">Pay half now, the rest after the event.</p>
            </label>
          </div>
          {budget > 0 && (
            <p className="text-sm text-body mt-3">
              {plan === 'Advance'
                ? `You'll pay ৳${half.toLocaleString()} now, and ৳${half.toLocaleString()} after the event is completed.`
                : `You'll pay the full ৳${Number(budget).toLocaleString()} now.`}
            </p>
          )}
        </div>

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
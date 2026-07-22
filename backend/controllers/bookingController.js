const Booking = require('../models/Booking');
const Event = require('../models/Event');
const Payment = require('../models/Payment');
const paymentService = require('../services/paymentService');
const { missingFields, isFutureDate, isPositiveNumber } = require('../utils/validation');

// Book an existing event — one Booking, one Payment for the full ticket price.
exports.bookEvent = async (req, res, next) => {
  try {
    const missing = missingFields(req.body, ['event_id', 'payment_method']);
    if (missing.length) {
      return res.status(400).json({ success: false, message: `Missing fields: ${missing.join(', ')}` });
    }
    const { event_id, payment_method } = req.body;

    paymentService.assertValidMethod(payment_method);

    const event = await Event.findById(event_id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const booking_id = await Booking.create({
      event_id,
      event_date: event.event_date,
      event_time: event.event_time,
      event_venue: event.event_venue,
      user_id: req.auth.user_id
    });

    await Payment.create({ payment_method, payment_amount: event.ticket_price, booking_id });

    res.status(201).json({
      success: true,
      message: 'Booking created. Payment is pending verification.',
      booking_id,
      total_amount: event.ticket_price
    });
  } catch (err) {
    next(err);
  }
};

// Request a custom event — user chooses Full payment or a 50% Advance.
// The Estimated Budget is used only to calculate the Payment.payment_amount value(s);
// it is never stored as its own column.
exports.requestCustomEvent = async (req, res, next) => {
  try {
    const missing = missingFields(req.body, ['event_type', 'event_date', 'event_time', 'venue', 'estimated_budget', 'payment_method', 'payment_plan']);
    if (missing.length) {
      return res.status(400).json({ success: false, message: `Missing fields: ${missing.join(', ')}` });
    }
    const { event_date, event_time, venue, payment_method, estimated_budget, payment_plan } = req.body;

    paymentService.assertValidMethod(payment_method);
    if (!isFutureDate(event_date)) {
      return res.status(400).json({ success: false, message: 'Event date cannot be in the past' });
    }
    if (!isPositiveNumber(estimated_budget)) {
      return res.status(400).json({ success: false, message: 'Estimated budget must be a positive number' });
    }
    if (!['Full', 'Advance'].includes(payment_plan)) {
      return res.status(400).json({ success: false, message: 'Payment plan must be Full or Advance' });
    }

    const budget = Number(estimated_budget);

    const booking_id = await Booking.create({
      event_id: null,
      event_date,
      event_time,
      event_venue: venue,
      user_id: req.auth.user_id
    });

    if (payment_plan === 'Full') {
      await Payment.create({ payment_method, payment_amount: budget, booking_id });
    } else {
      // Advance: only the 50% due now is recorded. The remaining 50% is only
      // created later, when the user actually submits it via payRemaining below.
      const half = Math.round((budget / 2) * 100) / 100;
      await Payment.create({ payment_method, payment_amount: half, booking_id });
    }

    res.status(201).json({ success: true, message: 'Custom event request submitted', booking_id });
  } catch (err) {
    next(err);
  }
};

exports.myBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.byUser(req.auth.user_id);
    const withPayments = await Promise.all(
      bookings.map(async (b) => ({ ...b, ...(await Payment.paidAndDue(b.booking_id)) }))
    );
    res.json({ success: true, bookings: withPayments });
  } catch (err) {
    next(err);
  }
};

// Submits the remaining balance for a custom event booking that was paid in two
// installments. Only allowed once: after the first (advance) payment exists and
// is Confirmed, and before a second payment has already been submitted.
exports.payRemaining = async (req, res, next) => {
  try {
    const { payment_method } = req.body;
    if (!payment_method) {
      return res.status(400).json({ success: false, message: 'payment_method is required' });
    }
    paymentService.assertValidMethod(payment_method);

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.user_id !== req.auth.user_id) {
      return res.status(403).json({ success: false, message: 'You can only pay for your own bookings' });
    }

    const payments = await Payment.byBooking(req.params.id);
    if (payments.length === 0) {
      return res.status(400).json({ success: false, message: 'No advance payment found for this booking' });
    }
    if (payments.length >= 2) {
      return res.status(400).json({ success: false, message: 'The remaining balance has already been submitted' });
    }
    if (payments[0].payment_status !== 'Confirmed') {
      return res.status(400).json({ success: false, message: 'Your advance payment must be confirmed before paying the remaining balance' });
    }

    // Even 50/50 split, so the remaining amount matches what was already paid.
    const remaining_amount = payments[0].payment_amount;
    const payment_id = await Payment.create({ payment_method, payment_amount: remaining_amount, booking_id: req.params.id });

    res.status(201).json({ success: true, message: 'Remaining balance submitted. Awaiting admin verification.', payment_id });
  } catch (err) {
    next(err);
  }
};

exports.cancel = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.user_id !== req.auth.user_id) {
      return res.status(403).json({ success: false, message: 'You can only cancel your own bookings' });
    }
    if (new Date(booking.event_date) < new Date()) {
      return res.status(400).json({ success: false, message: 'Cannot cancel a booking after the event has started' });
    }

    await Booking.setStatus(req.params.id, 'Cancelled');
    res.json({ success: true, message: 'Booking cancelled' });
  } catch (err) {
    next(err);
  }
};
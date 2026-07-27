const Booking = require('../models/Booking');
const Event = require('../models/Event');
const Payment = require('../models/Payment');
const Organizer = require('../models/Organizer');
const paymentService = require('../services/paymentService');
const { missingFields, isFutureDate, isPositiveNumber } = require('../utils/validation');

// Book an existing event template — user picks date/time/venue, one Payment for full price.
exports.bookEvent = async (req, res, next) => {
  try {
    const missing = missingFields(req.body, ['event_id', 'event_date', 'event_time', 'event_venue', 'payment_method']);
    if (missing.length) {
      return res.status(400).json({ success: false, message: `Missing fields: ${missing.join(', ')}` });
    }
    const { event_id, event_date, event_time, event_venue, payment_method } = req.body;

    paymentService.assertValidMethod(payment_method);

    if (!isFutureDate(event_date)) {
      return res.status(400).json({ success: false, message: 'Event date cannot be in the past' });
    }

    const event = await Event.findById(event_id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    if (event.event_status !== 'Approved') {
      return res.status(400).json({ success: false, message: 'This event is not available for booking' });
    }

    const booking_id = await Booking.create({
      event_id,
      event_date,
      event_time,
      event_venue,
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

// Request a custom event — creates an Event template + Booking instance + Payment.
// A random Approved organizer is assigned immediately as the event owner.
exports.requestCustomEvent = async (req, res, next) => {
  try {
    const missing = missingFields(req.body, ['event_name', 'event_type', 'event_date', 'event_time', 'event_venue', 'estimated_budget', 'payment_method']);
    if (missing.length) {
      return res.status(400).json({ success: false, message: `Missing fields: ${missing.join(', ')}` });
    }
    const { event_name, event_type, event_date, event_time, event_venue, payment_method, estimated_budget } = req.body;

    paymentService.assertValidMethod(payment_method);
    if (!isFutureDate(event_date)) {
      return res.status(400).json({ success: false, message: 'Event date cannot be in the past' });
    }
    if (!isPositiveNumber(estimated_budget)) {
      return res.status(400).json({ success: false, message: 'Estimated budget must be a positive number' });
    }

    const budget = Number(estimated_budget);
    const organizer = await Organizer.randomApproved();
    if (!organizer) {
      return res.status(400).json({ success: false, message: 'No approved organizer available at the moment. Please try again later.' });
    }

    // Create the custom Event template
    const event_id = await Event.create({
      event_name,
      event_type,
      ticket_price: budget,
      organizer_id: organizer.organizer_id,
      event_status: 'Pending'
    });

    // Create the Booking instance
    const booking_id = await Booking.create({
      event_id,
      event_date,
      event_time,
      event_venue,
      user_id: req.auth.user_id
    });

    await Payment.create({ payment_method, payment_amount: budget, booking_id });

    res.status(201).json({ success: true, message: 'Custom event request submitted', booking_id, event_id });
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

exports.cancel = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.user_id !== req.auth.user_id) {
      return res.status(403).json({ success: false, message: 'You can only cancel your own bookings' });
    }
    if (new Date(booking.event_date) < new Date()) {
      return res.status(400).json({ success: false, message: 'Cannot cancel a booking after the event date has passed' });
    }

    await Booking.setStatus(req.params.id, 'Cancelled');
    res.json({ success: true, message: 'Booking cancelled' });
  } catch (err) {
    next(err);
  }
};
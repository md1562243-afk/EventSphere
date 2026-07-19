const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Organizer = require('../models/Organizer');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const { signToken } = require('../utils/token');
const emailService = require('../services/emailService');

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const admin = await Admin.findByEmail(email);
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = signToken({ admin_id: admin.admin_id, role: 'Admin' });
    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: { admin_id: admin.admin_id, first_name: admin.first_name, last_name: admin.last_name, email: admin.email }
    });
  } catch (err) {
    next(err);
  }
};

// ---------- Organizers ----------
exports.listOrganizers = async (req, res, next) => {
  try {
    const organizers = await Organizer.all(req.query.status);
    res.json({ success: true, organizers });
  } catch (err) {
    next(err);
  }
};

exports.approveOrganizer = async (req, res, next) => {
  try {
    const organizer = await Organizer.findById(req.params.id);
    if (!organizer) return res.status(404).json({ success: false, message: 'Organizer not found' });

    await Organizer.updateStatus(req.params.id, 'Approved', req.auth.admin_id);
    const full = await Organizer.findById(req.params.id);
    emailService.organizerApproved(full.email || organizer.email, full.first_name);
    res.json({ success: true, message: 'Organizer approved' });
  } catch (err) {
    next(err);
  }
};

exports.rejectOrganizer = async (req, res, next) => {
  try {
    await Organizer.updateStatus(req.params.id, 'Rejected', req.auth.admin_id);
    res.json({ success: true, message: 'Organizer rejected' });
  } catch (err) {
    next(err);
  }
};

// ---------- Users ----------
exports.listUsers = async (req, res, next) => {
  try {
    const users = await User.all();
    res.json({ success: true, users });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await User.delete(req.params.id);
    res.json({ success: true, message: 'User removed' });
  } catch (err) {
    next(err);
  }
};

exports.deleteOrganizer = async (req, res, next) => {
  try {
    await Organizer.delete(req.params.id);
    res.json({ success: true, message: 'Organizer removed' });
  } catch (err) {
    next(err);
  }
};

// ---------- Events ----------
// Admin supervises events created by organizers — no approve/reject step exists;
// every organizer-created event is already live. Admin can only view/delete.
exports.listEvents = async (req, res, next) => {
  try {
    const events = await Event.search({ limit: 200, page: 1 });
    res.json({ success: true, events });
  } catch (err) {
    next(err);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    await Event.delete(req.params.id);
    res.json({ success: true, message: 'Event deleted' });
  } catch (err) {
    next(err);
  }
};

// ---------- Bookings ----------
exports.listBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.all({ status: req.query.status });
    const withPayments = await Promise.all(
      bookings.map(async (b) => ({ ...b, ...(await Payment.paidAndDue(b.booking_id)) }))
    );
    res.json({ success: true, bookings: withPayments });
  } catch (err) {
    next(err);
  }
};

exports.assignOrganizer = async (req, res, next) => {
  try {
    const { organizer_id, event_name, event_type, ticket_price } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.event_id) {
      return res.status(400).json({ success: false, message: 'This booking is already linked to an event' });
    }

    const event_id = await Event.create({
      event_name: event_name || `Custom Event #${booking.booking_id}`,
      event_type: event_type || 'Other',
      event_date: booking.event_date,
      event_time: booking.event_time,
      event_venue: booking.event_venue,
      ticket_price: ticket_price || 0.01,
      organizer_id
    });

    await Booking.assignEvent(req.params.id, event_id);

    const organizer = await Organizer.findById(organizer_id);
    emailService.organizerCustomEventAssigned(organizer.email, event_type || 'Custom Event');
    emailService.userOrganizerAssigned(booking.user_email, event_type || 'Custom Event');

    res.json({ success: true, message: 'Organizer assigned to custom event', event_id });
  } catch (err) {
    next(err);
  }
};

// ---------- Payments ----------
exports.listPayments = async (req, res, next) => {
  try {
    const payments = await Payment.all(req.query.status);
    res.json({ success: true, payments });
  } catch (err) {
    next(err);
  }
};

exports.confirmPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });

    await Payment.confirm(req.params.id, req.auth.admin_id);
    // Once at least one payment on a booking is confirmed, the booking itself is Confirmed.
    // Whether it's fully or partially paid is shown via Payment.paidAndDue, not the booking row.
    await Booking.setStatus(payment.booking_id, 'Confirmed', req.auth.admin_id);

    const booking = await Booking.findById(payment.booking_id);
    if (booking) {
      emailService.userPaymentConfirmed(booking.user_email, payment.event_name || booking.event_name || 'your event');
    }

    res.json({ success: true, message: 'Payment confirmed' });
  } catch (err) {
    next(err);
  }
};

// ---------- Dashboard / Reports ----------
exports.dashboard = async (req, res, next) => {
  try {
    const [
      total_users, total_organizers, pending_organizers,
      pending_payments, total_events, revenue
    ] = await Promise.all([
      User.count(),
      Organizer.count(),
      Organizer.countByStatus('Pending'),
      Payment.countByStatus('Pending'),
      Event.countAll(),
      Payment.totalRevenue()
    ]);

    res.json({
      success: true,
      dashboard: {
        total_users,
        total_organizers,
        pending_organizer_requests: pending_organizers,
        pending_payments,
        total_revenue: revenue,
        total_events
      }
    });
  } catch (err) {
    next(err);
  }
};

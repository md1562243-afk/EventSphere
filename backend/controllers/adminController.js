const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Organizer = require('../models/Organizer');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const { signToken } = require('../utils/token');
const emailService = require('../services/emailService');

const SEED_ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@eventsphere.com';

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

exports.createAdmin = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existing = await Admin.findByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'An admin with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin_id = await Admin.create({ first_name, last_name, email, hashedPassword });

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      admin: { admin_id, first_name, last_name, email }
    });
  } catch (err) {
    next(err);
  }
};

exports.listAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.all();
    res.json({ success: true, admins });
  } catch (err) {
    next(err);
  }
};

exports.deleteAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });

    if (admin.email === SEED_ADMIN_EMAIL) {
      return res.status(403).json({ success: false, message: 'Seed admin cannot be deleted' });
    }

    await Admin.delete(req.params.id);
    res.json({ success: true, message: 'Admin removed' });
  } catch (err) {
    next(err);
  }
};

// ---------- Admin Profile & Phones ----------
exports.getProfile = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.auth.admin_id);
    const phones = await Admin.getPhones(req.auth.admin_id);
    const { password, ...safeAdmin } = admin;
    res.json({ success: true, admin: { ...safeAdmin, phones } });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { first_name, last_name } = req.body;
    if (!first_name || !last_name) {
      return res.status(400).json({ success: false, message: 'First name and last name are required' });
    }
    await Admin.updateProfile(req.auth.admin_id, { first_name, last_name });
    res.json({ success: true, message: 'Profile updated' });
  } catch (err) {
    next(err);
  }
};

exports.addPhone = async (req, res, next) => {
  try {
    const { phone_no } = req.body;
    if (!phone_no) return res.status(400).json({ success: false, message: 'Phone number required' });
    await Admin.addPhone(req.auth.admin_id, phone_no);
    res.json({ success: true, message: 'Phone number added' });
  } catch (err) {
    next(err);
  }
};

exports.removePhone = async (req, res, next) => {
  try {
    await Admin.removePhone(req.auth.admin_id, req.params.phone);
    res.json({ success: true, message: 'Phone number removed' });
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
    const organizer = await Organizer.findById(req.params.id);
    if (!organizer) return res.status(404).json({ success: false, message: 'Organizer not found' });

    await Organizer.delete(req.params.id);
    res.json({ success: true, message: 'Organizer and all related data removed' });
  } catch (err) {
    next(err);
  }
};

// ---------- Events ----------
exports.listEvents = async (req, res, next) => {
  try {
    const events = await Event.search({ includeCustom: true, limit: 200, page: 1 });
    res.json({ success: true, events });
  } catch (err) {
    next(err);
  }
};

exports.approveEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    await Event.setStatus(req.params.id, 'Approved', req.auth.admin_id);
    res.json({ success: true, message: 'Event approved' });
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

// ---------- Payments ----------
exports.listPayments = async (req, res, next) => {
  try {
    const payments = await Payment.all();
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
    await Booking.setStatus(payment.booking_id, 'Confirmed', req.auth.admin_id);

    const booking = await Booking.findById(payment.booking_id);
    if (booking && booking.event_id) {
      const event = await Event.findById(booking.event_id);
      if (event && event.event_status === 'Pending') {
        await Event.setStatus(event.event_id, 'Approved', req.auth.admin_id);
      }
    }

    if (booking) {
      emailService.userPaymentConfirmed(booking.user_email || '', 'your event');
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
      pending_bookings, total_events, revenue
    ] = await Promise.all([
      User.count(),
      Organizer.count(),
      Organizer.countByStatus('Pending'),
      Booking.all({ status: 'Pending' }).then(b => b.length),
      Event.countAll(),
      Payment.totalRevenue()
    ]);

    res.json({
      success: true,
      dashboard: {
        total_users,
        total_organizers,
        pending_organizer_requests: pending_organizers,
        pending_bookings,
        total_revenue: revenue,
        total_events
      }
    });
  } catch (err) {
    next(err);
  }
};
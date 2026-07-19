const bcrypt = require('bcryptjs');
const Organizer = require('../models/Organizer');
const Admin = require('../models/Admin');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const { signToken } = require('../utils/token');
const { isValidEmail, isStrongPassword, missingFields } = require('../utils/validation');
const emailService = require('../services/emailService');

exports.register = async (req, res, next) => {
  try {
    const missing = missingFields(req.body, ['first_name', 'last_name', 'email', 'password']);
    if (missing.length) {
      return res.status(400).json({ success: false, message: `Missing fields: ${missing.join(', ')}` });
    }
    const { first_name, last_name, email, password, phone_no } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }
    if (!isStrongPassword(password)) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters and include a letter and a number' });
    }

    const existing = await Organizer.findByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const organizer_id = await Organizer.create({ first_name, last_name, email, hashedPassword });

    if (phone_no) {
      await Organizer.addPhone(organizer_id, phone_no);
    }

    emailService.organizerRegistrationPending(email, first_name);
    const admins = await Admin.all();
    admins.forEach((a) => emailService.adminNewOrganizer(a.email, `${first_name} ${last_name}`));

    res.status(201).json({
      success: true,
      message: 'Registration successful. Your account is pending admin approval.',
      organizer: { organizer_id, first_name, last_name, email, status: 'Pending' }
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const organizer = await Organizer.findByEmail(email);
    if (!organizer) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, organizer.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (organizer.status !== 'Approved') {
      return res.status(403).json({ success: false, message: `Your account is ${organizer.status.toLowerCase()}. Please wait for admin approval.` });
    }

    const token = signToken({ organizer_id: organizer.organizer_id, role: 'Organizer' });
    res.json({
      success: true,
      message: 'Login successful',
      token,
      organizer: { organizer_id: organizer.organizer_id, first_name: organizer.first_name, last_name: organizer.last_name, email: organizer.email }
    });
  } catch (err) {
    next(err);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const organizer = await Organizer.findById(req.auth.organizer_id);
    const phones = await Organizer.getPhones(req.auth.organizer_id);
    res.json({ success: true, organizer: { ...organizer, phones } });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { first_name, last_name } = req.body;
    await Organizer.updateProfile(req.auth.organizer_id, { first_name, last_name });
    res.json({ success: true, message: 'Profile updated' });
  } catch (err) {
    next(err);
  }
};

exports.addPhone = async (req, res, next) => {
  try {
    const { phone_no } = req.body;
    if (!phone_no) return res.status(400).json({ success: false, message: 'phone_no is required' });
    await Organizer.addPhone(req.auth.organizer_id, phone_no);
    res.json({ success: true, message: 'Phone number added' });
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body;
    const basic = await Organizer.findById(req.auth.organizer_id);
    const full = await Organizer.findByEmail(basic.email); // includes password hash

    const match = await bcrypt.compare(current_password, full.password);
    if (!match) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    if (!isStrongPassword(new_password)) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters and include a letter and a number' });
    }
    const hashed = await bcrypt.hash(new_password, 10);
    await Organizer.updatePassword(req.auth.organizer_id, hashed);
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
};

exports.dashboard = async (req, res, next) => {
  try {
    const organizer_id = req.auth.organizer_id;
    const total_events = await Event.countByOrganizer(organizer_id);
    const bookings = await Booking.byOrganizer(organizer_id);
    const revenue = await Payment.totalRevenue(organizer_id);

    res.json({
      success: true,
      dashboard: {
        total_events,
        total_bookings: bookings.length,
        revenue
      },
      recent_bookings: bookings.slice(0, 5)
    });
  } catch (err) {
    next(err);
  }
};

exports.myEvents = async (req, res, next) => {
  try {
    const events = await Event.search({ organizer_id: req.auth.organizer_id, limit: 100, page: 1 });
    res.json({ success: true, events });
  } catch (err) {
    next(err);
  }
};

exports.myBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.byOrganizer(req.auth.organizer_id);
    res.json({ success: true, bookings });
  } catch (err) {
    next(err);
  }
};

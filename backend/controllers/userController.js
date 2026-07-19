const bcrypt = require('bcryptjs');
const User = require('../models/User');
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

    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user_id = await User.create({ first_name, last_name, email, hashedPassword });

    if (phone_no) {
      await User.addPhone(user_id, phone_no);
    }

    emailService.userWelcome(email, first_name);

    const token = signToken({ user_id, role: 'User' });
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: { user_id, first_name, last_name, email }
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

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = signToken({ user_id: user.user_id, role: 'User' });
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { user_id: user.user_id, first_name: user.first_name, last_name: user.last_name, email: user.email }
    });
  } catch (err) {
    next(err);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth.user_id);
    const phones = await User.getPhones(req.auth.user_id);
    res.json({ success: true, user: { ...user, phones } });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { first_name, last_name } = req.body;
    await User.updateProfile(req.auth.user_id, { first_name, last_name });
    res.json({ success: true, message: 'Profile updated' });
  } catch (err) {
    next(err);
  }
};

exports.addPhone = async (req, res, next) => {
  try {
    const { phone_no } = req.body;
    if (!phone_no) return res.status(400).json({ success: false, message: 'phone_no is required' });
    await User.addPhone(req.auth.user_id, phone_no);
    res.json({ success: true, message: 'Phone number added' });
  } catch (err) {
    next(err);
  }
};

exports.removePhone = async (req, res, next) => {
  try {
    await User.removePhone(req.auth.user_id, req.params.phone);
    res.json({ success: true, message: 'Phone number removed' });
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body;
    const basic = await User.findById(req.auth.user_id);
    const full = await User.findByEmail(basic.email); // includes password hash

    const match = await bcrypt.compare(current_password, full.password);
    if (!match) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    if (!isStrongPassword(new_password)) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters and include a letter and a number' });
    }
    const hashed = await bcrypt.hash(new_password, 10);
    await User.updatePassword(req.auth.user_id, hashed);
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
};

exports.dashboard = async (req, res, next) => {
  try {
    const user_id = req.auth.user_id;
    const bookings = await Booking.byUser(user_id);
    const total_bookings = bookings.length;
    const upcoming_events = bookings.filter((b) => b.booking_status === 'Confirmed' && new Date(b.event_date) >= new Date()).length;
    const completed_events = bookings.filter((b) => b.booking_status === 'Confirmed' && new Date(b.event_date) < new Date()).length;
    const pending_payments = bookings.filter((b) => b.booking_status === 'Pending').length;

    res.json({
      success: true,
      dashboard: { total_bookings, upcoming_events, completed_events, pending_payments },
      recent_bookings: bookings.slice(0, 5)
    });
  } catch (err) {
    next(err);
  }
};

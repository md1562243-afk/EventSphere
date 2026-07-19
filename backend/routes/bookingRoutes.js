const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

// Generic booking lookup, accessible to any authenticated role that owns
// or manages the booking. Role-specific creation/listing endpoints live
// under /api/users and /api/organizers per their respective workflows.
router.get('/:id', auth, async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    const { role, user_id, admin_id } = req.auth;
    const isOwner = role === 'User' && booking.user_id === user_id;
    const isAdmin = role === 'Admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    res.json({ success: true, booking });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

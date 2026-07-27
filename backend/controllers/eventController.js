const Event = require('../models/Event');
const { missingFields, isPositiveNumber } = require('../utils/validation');

// Public browse — only Approved event templates by Approved organizers.
exports.browse = async (req, res, next) => {
  try {
    const { q, type, minPrice, maxPrice, sort, page, limit } = req.query;
    const events = await Event.search({ q, type, minPrice, maxPrice, sort, page, limit });
    res.json({ success: true, events });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    const isOwner = req.auth && req.auth.role === 'Organizer' && event.organizer_id === req.auth.organizer_id;
    const isAdmin = req.auth && req.auth.role === 'Admin';
    if (event.event_status !== 'Approved' && !isOwner && !isAdmin) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (req.auth && req.auth.role === 'User') {
      await Event.recordBrowse(event.event_id, req.auth.user_id);
    }

    res.json({ success: true, event });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const missing = missingFields(req.body, ['event_name', 'event_type', 'ticket_price']);
    if (missing.length) {
      return res.status(400).json({ success: false, message: `Missing fields: ${missing.join(', ')}` });
    }
    const { event_name, event_type, ticket_price } = req.body;

    if (!isPositiveNumber(ticket_price)) {
      return res.status(400).json({ success: false, message: 'Ticket price must be a positive number' });
    }

    const event_id = await Event.create({
      event_name, event_type, ticket_price,
      organizer_id: req.auth.organizer_id,
      event_status: 'Pending'
    });

    res.status(201).json({ success: true, message: 'Event submitted and is awaiting admin approval', event_id });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    if (event.organizer_id !== req.auth.organizer_id) {
      return res.status(403).json({ success: false, message: 'You can only edit your own events' });
    }

    const allowedFields = ['event_name', 'event_type', 'ticket_price'];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    updates.event_status = 'Pending';

    await Event.update(req.params.id, updates);
    res.json({ success: true, message: 'Event updated and is awaiting admin re-approval' });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    if (event.organizer_id !== req.auth.organizer_id) {
      return res.status(403).json({ success: false, message: 'You can only delete your own events' });
    }
    await Event.delete(req.params.id);
    res.json({ success: true, message: 'Event deleted' });
  } catch (err) {
    next(err);
  }
};
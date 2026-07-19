const Event = require('../models/Event');
const { missingFields, isPositiveNumber, isFutureDate } = require('../utils/validation');

// Public browse — every event is visible as soon as an organizer creates it.
exports.browse = async (req, res, next) => {
  try {
    const { q, type, date, venue, minPrice, maxPrice, sort, page, limit } = req.query;
    const events = await Event.search({ q, type, date, venue, minPrice, maxPrice, sort, page, limit });
    res.json({ success: true, events });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    // Record browse (many-to-many User <-> Event) if a logged-in user views it
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
    const missing = missingFields(req.body, ['event_name', 'event_type', 'event_date', 'event_time', 'event_venue', 'ticket_price']);
    if (missing.length) {
      return res.status(400).json({ success: false, message: `Missing fields: ${missing.join(', ')}` });
    }
    const { event_name, event_type, event_date, event_time, event_venue, ticket_price } = req.body;

    if (!isPositiveNumber(ticket_price)) {
      return res.status(400).json({ success: false, message: 'Ticket price must be a positive number' });
    }
    if (!isFutureDate(event_date)) {
      return res.status(400).json({ success: false, message: 'Event date cannot be in the past' });
    }

    // Event becomes browsable/bookable immediately — organizers don't need admin approval to publish.
    const event_id = await Event.create({
      event_name, event_type, event_date, event_time, event_venue, ticket_price,
      organizer_id: req.auth.organizer_id
    });

    res.status(201).json({ success: true, message: 'Event created and is now live', event_id });
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

    const allowedFields = ['event_name', 'event_type', 'event_date', 'event_time', 'event_venue', 'ticket_price'];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    await Event.update(req.params.id, updates);
    res.json({ success: true, message: 'Event updated' });
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

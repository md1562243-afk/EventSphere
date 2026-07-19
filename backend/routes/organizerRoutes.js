const express = require('express');
const router = express.Router();
const organizerController = require('../controllers/organizerController');
const eventController = require('../controllers/eventController');
const auth = require('../middleware/auth');
const { verifyOrganizer } = require('../middleware/verifyRole');

// Public
router.post('/register', organizerController.register);
router.post('/login', organizerController.login);

// Protected (Organizer only)
router.get('/profile', auth, verifyOrganizer, organizerController.getProfile);
router.put('/profile', auth, verifyOrganizer, organizerController.updateProfile);
router.post('/phone', auth, verifyOrganizer, organizerController.addPhone);
router.put('/change-password', auth, verifyOrganizer, organizerController.changePassword);
router.get('/dashboard', auth, verifyOrganizer, organizerController.dashboard);
router.get('/events', auth, verifyOrganizer, organizerController.myEvents);
router.get('/bookings', auth, verifyOrganizer, organizerController.myBookings);

router.post('/events', auth, verifyOrganizer, eventController.create);
router.put('/events/:id', auth, verifyOrganizer, eventController.update);
router.delete('/events/:id', auth, verifyOrganizer, eventController.remove);

module.exports = router;

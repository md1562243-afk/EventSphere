const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const { verifyAdmin } = require('../middleware/verifyRole');

// Public
router.post('/login', adminController.login);

// Protected (Admin only) — no public registration per spec
router.use(auth, verifyAdmin);

router.get('/dashboard', adminController.dashboard);

router.get('/organizers', adminController.listOrganizers);
router.put('/organizers/:id/approve', adminController.approveOrganizer);
router.put('/organizers/:id/reject', adminController.rejectOrganizer);
router.delete('/organizers/:id', adminController.deleteOrganizer);

router.get('/users', adminController.listUsers);
router.delete('/users/:id', adminController.deleteUser);

router.get('/events', adminController.listEvents);
router.delete('/events/:id', adminController.deleteEvent);

router.get('/bookings', adminController.listBookings);
router.put('/bookings/:id/assign-organizer', adminController.assignOrganizer);

router.get('/payments', adminController.listPayments);
router.put('/payments/:id/confirm', adminController.confirmPayment);

module.exports = router;

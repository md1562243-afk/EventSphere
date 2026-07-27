const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// Public
router.post('/login', adminController.login);

// Protected — Admin only
router.use(authenticate, authorize('Admin'));

router.post('/create', adminController.createAdmin);
router.get('/all', adminController.listAdmins);
router.delete('/:id', adminController.deleteAdmin);

router.get('/organizers', adminController.listOrganizers);
router.put('/organizers/:id/approve', adminController.approveOrganizer);
router.put('/organizers/:id/reject', adminController.rejectOrganizer);
router.delete('/organizers/:id', adminController.deleteOrganizer);

router.get('/users', adminController.listUsers);
router.delete('/users/:id', adminController.deleteUser);

router.get('/events', adminController.listEvents);
router.put('/events/:id/approve', adminController.approveEvent);
router.delete('/events/:id', adminController.deleteEvent);

router.get('/bookings', adminController.listBookings);
router.get('/payments', adminController.listPayments);
router.put('/payments/:id/confirm', adminController.confirmPayment);

router.get('/dashboard', adminController.dashboard);

module.exports = router;
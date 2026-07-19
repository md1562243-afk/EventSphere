const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const bookingController = require('../controllers/bookingController');
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');
const { verifyUser } = require('../middleware/verifyRole');

// Public
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected (User only)
router.get('/profile', auth, verifyUser, userController.getProfile);
router.put('/profile', auth, verifyUser, userController.updateProfile);
router.post('/phone', auth, verifyUser, userController.addPhone);
router.delete('/phone/:phone', auth, verifyUser, userController.removePhone);
router.put('/change-password', auth, verifyUser, userController.changePassword);
router.get('/dashboard', auth, verifyUser, userController.dashboard);

router.post('/bookings', auth, verifyUser, bookingController.bookEvent);
router.post('/bookings/custom', auth, verifyUser, bookingController.requestCustomEvent);
router.get('/bookings', auth, verifyUser, bookingController.myBookings);
router.put('/bookings/:id/cancel', auth, verifyUser, bookingController.cancel);
router.post('/bookings/:id/pay-remaining', auth, verifyUser, bookingController.payRemaining);

router.get('/payments', auth, verifyUser, paymentController.myPayments);

module.exports = router;
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');

router.get('/booking/:bookingId', auth, paymentController.getByBooking);

module.exports = router;

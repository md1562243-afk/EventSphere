const Payment = require('../models/Payment');

exports.myPayments = async (req, res, next) => {
  try {
    const payments = await Payment.byUser(req.auth.user_id);
    res.json({ success: true, payments });
  } catch (err) {
    next(err);
  }
};

exports.getByBooking = async (req, res, next) => {
  try {
    const payments = await Payment.byBooking(req.params.bookingId);
    res.json({ success: true, payments });
  } catch (err) {
    next(err);
  }
};

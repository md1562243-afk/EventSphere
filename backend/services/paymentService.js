const { isValidPaymentMethod } = require('../utils/validation');

function assertValidMethod(method) {
  if (!isValidPaymentMethod(method)) {
    const err = new Error('Invalid payment method. Use bKash, Nagad, Credit Card, Debit Card, or Cash');
    err.status = 400;
    throw err;
  }
}

module.exports = { assertValidMethod };

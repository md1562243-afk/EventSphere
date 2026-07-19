function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');
}

function isStrongPassword(password) {
  // At least 8 characters, one letter and one number
  return typeof password === 'string' && password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);
}

function isValidPhone(phone) {
  return /^[0-9+\-\s()]{7,20}$/.test(phone || '');
}

function isPositiveNumber(value) {
  return typeof value === 'number' ? value > 0 : !isNaN(value) && Number(value) > 0;
}

function isFutureDate(dateStr) {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
}

const VALID_PAYMENT_METHODS = ['bKash', 'Nagad', 'Credit Card', 'Debit Card', 'Cash'];

function isValidPaymentMethod(method) {
  return VALID_PAYMENT_METHODS.includes(method);
}

function missingFields(body, required) {
  return required.filter((field) => body[field] === undefined || body[field] === null || body[field] === '');
}

module.exports = {
  isValidEmail,
  isStrongPassword,
  isValidPhone,
  isPositiveNumber,
  isFutureDate,
  isValidPaymentMethod,
  missingFields,
  VALID_PAYMENT_METHODS
};

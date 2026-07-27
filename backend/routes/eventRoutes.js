const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Optional-auth: public browsing, but records Browse table if user is logged in
const { verifyToken } = require('../utils/token');
function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    try {
      req.auth = verifyToken(header.split(' ')[1]);
    } catch (err) {
      // ignore invalid/expired token on public routes
    }
  }
  next();
}

// Public routes
router.get('/', eventController.browse);
router.get('/:id', optionalAuth, eventController.getById);

module.exports = router;
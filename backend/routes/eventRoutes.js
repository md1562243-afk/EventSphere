const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Optional-auth middleware: attaches req.auth if a valid token is present,
// but does not block the request if there isn't one (public browsing).
const { verifyToken } = require('../utils/token');
function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    try {
      req.auth = verifyToken(header.split(' ')[1]);
    } catch (err) {
      // ignore invalid token on public routes
    }
  }
  next();
}

router.get('/', eventController.browse);
router.get('/:id', optionalAuth, eventController.getById);

module.exports = router;

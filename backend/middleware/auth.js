const { verifyToken } = require('../utils/token');

function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const token = header.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.auth = decoded; // { user_id | organizer_id | admin_id, role }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

module.exports = auth;

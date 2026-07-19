function verifyRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.auth || !allowedRoles.includes(req.auth.role)) {
      return res.status(403).json({ success: false, message: 'Access denied for this role' });
    }
    next();
  };
}

const verifyUser = verifyRole('User');
const verifyOrganizer = verifyRole('Organizer');
const verifyAdmin = verifyRole('Admin');

module.exports = { verifyRole, verifyUser, verifyOrganizer, verifyAdmin };
